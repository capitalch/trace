import { useState, useEffect, useRef } from '../../../../imports/regular-imports'
import { makeStyles, createStyles } from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useNewProduct() {
    const [, setRefresh] = useState({})
    const {
        confirm,
        doValidateForm,
        emit,
        execGenericView,
        filterOn,
        getCurrentEntity,
        getFormData,
        isValidForm,
        messages,
        ReactForm,
        resetForm,
        resetAllFormErrors,
        saveForm,
        TraceFullWidthSubmitButton,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('NEW-PRODUCT-EDIT').subscribe((d: any) => {
            handleEdit(d.data)
        })

        const subs2 = filterOn('NEW-PRODUCT-DELETE').subscribe((d: any) => {
            handleDelete(d.data)
        })

        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            formId: '',
            title: '',
            content: () => { },
            actions: () => { },
        },
    })

    async function doSave(formData: any, customCodeBlock: any = null) {
        formData.jData = formData.jData || null
        formData.upcCode = formData.upcCode || null
        formData.info = formData.info || null
        formData.hsn = formData.hsn || null
        const formId = meta.current.dialogConfig.formId
        resetAllFormErrors(formId)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            saveForm({
                formId: meta.current.dialogConfig.formId,
                data: {
                    data: formData,
                    tableName: 'ProductM',
                    customCodeBlock: customCodeBlock,
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            })
        } else {
            meta.current.isMounted && setRefresh({})
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
                last: meta.current.last || null,
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

    async function handleAdd() {
        const pre = meta.current.dialogConfig
        pre.formId = 'addTraceProduct'
        pre.title = 'Add product'
        resetForm(pre.formId)
        meta.current.showDialog = true
        pre.content = add
        pre.actions = () => (
            <TraceFullWidthSubmitButton
                onClick={submit}></TraceFullWidthSubmitButton>
        )
        await getBrandsCategoriesUnits()
        meta.current.isMounted && setRefresh({})

        function add() {
            const json: any = JSON.parse(JSON.stringify(getNewProductJson()))

            json.items[0].options = [
                { label: '---select---', value: '' },
                ...meta.current.dialogConfig.categories,
            ]
            json.items[1].options = [
                { label: '---select---', value: '' },
                ...meta.current.dialogConfig.brands,
            ]
            json.items[5].options = [
                { label: '---select---', value: '' },
                ...meta.current.dialogConfig.units,
            ]

            return (
                <ReactForm
                    formId={meta.current.dialogConfig.formId}
                    jsonText={JSON.stringify(json)}
                    name={getCurrentEntity()}
                />
            )
        }

        async function submit() {
            const formData = JSON.parse(
                JSON.stringify(getFormData(meta.current.dialogConfig.formId))
            )
            await doSave(formData, 'insert_product_block') // Insert requires customCodeBlock for running no for productCode
        }
    }

    async function handleEdit(rowData: any) {
        const pre = meta.current.dialogConfig
        pre.formId = 'editTraceProduct'
        pre.title = 'Edit product'
        resetForm(pre.formId)
        meta.current.showDialog = true
        pre.content = edit
        pre.actions = () => (
            <TraceFullWidthSubmitButton
                onClick={submit}></TraceFullWidthSubmitButton>
        )
        await getBrandsCategoriesUnits()
        meta.current.isMounted && setRefresh({})

        function edit() {
            const json: any = JSON.parse(JSON.stringify(getNewProductJson()))

            json.items[0].value = rowData.catId
            json.items[1].value = rowData.brandId
            json.items[5].value = rowData.unitId
            const itemLabel = json.items.find((x: any) => x.name === 'label')
            itemLabel.value = rowData.label

            const itemHsn = json.items.find((x: any) => x.name === 'hsn')
            itemHsn.value = rowData.hsn

            const itemInfo = json.items.find((x: any) => x.name === 'info')
            itemInfo.value = rowData.info

            const itemUpc = json.items.find((x: any) => x.name === 'upcCode')
            itemUpc.value = rowData.upcCode

            meta.current.dialogConfig.id = rowData.id

            json.items[0].options = [
                { label: '---select---', value: '' },
                ...meta.current.dialogConfig.categories,
            ]
            json.items[1].options = [
                { label: '---select---', value: '' },
                ...meta.current.dialogConfig.brands,
            ]
            json.items[5].options = [
                { label: '---select---', value: '' },
                ...meta.current.dialogConfig.units,
            ]

            return (
                <ReactForm
                    formId={meta.current.dialogConfig.formId}
                    jsonText={JSON.stringify(json)}
                    name={getCurrentEntity()}
                />
            )
        }

        async function submit() {
            const formData = JSON.parse(
                JSON.stringify(getFormData(meta.current.dialogConfig.formId))
            )
            formData.id = meta.current.dialogConfig.id
            await doSave(formData)
        }
    }

    function handleDelete(rowData: any) {
        try {
            const deletedIds = [rowData.id]
            const options: any = {
                data: {
                    tableName: 'ProductM',
                    deletedIds: deletedIds,
                },
                queryId: 'genericUpdateMaster',
            }
            const confirmOptions = {
                description: messages.deleteConfirm,
                title: messages.deleteMessage,
                cancellationText: 'Cancel',
            }
            confirm(confirmOptions)
                .then(async () => {
                    await saveForm(options)
                })
                .catch(() => { })
        } catch (e) {
            console.log(e)
        }
    }

    function handleOnCloseDialog() {
        meta.current.showDialog = false
        meta.current.isMounted && setRefresh({})
    }

    return { handleAdd, meta }
}

export { useNewProduct }

const useStyles: any = makeStyles(() =>
    createStyles({
        content: {
            width: '100%',
            '& .button': {
                color: 'dodgerBlue',
                fontSize: '0.8rem',
                marginTop: '0.3rem'
            }
        },
    })
)

export { useStyles }

function getNewProductJson() {
    return {
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
}
