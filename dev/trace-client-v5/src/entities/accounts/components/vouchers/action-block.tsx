import { useState, useEffect, useRef, useContext } from 'react'
// import { arbitraryData } from './arbitrary-data'
import { 
    // makeStyles, 
    Theme, createStyles } from '@mui/material'
    import { makeStyles } from '@mui/styles'
import { LedgerSubledger } from '../common/ledger-subledger'
import { useSharedElements } from '../common/shared-elements-hook'
import { VoucherContext } from './voucher-context'

function ActionBlock({
    actionType,
    actionLabel,
    allowAddRemove,
    allowInstrNo,
    allowRowGst,
    ledgerAccounts,
    notifyOnChange,
    allowFreeze,
}: any) {
    const [, setRefresh] = useState({})
    const arbitraryData: any = useContext(VoucherContext)
    const isGst = !!arbitraryData.header.isGst
    const tranTypeId = arbitraryData.header.tranTypeId
    const classes = useStyles({ actionType, isGst, tranTypeId })
    const ad: any = arbitraryData
    const {
        _,
        accountsMessages,
        AddCircle,
        Checkbox,
        emit,
        filterOn,
        getMappedAccounts,
        FormControlLabel,
        IconButton,
        NumberFormat,
        Paper,
        RemoveCircle,
        TextField,
        toDecimalFormat,
        Typography,
    } = useSharedElements()
    useEffect(() => {
        const subs1 = filterOn('ACTION-BLOCK-REFRESH').subscribe(() => {
            setRefresh({})
        })
        const subs2 = filterOn('ACTION-BLOCK-RESET-GST').subscribe(() => {
            resetGst()
        })

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            // subs3.unsubscribe()
        }
    }, [])
    return (
        <div className={classes.contentAction}>
            <Typography
                className="action-label"
                variant="subtitle2"
                component="div"
                color="secondary">
                {actionType}
            </Typography>
            <ActionRows
                ad={arbitraryData}
                actionType={actionType}
                actionLabel={actionLabel}
                allowInstrNo={allowInstrNo}
                allowAddRemove={allowAddRemove}
                allowRowGst={allowRowGst}
                ledgerAccounts={ledgerAccounts}
                notifyOnChange={notifyOnChange}
                allowFreeze={allowFreeze}
            />
        </div>
    )

    function ActionRows({
        ad,
        actionType,
        actionLabel,
        allowAddRemove,
        allowInstrNo,
        allowRowGst,
        ledgerAccounts,
        notifyOnChange,
        allowFreeze,
    }: any) {
        const [, setRefresh] = useState({})
        let ind = 0

        useEffect(() => {
            const subs1 = filterOn('ACTION-AMOUNT-CHANGED').subscribe(
                (d: any) => {
                    //d.data is of type {source: 'debits', target: 'credits'} or vice versa
                    const sum: any = ad[d.data.source] //debits or credits
                        .reduce(
                            (prev: any, curr: any) => {
                                prev.amount =
                                    (prev?.amount || 0.0) +
                                    (curr?.amount || 0.0)
                                return prev
                            },
                            { amount: 0.0 }
                        )
                    ad[d.data.target][0].amount = sum.amount
                    setRefresh({})
                }
            )

            return () => {
                subs1.unsubscribe()
            }
        }, [])

        const isGst = !!ad.header.isGst
        const actionRows: any[] = ad[actionType]
        const list: any[] = actionRows.map((item: any) => {
            if (!item.gst) {
                item.gst = {}
            }
            return (
                <div key={incr()} className="action-row">
                    {/* Account */}
                    <div>
                        <Typography variant="caption">
                            {actionLabel} account
                        </Typography>
                        <LedgerSubledger
                            allAccounts={ad.accounts.all}
                            ledgerAccounts={getMappedAccounts(
                                ad.accounts[ledgerAccounts] || []
                            )}
                            onChange={() => emit('CROWN-REFRESH', '')}
                            rowData={item}
                        />
                    </div>

                    {/* Instrument */}
                    {allowInstrNo && (
                        <TextField
                            className="instr-no"
                            label="Instr no"
                            onChange={(e: any) => {
                                item.instrNo = e.target.value
                                emit('CROWN-REFRESH', '')
                                setRefresh({})
                            }}
                            value={item.instrNo || ''}
                        />
                    )}

                    {/* Gst rate */}
                    {allowRowGst && isGst && (
                        <NumberFormat
                            allowNegative={false}
                            {...{ label: 'Gst rate' }}
                            className="right-aligned-numeric gst-rate"
                            customInput={TextField}
                            decimalScale={2}
                            // error={item.amount ? false : true}
                            fixedDecimalScale={true}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onBlur={() => {
                                computeGst(item)
                                setRefresh({})
                            }}
                            error={item.gst.rate > 30 ? true : false}
                            onValueChange={(values: any) => {
                                const { floatValue } = values
                                item.gst.rate = floatValue || 0.0
                                computeGst(item)
                                emit('CROWN-REFRESH', '')
                                setRefresh({})
                            }}
                            thousandSeparator={true}
                            value={item.gst.rate || 0.0}
                        />
                    )}

                    {/* HSN */}
                    {allowRowGst && isGst && (
                        <NumberFormat
                            className="hsn"
                            allowNegative={false}
                            {...{ label: 'Hsn' }}
                            customInput={TextField}
                            onFocus={(e) => {
                                e.target.select()
                            }}
                            onChange={(e: any) => {
                                item.gst.hsn = e.target.value
                                emit('CROWN-REFRESH', '')
                                setRefresh({})
                            }}
                            value={item.gst.hsn || 0.0}
                        />
                    )}

                    {/* Amount */}
                    <NumberFormat
                        disabled={allowFreeze}
                        allowNegative={false}
                        {...{ label: `${actionLabel} amount` }}
                        className="right-aligned-numeric amount"
                        customInput={TextField}
                        decimalScale={2}
                        error={item.amount ? false : true}
                        fixedDecimalScale={true}
                        onFocus={(e) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            const { floatValue } = values
                            item.amount = floatValue || 0.0
                            computeGst(item)

                            emit('CROWN-REFRESH', '')
                            if (notifyOnChange) {
                                emit('ACTION-AMOUNT-CHANGED', {
                                    source: actionType,
                                    target:
                                        actionType === 'debits'
                                            ? 'credits'
                                            : 'debits',
                                })
                            }
                            setRefresh({})
                        }}
                        onBlur={() => {
                            computeGst(item)
                            setRefresh({})
                        }}
                        thousandSeparator={true}
                        value={item.amount || 0.0}
                    />

                    {allowRowGst && isGst && (
                        <div className="gst-block">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(e: any) => {
                                            item.gst.isIgst = e.target.checked
                                            computeGst(item)
                                            setRefresh({})
                                        }}
                                        color="primary"
                                        value={!!item.gst.igst}
                                        checked={!!item.gst.igst}
                                    />
                                }
                                label="Igst"
                                labelPlacement="start"
                            />
                            <Typography className="gst" variant="body2">
                                Cgst: {toDecimalFormat(item.gst.cgst || 0.0)}
                            </Typography>
                            <Typography className="gst" variant="body2">
                                Sgst: {toDecimalFormat(item.gst.sgst || 0.0)}
                            </Typography>
                            <Typography className="gst" variant="body2">
                                Igst: {toDecimalFormat(item.gst.igst || 0.0)}
                            </Typography>
                        </div>
                    )}

                    {/* line ref no  */}
                    <TextField
                        className="line-ref"
                        label="Line ref"
                        onChange={(e: any) => {
                            item.lineRefNo = e.target.value
                            setRefresh({})
                        }}
                        value={item.lineRefNo || ''}
                    />
                    {/* remarks */}
                    <TextField
                        className="line-remarks"
                        label="Remarks"
                        onChange={(e: any) => {
                            item.remarks = e.target.value
                            setRefresh({})
                        }}
                        value={item.remarks || ''}
                    />
                    {/* Add remove */}
                    {allowAddRemove ? (
                        <AddRemoveButtons
                            ad={ad}
                            arr={ad[actionType]}
                            item={item}
                            emitMessage="ACTION-BLOCK-REFRESH"
                        />
                    ) : (
                        <div style={{ width: '5rem' }}></div>
                    )}
                </div>
            )
        })
        return (
            <Paper elevation={1} className="action-block">
                {list}
            </Paper>
        )
        function incr() {
            return ind++
        }
    }

    function AddRemoveButtons({ ad, arr, item, emitMessage }: any) {
        return (
            <div>
                <IconButton
                    color="secondary"
                    size="medium"
                    aria-label="delete"
                    onClick={remove}
                    style={{ margin: 0, padding: 0 }}>
                    <RemoveCircle style={{ fontSize: '2.5rem' }} />
                </IconButton>
                <IconButton
                    color="secondary"
                    aria-label="add"
                    onClick={add}
                    style={{ margin: 0, padding: 0 }}>
                    <AddCircle style={{ fontSize: '2.5rem' }} />
                </IconButton>
            </div>
        )

        function reIndex() {
            let ind = 0
            function incr() {
                return ind++
            }
            for (let it of arr) {
                it.key = incr()
            }
        }

        function add() {
            arr.push({})
            reIndex()
            emit(emitMessage, '')
            emit('CROWN-REFRESH', '')
        }

        function remove() {
            if (arr.length === 1) {
                alert(accountsMessages.cannotDeleteOnlyEntry)
                return
            }
            if (item.id) {
                ad.deletedDetailsIds.push(item.id) // when a row is being deleted
            }
            arr.splice(item.key, 1)
            reIndex()
            emit(emitMessage, '')
            emit('CROWN-REFRESH', '')
        }
    }

    function computeGst(item: any) {
        const gstRate = item.gst.rate || 0
        const gst = ((item.amount || 0) * (gstRate / 100)) / (1 + gstRate / 100)
        if (item.gst.isIgst) {
            item.gst.igst = gst
            item.gst.cgst = 0
            item.gst.sgst = 0
        } else {
            item.gst.igst = 0
            item.gst.cgst = gst / 2
            item.gst.sgst = item.gst.cgst
        }
    }

    function resetGst() {
        reset('debits')
        reset('credits')

        function reset(arrType: string) {
            for (const row of ad[arrType]) {
                if (row.gst) {
                    row.gst.rate = undefined
                    row.gst.hsn = undefined
                }
            }
        }
    }
}

