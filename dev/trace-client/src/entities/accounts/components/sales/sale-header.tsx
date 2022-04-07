import { useState, useContext } from '../../../../imports/regular-imports'
import {
    FormControlLabel,
    Paper,
    Radio,
    Typography,
    TextField,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleHeader, useStyles } from './sale-header-hook'
import { BillTo } from './bill-to'
import { ShipTo } from './ship-to'
import { SaleBillNoSelect } from './sale-bill-no-select'
import { MultiDataContext } from '../common/multi-data-bridge'

function SaleHeader() {
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.sales
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
                        error={isInvalidDate(arbitraryData.tranDate) || (!arbitraryData.tranDate)}
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
                            arbitraryData.salesCrownRefresh()
                        }}
                        onFocus={(e: any) => e.target.select()}
                        value={arbitraryData.tranDate || ''}
                    />

                    {(arbitraryData.saleType === 'ret') && <SaleBillNoSelect />}
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
                    {(arbitraryData.saleType === 'sal') && SaleVariety()}

                    {/* Sale account */}
                    <div>
                        <Typography>Sale account</Typography>
                        <LedgerSubledger
                            controlId='sales'
                            ledgerFilterMethodName='saleAccounts'
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
                            disabled={arbitraryData.id} // in edit mode changeover is not allowed
                            onClick={(e: any) => {
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
                            disabled={arbitraryData.id} // in edit mode changeover is not allowed
                            onClick={(e: any) => {
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
                            disabled={arbitraryData.id} // in edit mode changeover is not allowed
                            onClick={(e: any) => {
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
