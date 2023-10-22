import { Box, Button, IconButton, } from "@mui/material"
import { SearchBox } from "../../common/search-box"
import { DataGridPro, 
    // GridSearchIcon, 
    useGridApiRef } from "@mui/x-data-grid-pro"
import { FC, useEffect, useRef, useState } from "react"
import { Aggregate, AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, AggregatesDirective, ColumnDirective, ColumnsDirective, GridComponent, Inject, Resize, RowSelectEventArgs, Search, Selection } from "@syncfusion/ej2-react-grids"
import { _, execGenericView, useIbuki, useTheme } from "../../inventory/redirect"
import { AppStore } from "../../../stores/app-store"
import { Close } from "@mui/icons-material"
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs"
import { PurchaseStore } from "../../../stores/purchase-store"

function PurchaseMainInvoices() {
    
    const { debounceFilterOn, emit } = useIbuki()
    const [, setRefresh] = useState({})
    const gridRef: any = useRef({})
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
    })
    const pre = meta.current

    useEffect(() => {
        fetchAllInvoices()
        const subs1 = debounceFilterOn('GENERIC-SYNCFUSION-GRID-SEARCH-SELECT-INVOICE', 1200).subscribe((d: any) => {
            doGridSearch(d.data)
        })
        doGridSearch(AppStore.syncFusionGrid['ret'].searchText.value)
        return (() => { subs1.unsubscribe() })
    }, [])

    gridRef.current.rowSelected = (e: any) => {
        AppStore.modalDialogA.isOpen.value = false
        const id: number = e.data?.id
        fetchInvoiceOnId(id)
    }

    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', columnGap: 2, mb: 1 }}>
            {/* <SearchBox
                parentMeta={meta} 
                sx={{ maxWidth: theme.spacing(120), width: theme.spacing(50) }} /> */}
            <Button variant='contained' color='secondary'
                onClick={fetchAllInvoices}>Refresh</Button>
            <SyncSearchBox />
        </Box>

        <GridComponent
            allowSelection={true}
            allowResizing={true}
            allowTextWrap={true}
            gridLines="Both"
            ref={gridRef}
            selectionSettings={{ enableToggle: true }}
            height={200}>
            <ColumnsDirective>
                {getColumnsDirective()}
            </ColumnsDirective>
            <AggregatesDirective>
                {getAggrDirectives()}
            </AggregatesDirective>
            <Inject services={[Aggregate, Resize, Search, Selection]} />
        </GridComponent>
    </Box>)

    function doGridSearch(searchText: string) {
        if (gridRef.current) {
            gridRef.current.search(searchText)
        }
    }

    function getAggrDirectives() {
        const aggrs: AggrType[] = [{ field: 'index', type: 'Count', format: 'N0', footerTemplate: (props: any) => <span><b>{props.Count}</b></span> }
            , { field: 'amount', type: 'Sum', }]
        const aggrDirectives =
            <AggregateDirective>
                <AggregateColumnsDirective>
                    {getAggrColDirectives()}
                </AggregateColumnsDirective>
            </AggregateDirective>

        return (aggrDirectives)

        function getAggrColDirectives() {
            const defaultFooterTemplate: FC = (props: any) => <span><b>{props.Sum}</b></span>
            const ds: any[] = aggrs.map((aggr: AggrType, index: number) => {
                return (<AggregateColumnDirective
                    key={index}
                    field={aggr.field}
                    type={aggr.type}
                    footerTemplate={aggr.footerTemplate || defaultFooterTemplate}
                    format={aggr.format || 'N2'}
                />)
            })
            return (ds)
        }
    }

    function getColumnsDirective() {
        const columns: ColumnType[] = [
            { field: 'index', headerText: '#', width: 50 }
            , { field: 'tranDate', headerText: 'Date', width: 70 }
            , { field: 'autoRefNo', headerText: 'Ref no', width: 100 }
            , { field: 'userRefNo', headerText: 'Invoice no', width: 100 }
            , { field: 'productDetails', headerText: 'Product details', width: 220 }
            , { field: 'accounts', headerText: 'Account', width: 150 }
            , { field: 'amount', headerText: 'Amount', textAlign: 'Right', type: 'number', width: 100, format: 'N2' }
            , { field: 'serialNumbers', headerText: 'Serial No', width: 100 }
        ]

        const columnDirectives = columns.map((column: ColumnType, index: number) => (
            <ColumnDirective key={index}
                field={column.field}
                headerText={column.headerText}
                textAlign={column.textAlign}
                type={column.type}
                width={column.width}
                format={column.format} />
        ))
        return (columnDirectives)
    }

    async function fetchAllInvoices() {
        emit('SHOW-LOADING-INDICATOR', true)
        pre.allRows = await execGenericView({
            isMultipleRows: true,
            args: { tranTypeId: 5, no: null },
            sqlKey: 'get_purchase_headers'
        })
        emit('SHOW-LOADING-INDICATOR', false)

        pre.filteredRows = pre.allRows.map((x: any, index: number) => ({ ...x, index: index + 1 }))
        if (gridRef.current) {
            gridRef.current.dataSource = pre.filteredRows
            setRefresh({})
        }
    }

    async function fetchInvoiceOnId(id: number) {
        if (!id) { return }
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_sale_purchase_on_id',
            args: { id: id }
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (!_.isEmpty(ret)) {
            // This change is necessary because it is purchase return. Data is originally taken as purchase
            const tranD:any[] = ret?.jsonResult?.tranD
            if(!_.isEmpty(tranD)){
                tranD.forEach((row:any) => {
                    if(row.dc === 'D'){
                        row.dc = 'C'
                    } else {
                        row.dc = 'D'
                    }
                })
            }
            // PurchaseStore.tabValue.value = 0
            // PurchaseStore.goToView = true // After submit operation, the view is loaded
            // preparePurchaseStore(ret)
            // Here set all id's to be undefined. Becausethe id's are for purchase invoice; data from these invoices are required nad not the id's. If id's are used then original purchase invoice will be converted to purchase return            
            PurchaseStore.main.functions.preparePurchaseStore(ret, false); // false means it is isEdit = false; so all id's are undefined
        }
    }
}
export { PurchaseMainInvoices }

