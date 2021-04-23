import { useState } from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleFooter, useStyles } from './sale-footer-hook'

function SaleFooter({ arbitraryData }: any) {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const {
        computeSummary,
        handleAddItem,
        handleDeleteItem,
        meta,
        onChangeLedgerSubledger,
    } = useSaleFooter(arbitraryData)

    const {
        AddCircle,
        CloseIcon,
        DataTable,
        IconButton,
        LedgerSubledger,
        NumberFormat,
        Paper,
        PrimeColumn,
        TextField,
        toDecimalFormat,
    } = useSharedElements()

    return (
        <Paper elevation={2} className={classes.content}>
            <DataTable
                className="sale-footer"
                value={arbitraryData.footer.items}>
                {getColumns()}
            </DataTable>
        </Paper>
    )

    function getColumns() {
        return [
            // index
            <PrimeColumn
                key={1}
                style={{ width: '6rem', textAlign: 'right' }}
                header={
                    <div className="index-header">
                        <IconButton
                            className="add-box"
                            aria-label="add"
                            size="small"
                            onClick={handleAddItem}>
                            <AddCircle className="add-icon" />
                            <span className="index">Index</span>
                        </IconButton>
                    </div>
                }
                body={(rowData: any) => (
                    <span className="index-body">
                        {rowData.index}
                        <IconButton
                            size="small"
                            disabled={arbitraryData.footer.items.length === 1}
                            onClick={(e: any) => handleDeleteItem(e, rowData)}>
                            <CloseIcon className="delete-icon" />
                        </IconButton>
                    </span>
                )}
                footer="Rows:"
            />,
            // debit account name
            <PrimeColumn
                key={2}
                style={{ minWidth: '25rem' }}
                body={(rowData: any) => (
                    <LedgerSubledger
                        allAccounts={arbitraryData.allAccounts}
                        ledgerAccounts={rowData.ledgerAccounts}
                        onChange={() => onChangeLedgerSubledger(rowData)}
                        rowData={rowData}
                    />
                )}
                header="Debit account"
                footer={arbitraryData.footer.items.length}
            />,
            // amount
            <PrimeColumn
                key={3}
                body={(rowData: any) => (
                    <NumberFormat
                        allowNegative={false}
                        className="right-aligned-numeric"
                        customInput={TextField}
                        decimalScale={2}
                        error={rowData.amount === 0 ? true : false}
                        fixedDecimalScale={true}
                        onFocus={(e) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            const { floatValue } = values
                            rowData.amount = floatValue || 0.0
                            computeSummary()
                            meta.current.isMounted && setRefresh({})
                        }}
                        // onBlur={() => {
                        //     if (meta.current.isDataChanged) {
                        //     }
                        // }}
                        // onKeyDown={(e: any) => {
                        //     if ([9, 13].includes(e.keyCode)) {
                        //     }
                        // }}
                        thousandSeparator={true}
                        value={rowData.amount || 0.0}
                    />
                )}
                header="Amount"
                footer={toDecimalFormat(arbitraryData.footer.amount || 0.0)}
                style={{ width: '10rem', textAlign: 'end' }}
            />,
            // instrNo
            <PrimeColumn
                key={4}
                body={(rowData: any) => (
                    <TextField
                        onChange={(e) => {
                            rowData.instrNo = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={rowData.instrNo || ''}
                    />
                )}
                header="Instr no"
                style={{ width: '10rem' }}
            />,
            // remarks
            <PrimeColumn
                key={5}
                body={(rowData: any) => (
                    <TextField
                        fullWidth={true}
                        onChange={(e) => {
                            rowData.remarks = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={rowData.remarks || ''}
                    />
                )}
                header="Remarks"
            />,
        ]
    }
}

export { SaleFooter }
