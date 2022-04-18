import {
    useEffect,
    useState,
    NumberFormat,
    PrimeColumn,
    DataTable, useContext
} from '../../../../imports/regular-imports'
import { useIbuki } from '../../../../imports/trace-imports'
import { IconButton, TextField, Paper } from '../../../../imports/gui-imports'
import { AddCircle, CloseSharp } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleFooter, useStyles } from './sale-footer-hook'
import { MultiDataContext } from '../common/multi-data-bridge'

function SaleFooter() {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const { emit } = useIbuki()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.sales
    const {
        computeSummary,
        handleAddItem,
        handleDeleteItem,
        meta,
        onChangeLedgerSubledger,
    } = useSaleFooter(arbitraryData)

    emit('LEDGER-SUBLEDGER-DISABLE-AUTO-SUBLEDGER', true)
    const { LedgerSubledger, toDecimalFormat } = useSharedElements()

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
                            <CloseSharp className="delete-icon" />
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
                        // allAccounts={arbitraryData.allAccounts}
                        // ledgerAccounts={rowData.ledgerAccounts}
                        // controlId={''.concat('footer')}
                        ledgerFilterMethodName={rowData.ledgerFilterMethodName}
                        onChange={() => onChangeLedgerSubledger(rowData)}
                        rowData={rowData}
                        showAutoSubledgerValues={false}
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
                        variant='standard'
                        customInput={TextField}
                        decimalScale={2}
                        error={rowData.amount === 0 ? true : false}
                        fixedDecimalScale={true}
                        onFocus={(e: any) => {
                            e.target.select()
                        }}
                        onValueChange={(values: any) => {
                            const { floatValue } = values
                            rowData.amount = floatValue || 0.0
                            computeSummary()
                            arbitraryData.salesCrownRefresh()
                            meta.current.isMounted && setRefresh({})
                        }}
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
                        variant="standard"
                        onChange={(e: any) => {
                            rowData.instrNo = e.target.value
                            arbitraryData.salesCrownRefresh()
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
                        variant="standard"
                        fullWidth={true}
                        onChange={(e: any) => {
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
