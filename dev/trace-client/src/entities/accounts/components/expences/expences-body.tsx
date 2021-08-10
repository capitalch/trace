import { useEffect, useRef, useState } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'
import { useExpencesBody, useStyles } from "./expences-body-hook"

function ExpencesBody({ arbitraryData }: any) {
    const { Button, CheckIcon, emit, ErrorIcon, filterOn, LedgerSubledger, TextField, Typography } = useSharedElements()
    const { getError, handleSubmit, meta, setRefresh } = useExpencesBody()
    const styles = useStyles()
    return (<div className={styles.content}>
        <TextField
            className="auto-ref-no"
            disabled={true}
            label="Ref no"
            value={arbitraryData.autoRefNo || ''}
        />
        {/* date */}
        <div className="date-block">
            <label className='date-label'>Date</label>
            <TextField
            // error={getDateError()}
            // helperText={
            //     getDateError()
            //         ? 'Date range / Audit lock error'
            //         : undefined
            // }
            type="date"
            onChange={(e: any) => {
                arbitraryData.tranDate = e.target.value
                setRefresh({})
            }}
            onFocus={(e) => e.target.select()}
            value={arbitraryData.tranDate || ''}
        />
        </div>
        
        {/* invoice no  */}
        <TextField
            label="Invoice no"
            className="invoice-no"
            // error={getInvoiceError()}
            onChange={(e: any) => {
                arbitraryData.userRefNo = e.target.value
                setRefresh({})
            }}
            value={arbitraryData.userRefNo || ''}
        />
        {/* remarks */}
        <TextField
            label="Common remarks"
            className="common-remarks"
            onChange={(e: any) => {
                arbitraryData.commonRemarks = e.target.value
                setRefresh({})
            }}
            value={arbitraryData.commonRemarks || ''}
        />
        <div>
            <Typography variant="caption">Credit a/c</Typography>
            {/* credit account */}
            <LedgerSubledger
                allAccounts={meta.current.allAccounts}
                className="ledger-subledger"
                ledgerAccounts={meta.current.ledgerAccounts}
                onChange={async () => {
                    // getOtherAccountError()
                    // const gstin: string = await queryGstin(
                    //     arbitraryData.ledgerSubledgerOther?.accId
                    // )
                    // arbitraryData.gstin = gstin
                    setRefresh({})
                    // emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
                }}
                rowData={arbitraryData.ledgerSubledgerOther}
            />
        </div>
        {/* gstin */}
        <TextField
            className="gstin"
            label="Gstin no"
            // error={getGstinError()}
            onChange={(e: any) => {
                arbitraryData.gstin = e.target.value
                setRefresh({})
                emit('PURCHASE-BODY-SUBMIT-REFRESH', null)
            }}
            value={arbitraryData.gstin || ''}
        />
        <SubmitComponent />
    </div>)

    function SubmitComponent() {
        const [, setRefresh] = useState({})
        useEffect(() => {
            const subs1 = filterOn('PURCHASE-BODY-SUBMIT-REFRESH').subscribe(
                () => {
                    setRefresh({})
                }
            )

            return () => {
                subs1.unsubscribe()
            }
        }, [])

        return (
            <Button
                className="submit"
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleSubmit}
                startIcon={
                    getError() ? (
                        <ErrorIcon color="error" />
                    ) : (
                        <CheckIcon style={{ color: 'white' }} />
                    )
                }
                disabled={getError()}>
                Submit
            </Button>
        )
    }
}

export { ExpencesBody }

