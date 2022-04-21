import { Input, NumberFormat, useInventoryUtils, useEffect, useRef, useState, useSharedElements, utilMethods, } from './redirect'
import {
    makeStyles,
    TextField,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'

import { useCrudUtils } from '../common/crud-utils-hook'

function useProducts() {
    const [, setRefresh] = useState({})
    const FETCH_DATA_MESSAGE = 'PRODUCTS-HOOK-FETCH-DATA'
    const meta: any = useRef({
        dialogConfig: {
            tableName: 'ProductM',
            ibukiFetchDataMessage: getXXGridParams().gridActionMessages.fetchIbukiMessage,
        },
        isDataChanged: false,
        showDialog: false,
        product: {},
        title: '',
        sharedData: {},
    })
    const pre = meta.current
    const { genericUpdateMasterNoForm } = utilMethods()
    const { handleDelete, } = useCrudUtils(meta)
    const { fetchBrandsCategoriesUnits } = useInventoryUtils()
    const {
        emit,
        filterOn,
        setInBag,
        toDecimalFormat,
    } = useSharedElements()

    useEffect(() => {
        const subs1 = filterOn(FETCH_DATA_MESSAGE).subscribe(() => {
            emit(getXXGridParams().gridActionMessages.fetchIbukiMessage, null)
        })

        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe(handleEdit)

        const subs3 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            //delete
            const { id1 } = d.data?.row
            handleDelete(id1)
        })

        const subs4 = filterOn(
            getXXGridParams().gridActionMessages.addIbukiMessage
        ).subscribe((d: any) => {
            //Add
            handleAdd()
        })

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [])

    useEffect(() => {
        const products: any[] = pre.sharedData?.allRows || []
        if (products.length > 0) {
            setInBag('products', products)
        }
    })

    function getXXGridParams() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 60,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                width: 60,
            },
            {
                headerName: 'Code',
                field: 'productCode',
                width: '100'
            },
            {
                headerName: 'Category',
                field: 'catName',
                width: '120'
            },
            {
                headerName: 'Brand',
                field: 'brandName',
                width: '120'
            },
            {
                headerName: 'Label',
                field: 'label',
                width: '160',
            },
            {
                headerName: 'HSN',
                field: 'hsn',
                editable: true,
                width: '80',
                cellClassName: (params: any) =>
                    params.row.isDataChanged
                        ? 'data-changed'
                        : 'editable-column',
                renderEditCell: (params: any) => {
                    return (
                        <NumberFormat
                            allowNegative={false}
                            customInput={TextField}
                            onChange={setHsn}
                            onFocus={(e: any) => e.target.select()}
                            value={params.row.hsn || null}
                        />                        
                    )
                    function setHsn(e: any) {
                        const value = e.target.value
                        pre.isDataChanged = true
                        const id = params.row.id
                        const changedRow = pre.sharedData.filteredRows.find((x:any)=>(x.id === id))
                        changedRow.hsn = value
                        changedRow.isDataChanged = true
                        const apiRef = pre.sharedData.apiRef
                        apiRef.current.setEditCellValue({
                            id: params.row.id,
                            field: 'hsn',
                            value: e.target.value || null,
                        })
                        setRefresh({})
                    }
                }
            },
            {
                headerName: 'MRP',
                description: 'Maximum retail price',
                editable: true,
                field: 'maxRetailPrice',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale pr',
                description: 'Sale price',
                field: 'salePrice',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale pr (Gst)',
                description: 'Sale price with Gst',
                field: 'salePriceGst',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Dealer pr',
                description: 'Dealer price',
                field: 'dealerPrice',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Purch pr',
                description: 'Purchase price',
                field: 'purPrice',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur pr (Gst)',
                description: 'Purchase price with Gst',
                field: 'purPriceGst',
                type: 'number',
                width: 100,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Gst(%)',
                field: 'gstRate',
                width: '80'
            },
            {
                headerName: 'Unit',
                field: 'unitName',
                width: '120'
            },
            {
                headerName: 'Details',
                field: 'info',
                width: '200'
            },
            {
                headerName: 'UPC',
                field: 'upcCode',
                width: '120'
            },
        ]

        const queryId = 'get_products'
        const queryArgs = {
            no: 1000
        }
        const summaryColNames: string[] = []
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-PRODUCTS',
            editIbukiMessage: 'PRODUCTS-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'PRODUCTS-HOOK-XX-GRID-DELETE-CLICKED',
            addIbukiMessage: 'PRODUCTS-HOOK-XX-GRID-ADD-BUTTON-CLICKED',
        }

        return {
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }

    async function handleAdd() {
        await fetchBrandsCategoriesUnits()
        pre.title = 'Add new product'
        pre.showDialog = true
        setRefresh({})
    }

    function handleCellClicked(params: any) {
        if ((params.field==='hsn') && (params.cellMode === 'view')) {
            const apiRef: any = pre.sharedData.apiRef
            apiRef.current.startCellEditMode({ id: params.id, field: params.field })
        }
    }

    async function handleEdit(d: any) {
        await fetchBrandsCategoriesUnits()
        pre.title = 'Edit product'
        pre.product = d.data?.row
        pre.showDialog = true
        setRefresh({})
    }

    function handleCloseDialog() {
        pre.showDialog = false
        pre.product = {}
        setRefresh({})
    }

    async function handleSubmit() {
        const changedData = pre.sharedData.filteredRows.filter((x: any) => x.isDataChanged).map((y: any) => ({
            id: y.id1,
            hsn: y.hsn || null
        }))
        const ret = await genericUpdateMasterNoForm({
            data: changedData,
            tableName: 'ProductM',
        })
        if (ret) {
            pre.isDataChanged = false
            setRefresh({})
        }
    }

    // function processRowUpdate(newRow: any) {
    //     console.log(newRow)
    //     newRow.isDataChanged = true
    // }

    return { getXXGridParams, handleCellClicked, handleCloseDialog, handleSubmit, meta, }
}

export { useProducts }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 245px)',
            width: '100%',
            marginTop: '5px',
            '& .xx-grid': {
                marginTop: theme.spacing(1),
                '& .editable-column': {
                    backgroundColor: theme.palette.yellow.light,
                    color: theme.palette.yellow.contrastText,
                },
                '& .data-changed': {
                    backgroundColor: theme.palette.orange.main,
                    color: theme.palette.orange.contrastText,
                },
            },
        },
    })
)
export { useStyles }
