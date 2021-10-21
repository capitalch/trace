import {
    useRef,
    useState,
    useEffect,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { useCrudUtils } from '../common/crud-utils-hook'

function useProducts() {
    const [, setRefresh] = useState({})
    const FETCH_DATA_MESSAGE = 'PRODUCTS-HOOK-FETCH-DATA'
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: '',
            tableName: 'ProductM',
            formId: 'trace-product-master',
            ibukiFetchDataMessage: FETCH_DATA_MESSAGE,
            actions: () => { },
            content: () => <></>,
        },
        setRefresh: setRefresh,
    })
    const {
        getReactFormContent,
        handleCloseDialog,
        handleDelete,
        handleSubmit,
    } = useCrudUtils(meta)

    const {
        emit,
        execGenericView,
        filterOn,
        manageFormsState,
        TraceFullWidthSubmitButton,
    } = useSharedElements()

    const { getFormData, resetAllValidators, resetForm } =
        manageFormsState()

    useEffect(() => {
        const subs1 = filterOn(FETCH_DATA_MESSAGE).subscribe(() => {
            emit(getXXGridParams().gridActionMessages.fetchIbukiMessage, null)
        })

        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            //edit
            handleEdit(d.data)
        })

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
                minWidth: '180',
                flex: 1
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
        ]

        const queryId = 'get_products'
        const queryArgs = {
            no: 100
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
        const pre = meta.current.dialogConfig
        meta.current.showDialog = true
        pre.isEditMode = false
        pre.title = 'New product'
        pre.id = undefined
        pre.codeBlock = 'insert_product_block' // For auto productCode generation this code block is required
        pre.jData = null
        resetForm(pre.formId)
        resetAllValidators(pre.formId)
        await getBrandsCategoriesUnits() // puts in brands, categories and units in pre

        pre.content = getContent()
        pre.actions = () => (
            <TraceFullWidthSubmitButton onClick={handlePreSubmit} />
        )
        setRefresh({})

        function getContent() {
            const json = JSON.parse(JSON.stringify(productMasterJson))
            json.items[0].options = [
                { label: '---select---', value: '' },
                ...pre.categories,
            ]
            json.items[1].options = [
                { label: '---select---', value: '' },
                ...pre.brands,
            ]
            json.items[5].options = [
                { label: '---select---', value: '' },
                ...pre.units,
            ]
            const ret = getReactFormContent(JSON.stringify(json))
            return (ret)
        }

        // to set jData as null, otherwise database error happens
        function handlePreSubmit() {
            const formData = getFormData(pre.formId)
            formData['jData'] = null
            handleSubmit(null, formData)
        }
    }

    async function handleEdit(data: any) {
        const pre = meta.current.dialogConfig
        const { id1 } = data?.row
        meta.current.showDialog = true
        pre.isEditMode = true
        pre.title = 'Edit product'
        pre.id = id1
        pre.idInsert = undefined
        pre.codeBlock = undefined
        pre.jData = null
        resetForm(pre.formId)
        resetAllValidators(pre.formId)

        await getBrandsCategoriesUnits()
        pre.content = getContent()
        pre.actions = () => (
            <TraceFullWidthSubmitButton onClick={handleSubmit} />
        )
        await getBrandsCategoriesUnits()
        setRefresh({})

        function getContent() {
            const { catId, brandId, label, hsn, unitId, info, upcCode, gstRate } = data?.row
            const json = JSON.parse(JSON.stringify(productMasterJson))
            json.items[0].value = catId
            json.items[1].value = brandId
            json.items[5].value = unitId

            const itemLabel = json.items.find((x: any) => x.name === 'label')
            itemLabel.value = label

            const itemHsn = json.items.find((x: any) => x.name === 'hsn')
            itemHsn.value = hsn

            const itemInfo = json.items.find((x: any) => x.name === 'info')
            itemInfo.value = info

            const itemUpc = json.items.find((x: any) => x.name === 'upcCode')
            itemUpc.value = upcCode

            const itemGstRate = json.items.find((x: any) => x.name === 'gstRate')
            itemGstRate.value = gstRate

            json.items[0].options = [
                { label: '---select---', value: '' },
                ...pre.categories,
            ]
            json.items[1].options = [
                { label: '---select---', value: '' },
                ...pre.brands,
            ]
            json.items[5].options = [
                { label: '---select---', value: '' },
                ...pre.units,
            ]

            const ret = getReactFormContent(JSON.stringify(json))
            return (ret)
        }
    }

    async function getBrandsCategoriesUnits() {
        const pre = meta.current.dialogConfig
        if (pre.brands && pre.categories && pre.units) {
            return
        }
        emit('SHOW-LOADING-INDICATOR', true)

        const result: any = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_brands_categories_units',
            args: {
            },
        })

        pre.brands = (result?.jsonResult?.brands || []).map((x: any) => {
            return {
                label: x.brandName,
                value: x.id,
            }
        })

        pre.categories = (result?.jsonResult?.categories || []).map((x: any) => {
            return {
                label: x.catName,
                value: x.id,
            }
        })

        pre.units = result?.jsonResult.units.map((x: any) => {
            return {
                label: x.unitName,
                value: x.id,
            }
        })
        emit('SHOW-LOADING-INDICATOR', false)

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

const productMasterJson: any = {
    class: 'generic-dialog',
    style: { width: '100%' },
    items: [
        {
            type: 'Select',
            name: 'catId',
            label: 'Category',
            validations: [
                {
                    name: 'required',
                    message: 'Category is required',
                },
            ],
            options: [],
        },
        {
            type: 'Select',
            name: 'brandId',
            label: 'Brand',
            validations: [
                {
                    name: 'required',
                    message: 'Brand is required',
                },
            ],
            options: [],
        },
        {
            type: 'Text',
            name: 'label',
            label: 'Product label',
            validations: [
                {
                    name: 'required',
                    message: 'Product label is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'hsn',
            label: 'HSN code',
            htmlProps: {
                type: 'number',
            },
            validations: [],
        },
        {
            type: 'Text',
            name: 'gstRate',
            label: 'Gst rate (%)',
            htmlProps: {
                type: 'number',
            },
            validations: [],
        },
        {
            type: 'Select',
            name: 'unitId',
            label: 'Unit of measurement',
            value: 1,
            validations: [],
            options: [],
        },
        {
            type: 'Text',
            name: 'info',
            label: 'Product details',
            validations: [],
        },
        {
            type: 'Text',
            name: 'upcCode',
            label: 'UPC code',
            validations: [],
        },
    ],
}