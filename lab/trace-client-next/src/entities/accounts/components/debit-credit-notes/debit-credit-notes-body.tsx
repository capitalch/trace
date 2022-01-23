import { NumberFormat, useState } from '../../../../imports/regular-imports'
import {
    Button,
    IconButton,
    TextField,
    Tooltip,
    Typography,
} from '../../../../imports/gui-imports'
import { Check, Error, PrintIcon } from '../../../../imports/icons-import'
import { LedgerSubledger } from '../../../../imports/trace-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import {
    useDebitCreditNoteBody,
    useStyles,
} from './debit-credit-notes-body-hook'

function DebitCreditNotesBody({ arbitraryData, tranType }: any) {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const { getError, handleSubmit, meta } = useDebitCreditNoteBody(
        arbitraryData,
        tranType
    )
    const accounts = arbitraryData.body.accounts
    const { accountsMessages, getMappedAccounts, isInvalidDate } =
        useSharedElements()

    return (
        <div className={classes.content}>
            <div className="header">
                <Typography variant="body1" component="span">
                    Ref no: &nbsp;
                </Typography>
                <span className="no">{arbitraryData.body.autoRefNo}</span>
                <div className="print-submit">
                    <Tooltip title="Print">
                        <IconButton
                            className="print-button"
                            size="small"
                            disabled={false}>
                            <PrintIcon className="print-icon" />
                        </IconButton>
                    </Tooltip>
                    <Button
                        className="submit"
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={handleSubmit}
                        startIcon={
                            getError() ? (
                                <Error color="error" />
                            ) : (
                                <Check style={{ color: 'white' }} />
                            )
                        }
                        disabled={getError()}>
                        Submit
                    </Button>
                </div>
            </div>
            <div className="body">
                <div className="body-line-one">
                    <TextField
                        label="Date"
                        variant="standard"
                        error={isInvalidDate(arbitraryData.body.tranDate)}
                        helperText={
                            isInvalidDate(arbitraryData.body.tranDate)
                                ? accountsMessages.dateRangeAuditLockMessage
                                : undefined
                        }
                        type="date"
                        onChange={(e: any) => {
                            arbitraryData.body.tranDate = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        onFocus={(e: any) => e.target.select()}
                        value={arbitraryData.body.tranDate || ''}
                    />
                    <TextField
                        label="User ref no"
                        variant="standard"
                        onChange={(e: any) => {
                            arbitraryData.body.userRefNo = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={arbitraryData.body.userRefNo || ''}
                    />
                    <NumberFormat
                        label="Amount"
                        variant="standard"
                        allowNegative={false}
                        className="right-aligned-numeric"
                        customInput={TextField}
                        decimalScale={2}
                        error={arbitraryData.body.amount === 0 ? true : false}
                        fixedDecimalScale={true}
                        onValueChange={(values: any) => {
                            //using onChange event stores formatted value which is not desirable
                            const { floatValue } = values
                            arbitraryData.body.amount = floatValue
                            meta.current.isMounted && setRefresh({})
                        }}
                        onFocus={(e: any) => e.target.select()}
                        thousandSeparator={true}
                        value={arbitraryData.body.amount || 0.0}
                    />
                    <TextField
                        className="common-remarks"
                        variant="standard"
                        label="Common remarks"
                        onChange={(e: any) => {
                            arbitraryData.body.commonRemarks = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={arbitraryData.body.commonRemarks || ''}
                    />
                </div>
                <div className="body-line-two-three">
                    <div className="ledger-subledger-box">
                        <Typography variant="caption">
                            {tranType === 'dn'
                                ? 'Debit (Debtor / Creditor)'
                                : 'Debit (Sale)'}
                        </Typography>
                        <LedgerSubledger
                            allAccounts={accounts.allAccounts}
                            className="ledger-subledger"
                            ledgerAccounts={
                                tranType === 'dn'
                                    ? getMappedAccounts(
                                        accounts.debtorCreditorLedgerAccounts
                                    )
                                    : getMappedAccounts(
                                        accounts.saleLedgerAccounts
                                    )
                            }
                            onChange={() => {
                                // for registering error
                                meta.current.isMounted && setRefresh({})
                            }}
                            rowData={arbitraryData.body.ledgerSubledgerDebit}
                        />
                    </div>
                    <TextField
                        className="common-text"
                        variant="standard"
                        label="Line ref no"
                        onChange={(e: any) => {
                            arbitraryData.body.lineRefNoDebit = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={arbitraryData.body.lineRefNoDebit || ''}
                    />
                    <TextField
                        className="common-text remarks"
                        variant="standard"
                        label="Line remarks"
                        onChange={(e: any) => {
                            arbitraryData.body.lineRemarksDebit = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={arbitraryData.body.lineRemarksDebit || ''}
                    />
                </div>
                <div className="body-line-two-three">
                    <div className="ledger-subledger-box">
                        <Typography variant="caption">
                            {tranType === 'dn'
                                ? 'Credit (Purchase)'
                                : 'Credit (Debtor / Creditor)'}
                        </Typography>
                        {/* Purchase */}
                        <LedgerSubledger
                            allAccounts={accounts.allAccounts}
                            className="ledger-subledger"
                            ledgerAccounts={
                                tranType === 'dn'
                                    ? getMappedAccounts(
                                        accounts.purchaseLedgerAccounts
                                    )
                                    : getMappedAccounts(
                                        accounts.debtorCreditorLedgerAccounts
                                    )
                            }
                            onChange={() => {
                                // for registering error
                                meta.current.isMounted && setRefresh({})
                            }}
                            rowData={arbitraryData.body.ledgerSubledgerCredit}
                        />
                    </div>
                    <TextField
                        className="common-text"
                        variant="standard"
                        label="Line ref no"
                        onChange={(e: any) => {
                            arbitraryData.body.lineRefNoCredit = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={arbitraryData.body.lineRefNoCredit || ''}
                    />
                    <TextField
                        className="common-text remarks"
                        variant="standard"
                        label="Line remarks"
                        onChange={(e: any) => {
                            arbitraryData.body.lineRemarksCredit =
                                e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={arbitraryData.body.lineRemarksCredit || ''}
                    />
                    <div className="print-submit">
                        <Tooltip title="Print">
                            <IconButton
                                className="print-button"
                                size="small"
                                disabled={false}>
                                <PrintIcon className="print-icon" />
                            </IconButton>
                        </Tooltip>
                        <Button
                            // className="submit"
                            variant="contained"
                            size="small"
                            color="secondary"
                            disabled={getError()}
                            onClick={handleSubmit}
                            startIcon={
                                getError() ? (
                                    <Error color="error" />
                                ) : (
                                    <Check style={{ color: 'white' }} />
                                )
                            }>
                            Submit
                        </Button>
                    </div>
                </div>
                <div className="gutter"></div>
            </div>
        </div>
    )
}

export { DebitCreditNotesBody }