type ColumnType = {
    field: string
    format?: any
    headerText: string
    textAlign?: ColumnTextAlign
    type?: ColumnOption
    width?: number
}

export type ColumnTextAlign = 'Center' | 'Justify' | 'Left' | 'Right'
export type ColumnOption = 'string' | 'number' | 'boolean' | 'date' | 'datetime'

type AggrType = {
    field: string
    type: 'Average' | 'Count' | 'Sum' | 'Min' | 'Max'
    footerTemplate?: FC
    format?: 'N2' | 'N0'
}

function SyncSearchBox() {
    const textBoxRef: any = useRef({})
    const { debounceEmit } = useIbuki()
    return (
        <Box display='flex' alignItems='center' >
            {/* <GridSearchIcon fontSize="small" sx={{ mr: .5 }} /> */}
            <TextBoxComponent value={AppStore.syncFusionGrid['ret'].searchText.value} type='text' style={{ height: '30px', width: '100%' }} ref={textBoxRef} showClearButton={true} placeholder="Search"
                input={handleToolbarTextChanged}
            />
            <IconButton disabled={AppStore.syncFusionGrid['ret'].searchText.value ? false : true} size="small" onClick={handleClear}>
                <Close sx={{ fontSize: '18px' }} />
            </IconButton>
        </Box>)

    function handleClear() {
        AppStore.syncFusionGrid['ret'].searchText.value = ''
        debounceEmit('GENERIC-SYNCFUSION-GRID-SEARCH-SELECT-INVOICE', '')
    }

    function handleToolbarTextChanged(e: any) {
        AppStore.syncFusionGrid['ret'].searchText.value = e.value
        debounceEmit('GENERIC-SYNCFUSION-GRID-SEARCH-SELECT-INVOICE', e.value)
    }
}
export { SyncSearchBox }