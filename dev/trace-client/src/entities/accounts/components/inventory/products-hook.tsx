import { useInventoryUtils, useEffect, useRef, useState, useSharedElements, } from './redirect'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'

import { useCrudUtils } from '../common/crud-utils-hook'

function useProducts() {
    const [, setRefresh] = useState({})
    const FETCH_DATA_MESSAGE = 'PRODUCTS-HOOK-FETCH-DATA'
    const meta: any = useRef({
        showDialog: false,
        product: {},
        title: '',
        sharedData: {},
    })
    const pre = meta.current
    const { handleDelete, } = useCrudUtils(meta)
    const { fetchBrandsCategoriesUnits } = useInventoryUtils()
    const {
        emit,
        execGenericView,
        filterOn,
        getFromBag,
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
                width: 80,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                width: 90,
            },
            {
                headerName: 'Code',
                field: 'productCode',
                width: '140'
            },
            {
                headerName: 'Category',
                field: 'catName',
                width: '140'
            },
            {
                headerName: 'Brand',
                field: 'brandName',
                width: '140'
            },
            {
                headerName: 'Label',
                field: 'label',
                width: '180',
            },
            {
                headerName: 'HSN',
                field: 'hsn',
                width: '120'
            },
            {
                headerName: 'Gst(%)',
                field: 'gstRate',
                width: '120'
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
            {
                headerName: 'MRP',
                description: 'Maximum retail price',
                field: 'maxRetailPrice',
                type: 'number',
                width: 130,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale pr',
                description: 'Sale price',
                field: 'salePrice',
                type: 'number',
                width: 130,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Sale pr (Gst)',
                description: 'Sale price with Gst',
                field: 'salePriceGst',
                type: 'number',
                width: 130,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Dealer pr',
                description: 'Dealer price',
                field: 'dealerPrice',
                type: 'number',
                width: 130,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Purch pr',
                description: 'Purchase price',
                field: 'purPrice',
                type: 'number',
                width: 130,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
            },
            {
                headerName: 'Pur price (Gst)',
                description: 'Purchase price with Gst',
                field: 'purPriceGst',
                type: 'number',
                width: 130,
                valueFormatter: (params: any) => toDecimalFormat(params.value),
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

    // async function fetchBrandsCategoriesUnits() {
    //     emit('SHOW-LOADING-INDICATOR', true)
    //     const result: any = await execGenericView({
    //         isMultipleRows: false,
    //         sqlKey: 'getJson_brands_categories_units',
    //         args: {
    //         },
    //     })

    //     const brands = (result?.jsonResult?.brands || []).map((x: any) => {
    //         return {
    //             label: x.brandName,
    //             value: x.id,
    //         }
    //     })
    //     setInBag('brands', brands)
    //     const categories = (result?.jsonResult?.categories || []).map((x: any) => {
    //         return {
    //             label: x.catName,
    //             value: x.id,
    //         }
    //     })
    //     setInBag('categories', categories)
    //     const units = result?.jsonResult.units
    //     setInBag('units', units)
    //     emit('SHOW-LOADING-INDICATOR', false)
    // }

    async function handleAdd() {
        await fetchBrandsCategoriesUnits()
        pre.title = 'Add new product'
        pre.showDialog = true
        setRefresh({})
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

    return { getXXGridParams, handleCloseDialog, meta }
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
            },
        },
    })
)
export { useStyles }
