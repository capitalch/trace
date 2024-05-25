import { Big, InputSwitch, PrimeColumn, TreeTable, useState, useEffect, useRef } from '../../../../imports/regular-imports'
import {
    IconButton,
    Typography,
    Box,
    Theme,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'
import { Search, SyncSharp } from '../../../../imports/icons-import'
import { graphqlService, manageEntitiesState, queries, useIbuki, useTraceGlobal, useTraceMaterialComponents } from '../../../../imports/trace-imports'
import styled from 'styled-components'
import { utilMethods } from '../../../../global-utils/misc-utils'
import messages from '../../../../messages.json'

function TrialBalance() {
    const { emit, filterOn } = useIbuki()
    const [, setRefresh] = useState({})
    const { toDecimalFormat } = utilMethods()
    const { getFromBag, setInBag } = manageEntitiesState()

    const meta: any = useRef({
        data: [],
        isMounted: false,
        windowWidth: '',
        allKeys: [],
        globalFilter: '',
        footer: {
            opening: Big(0.0),
            debit: Big(0.0),
            credit: Big(0.0),
            closing: Big(0.0),
        },
        headerConfig: {
            textVariant: 'subtitle1',
            title: 'Trial balance',
        },
        dialogConfig: {
            dialogWidth: '',
        },
        tableConfig: {
            expanderColumn: '',
        },
    })
    const headerConfig = meta.current.headerConfig
    const dialogConfig = meta.current.dialogConfig
    const tableConfig = meta.current.tableConfig
    const { queryGraphql } = graphqlService()
    const classes = useStyles({ meta: meta })
    const { traceGlobalSearch } = useTraceMaterialComponents()
    const { getCurrentMediaSize, isMediumSizeUp } =
        useTraceGlobal()

    const currentMediaSize: string = getCurrentMediaSize()

    // The library Big.js is used to escape the javascript Floating Poing precision errors
    function getFooter(data: any[]) {
        function getSigned(val: any, dc: string) {
            return dc === 'C' ? -val : val
        }
        const footer = data.reduce(
            (prev: any, x: any) => {
                const a: any = {
                    opening: Big(prev.opening).add(
                        getSigned(Big(x.data.opening), x.data.opening_dc)
                    ),
                    debit: Big(prev.debit).add(Big(x.data.debit)),
                    credit: Big(prev.credit).add(Big(x.data.credit)),
                    closing: Big(prev.closing).add(
                        getSigned(Big(x.data.closing), x.data.closing_dc)
                    ),
                }
                return a
            },
            {
                opening: Big(0),
                debit: Big(0),
                credit: Big(0),
                closing: Big(0),
            }
        )
        return footer
    }

    async function getData(isBusyIndicator = true) {
        try {
            isBusyIndicator && emit('SHOW-LOADING-INDICATOR', true)
            const q = queries['genericQueryBuilder']({
                queryName: 'trialBalance',
            })
            const ret = await queryGraphql(q)
            const pre = ret?.data?.accounts?.trialBalance
            meta.current.data = pre?.trialBal
            meta.current.footer = getFooter(meta.current.data)
            meta.current.allKeys = pre?.allKeys

            meta.current.isMounted && setRefresh({})
        } catch (error) {
            emit('SHOW-MESSAGE', {
                message: messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        } finally {
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }
    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs1 = filterOn('TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE').subscribe(
            () => {
                getData(false)
            }
        )
        getData()
        return () => {
            curr.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    if (isMediumSizeUp) {
        dialogConfig.dialogWidth = '360px'
    } else {
        dialogConfig.dialogWidth = '290px'
    }

    const mediaLogic: any = {
        xs: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '15rem'
        },
        sm: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '22rem'
        },
        md: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '25rem'
        },
        lg: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '35rem'
        },
        xl: () => mediaLogic['lg'](),
    }

    currentMediaSize && mediaLogic[currentMediaSize]()

    function actionTemplate(node: any) {
        let ret = <></>
        if (node.children === null) {
            ret = (
                <IconButton
                    size="small"
                    color="secondary"
                    onClick={(e: any) => emit('SHOW-LEDGER', node.data.id)}>
                    <Search></Search>
                </IconButton>
            )
        }
        return ret
    }

    interface amountTemplateOptions {
        amt: any
        dc?: string
        isOpeningClosing?: boolean
        accLeaf?: string
    }
    function amountTemplate(options: amountTemplateOptions) {
        let ret,
            dcFormat,
            dcColor = 'black'
        if (options.amt === 0 && options.isOpeningClosing) {
            options.dc = 'D'
        }
        let amount = toDecimalFormat(options.amt)
        if (options.dc === 'D') {
            dcFormat = ' Dr'
        } else if (options.dc === 'C') {
            dcFormat = ' Cr'
            dcColor = 'red'
        }
        const fontColor: string =
            options.accLeaf === 'Y' || options.accLeaf === 'S'
                ? 'black'
                : 'darkGrey'
        ret = (
            <div
                style={{
                    textAlign: 'right',
                    color: `${fontColor}`,
                }}>
                {amount}
                <span style={{ color: `${dcColor}` }}>{dcFormat}</span>
            </div>
        )
        return ret
    }

    return (
        <div className={classes.content}>
            <Box className={classes.header}>
                <Typography
                    color="primary"
                    variant={meta.current.headerConfig.textVariant || 'h6'}
                    component="span">
                    {headerConfig.title}
                </Typography>
                <Box component="span" className={classes.expandRefresh}>
                    <Span style={{ marginTop: '-1px' }}>Expand</Span>
                    <InputSwitch
                        checked={getFromBag('trialBalExpandAll') || false}
                        style={{ float: 'right', marginRight: '0.5rem' }}
                        onChange={(e: any) => {
                            const val = e.target.value
                            setInBag('trialBalExpandAll', val)
                            if (val) {
                                const expObject = meta.current.allKeys.reduce(
                                    (prev: any, x: any) => {
                                        prev[x] = true
                                        return prev
                                    },
                                    {}
                                )
                                setInBag('trialBalExpandedKeys', expObject)
                            } else {
                                setInBag('trialBalExpandedKeys', {})
                            }
                            meta.current.isMounted && setRefresh({})
                        }}></InputSwitch>
                    <IconButton
                        size="medium"
                        color="secondary"
                        onClick={(e: any) => getData()}>
                        <SyncSharp></SyncSharp>
                    </IconButton>
                </Box>
                {/* </Box> */}
                {traceGlobalSearch({
                    meta: meta,
                    isMediumSizeUp: isMediumSizeUp,
                })}
            </Box>
            <TreeTable
                scrollable={true}
                scrollHeight="calc(100vh - 22rem)"
                value={meta.current.data}
                expandedKeys={getFromBag('trialBalExpandedKeys') || {}}
                globalFilter={meta.current.globalFilter}
                onToggle={(e: any) => {
                    setInBag('trialBalExpandedKeys', e.value)
                    meta.current.isMounted && setRefresh({})
                }}>
                {getColumns()}
            </TreeTable>
        </div>
    )

    function getColumns() {
        let numb = 0
        function incr() {
            return String(numb++)
        }
        const columns = [
            <PrimeColumn
                key={incr()}
                columnKey={incr()}
                selectionMode="multiple"
                style={{ width: '3rem', textAlign: 'center' }}
            />,
            <PrimeColumn
                key={incr()}
                columnKey={incr()}
                field="accName"
                expander
                style={{ width: tableConfig.expanderColumn }}
                header={<TDiv align="left">Account names</TDiv>}
                footer={<TDiv align="left">Total</TDiv>}
                body={(node: any) => {
                    return <span>{node.data.accName}</span>
                }}></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                columnKey={incr()}
                style={{ width: '10rem' }}
                field="opening"
                header={<TDiv align="right">Opening</TDiv>}
                footer={
                    <TDiv align="right">
                        {meta.current.footer.opening >= 0
                            ? amountTemplate({
                                amt: meta.current.footer.opening,
                                dc: 'D',
                                isOpeningClosing: true,
                                accLeaf: 'Y',
                            })
                            : amountTemplate({
                                amt: meta.current.footer.opening,
                                dc: 'C',
                                isOpeningClosing: true,
                                accLeaf: 'Y',
                            })}
                    </TDiv>
                }
                body={(node: any) =>
                    amountTemplate({
                        amt: node.data.opening,
                        isOpeningClosing: true,
                        dc: node.data.opening_dc,
                        accLeaf: node.data.accLeaf,
                    })
                }></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                columnKey={incr()}
                style={{ width: '10rem' }}
                field="debit"
                header={<TDiv align="right">Debits</TDiv>}
                footer={
                    <TDiv align="right">
                        {amountTemplate({
                            amt: meta.current.footer.debit,
                            accLeaf: 'Y',
                        })}
                    </TDiv>
                }
                body={(node: any) =>
                    amountTemplate({
                        amt: node.data.debit,
                        accLeaf: node.data.accLeaf,
                    })
                }></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                columnKey={incr()}
                style={{ width: '10rem' }}
                field="credit"
                header={<TDiv align="right">Credits</TDiv>}
                footer={
                    <TDiv align="right">
                        {amountTemplate({
                            amt: meta.current.footer.credit,
                            accLeaf: 'Y',
                        })}
                    </TDiv>
                }
                body={(node: any) =>
                    amountTemplate({
                        amt: node.data.credit,
                        accLeaf: node.data.accLeaf,
                    })
                }></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                columnKey={incr()}
                style={{ width: '10rem' }}
                field="closing"
                header={<TDiv align="right">Closing</TDiv>}
                footer={
                    <TDiv align="right">
                        {meta.current.footer.closing >= 0
                            ? amountTemplate({
                                amt: meta.current.footer.closing,
                                dc: 'D',
                                isOpeningClosing: true,
                                accLeaf: 'Y',
                            })
                            : amountTemplate({
                                amt: meta.current.footer.closing,
                                dc: 'C',
                                isOpeningClosing: true,
                                accLeaf: 'Y',
                            })}
                    </TDiv>
                }
                body={(node: any) =>
                    amountTemplate({
                        amt: node.data.closing,
                        dc: node.data.closing_dc,
                        isOpeningClosing: true,
                        accLeaf: node.data.accLeaf,
                    })
                }></PrimeColumn>,
            <PrimeColumn
                key={incr()}
                columnKey={incr()}
                style={{ width: '5rem' }}
                field="accType"
                header={<TDiv align="left">Type</TDiv>}
                body={(node: any) => {
                    const logic: any = {
                        A: 'Asset',
                        L: 'Liability',
                        I: 'Income',
                        E: 'Expence',
                    }
                    return (
                        <TDiv align="left">{logic[node.data.accType]}</TDiv>
                    )
                }}></PrimeColumn>,
            <PrimeColumn key={incr()} columnKey={incr()} body={actionTemplate} style={{ width: '4rem' }} />
        ]
        return (columns)
    }
}

export { TrialBalance }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginBottom: theme.spacing(1),
            overflowX: 'auto',
        },

        header: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(1),
        },

        expandRefresh: {
            display: 'flex',
            alignItems: 'center',
            float: 'right',
        },
    })
)

const TDiv: any = styled.div`
    text-align: ${(props: any) => props.align};
    margin: 0px;
    padding: 0px;
`
const Span = styled.span`
    float: right;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight: normal;
`