export { ActionBlock }


function getLeftMargin(actionType: string, isGst: boolean, tranTypeId: number=0) {
    const ret: any = {}
    if (actionType === 'credits') {
        ret.amount = 'auto'
        ret.lineRef = 0
        ret.gstBlock = 0
    } else {
        if (isGst) {
            ret.amount = 0
            if(tranTypeId === 3){
                ret.lineRef = 'auto'
            } else {
                ret.lineRef = 0
            }
            
            ret.gstBlock = 'auto'
        } else {
            ret.amount = 0
            ret.lineRef = 'auto'
            ret.gstBlock = 0
        }
    }
    return ret
}

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentAction: {
            '& .action-label': {
                marginTop: theme.spacing(2),
                textTransform: 'capitalize',
            },
            '& .right-aligned-numeric': {
                width: theme.spacing(18),
                '& input': {
                    textAlign: 'end',
                },
            },
            '& .gst-rate': {
                width: theme.spacing(8),
            },
            '& .hsn': {
                width: theme.spacing(10),
            },
            '& .instr-no': {
                width: theme.spacing(12),
                // marginLeft: 0,
            },
            '& .gst-block': {
                display: 'flex',
                flexDirection: 'column',
                width: theme.spacing(15),
                border: '1px solid lightgrey',
                padding: theme.spacing(1),
                '& .gst': {
                    textAlign: 'right',
                    fontSize: '0.8rem',
                },
                marginLeft: ({ actionType, isGst }: any) => {
                    // actionType === 'debits' ? 'auto' : 0,{
                    const { gstBlock }: any = getLeftMargin(actionType, isGst)
                    return gstBlock
                },
            },
            '& .line-ref': {
                marginLeft: ({ actionType, isGst, tranTypeId }: any) => {
                    const { lineRef }: any = getLeftMargin(actionType, isGst, tranTypeId)
                    return lineRef
                },
                // actionType === 'credits' ? 0 : isGst ? 0 : 'auto',
                // getLineRefLeftMargin(isGst, actionType),
            },
            '& .line-remarks': {
                width: ({ isGst }:any) =>
                    isGst ? theme.spacing(20) : theme.spacing(50),
            },
            '& .action-block': {
                backgroundColor: '#F6F6F4',
                padding: theme.spacing(1),
            },
            '& .action-row': {
                display: 'flex',
                marginBottom: theme.spacing(1),
                // justifyContent: 'space-between',
                columnGap: theme.spacing(4),
                flexWrap: 'wrap',
                rowGap: theme.spacing(2),
                alignItems: 'center',
                '& .amount': {
                    marginLeft: ({ actionType, isGst }: any) => {
                        const { amount }: any = getLeftMargin(actionType, isGst)
                        return amount
                    },
                    // actionType === 'credits' ? 'auto' : 0,
                },
            },
        },
    })
)
