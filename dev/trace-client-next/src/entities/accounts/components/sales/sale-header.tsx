import { useState } from '../../../../imports/regular-imports'
import {
    FormControlLabel,
    Paper,
    Radio,
    Typography,
    TextField,
} from '../../../../imports/gui-imports'
import {} from '../../../../imports/icons-import'
import { useSharedElements } from '../shared/shared-elements-hook'
import { useSaleHeader, useStyles } from './sale-header-hook'
import { BillTo } from './bill-to'
import { ShipTo } from './ship-to'
import { SaleBillNoSelect } from './sale-bill-no-select'

function SaleHeader({ arbitraryData }: any) {
    const classes = useStyles()
    const {
        handleAutoSubledgerSales,
        handleInstitutionSales,
        handleRetailCashBankSales,
        handleSaleVariety,
        meta,
        onChangeLedgerSubledger,
        resetAddresses,
    } = useSaleHeader(arbitraryData)

    const {
        accountsMessages,
        emit,

        getMappedAccounts,
        isInvalidDate,
        LedgerSubledger,

        TraceDialog,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <General />
            <BillTo arbitraryData={arbitraryData} />
            <ShipTo arbitraryData={arbitraryData} />
            <TraceDialog meta={meta} />
        </div>
    )

    function General() {
        const [, setRefresh] = useState({})
        return (
            <Paper elevation={2} className="sale-head">
                <Typography
                    variant="subtitle1"
                    className="general"
                    component="div"
                    color="primary">
                    General
                </Typography>

                <div className="head-controls">
                    {/* auto ref no */}
                    <TextField
                        className="auto-ref-no"
                        variant="standard"
                        disabled={true}
                        label="Ref no"
                        value={arbitraryData.autoRefNo || ''}
                    />

                    {/* date */}
                    <TextField
                        label="Date"
                        variant="standard"
                        error={isInvalidDate(arbitraryData.tranDate)}
                        helperText={
                            isInvalidDate(arbitraryData.tranDate)
                                ? accountsMessages.dateRangeAuditLockMessage
                                : ''
                        }
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e: any) => {
                            arbitraryData.tranDate = e.target.value
                            setRefresh({})
                            emit('SALES-CROWN-REFRESH', null)
                        }}
                        onFocus={(e) => e.target.select()}
                        value={arbitraryData.tranDate || ''}
                    />

                    {arbitraryData.isAssignmentReturn && SaleBillNoSelect('')}

                    {/* remarks */}
                    <TextField
                        label="Common remarks"
                        variant="standard"
                        className="common-remarks"
                        onChange={(e: any) => {
                            arbitraryData.commonRemarks = e.target.value
                            setRefresh({})
                        }}
                        value={arbitraryData.commonRemarks || ''}
                    />
                    {/* <SaleVariety /> */}
                    {arbitraryData.isSales && SaleVariety()}

                    {/* Sale account */}
                    <div>
                        <Typography>Sale account</Typography>
                        <LedgerSubledger
                            allAccounts={arbitraryData.allAccounts}
                            // emitMessageOnChange="SALES-CROWN-REFRESH"
                            ledgerAccounts={getMappedAccounts(
                                arbitraryData.ledgerAccounts
                            )}
                            onChange={onChangeLedgerSubledger}
                            rowData={arbitraryData.rowData}
                        />
                    </div>
                </div>
            </Paper>
        )
    }

    function SaleVariety() {
        return (
            <div className="sale-variety">
                <Typography className="selected-account">
                    {arbitraryData.saleVarietyAccName}
                </Typography>
                <FormControlLabel
                    control={
                        <Radio
                            onClick={(e) => {
                                handleSaleVariety('r')
                                resetAddresses()
                                handleRetailCashBankSales()
                            }}
                            size="small"
                            color="secondary"
                            checked={arbitraryData.saleVariety === 'r'}
                        />
                    }
                    label="Retail sales"
                />

                <FormControlLabel
                    control={
                        <Radio
                            onClick={(e) => {
                                handleSaleVariety('a')
                                resetAddresses()
                                handleAutoSubledgerSales()
                            }}
                            size="small"
                            color="secondary"
                            checked={arbitraryData.saleVariety === 'a'}
                        />
                    }
                    label="Auto subledger sales"
                />

                <FormControlLabel
                    control={
                        <Radio
                            onClick={(e) => {
                                handleSaleVariety('i')
                                resetAddresses()
                                handleInstitutionSales()
                            }}
                            size="small"
                            color="secondary"
                            checked={arbitraryData.saleVariety === 'i'}
                        />
                    }
                    label="Institution sales"
                />
            </div>
        )
    }
}

export { SaleHeader }
