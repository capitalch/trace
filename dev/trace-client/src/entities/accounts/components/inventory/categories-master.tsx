import { useState, useEffect } from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { useCategoriesMaster, useStyles } from './categories-master-hook'


function CategoriesMaster() {
    const [, setRefresh] = useState({})
    const { meta, utilFunc } = useCategoriesMaster()
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        getData()
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const {
        AddIcon,
        Box,
        Button,
        confirm,
        DeleteIcon,
        doValidateForm,
        EditIcon,
        emit,
        getCurrentEntity,
        getFormData,
        getFromBag,
        Grid,
        IconButton,
        isValidForm,
        LinkIcon,
        messages,
        PrimeColumn,
        queries,
        queryGraphql,
        ReactForm,
        resetForm,
        saveForm,
        setInBag,
        SyncIcon,
        Switch,
        TreeTable,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        Typography,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <Box className="header">
                <Typography variant="h6" component="span">{meta.current.headerConfig.title}</Typography>
                <Typography component="div">
                    <Grid component="label" container alignItems="center" >
                        <Grid item >Expand</Grid>
                        <Grid item>
                            <Switch
                                checked={getFromBag('categoriesExpandAll') || false}
                                onChange={
                                    (e: any) => {
                                        const val = e.target.checked
                                        setInBag('categoriesExpandAll', val)
                                        if (val) {
                                            const expObject = meta.current.allKeys.reduce((prev: any, x: any) => {
                                                prev[x] = true
                                                return prev
                                            }, {})
                                            setInBag('categoriesExpandedKeys', expObject)
                                        } else {
                                            setInBag('categoriesExpandedKeys', {})
                                        }
                                        meta.current.isMounted && setRefresh({})
                                    }}
                            />
                        </Grid>
                        <Grid>
                            <IconButton
                                className={classes.syncIconButton}
                                size='medium'
                                color='secondary'
                                onClick={getData}>
                                <SyncIcon></SyncIcon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Typography>
                {traceGlobalSearch({ meta: meta, isMediumSizeUp: true })}
            </Box>

            <TreeTable
                className={classes.content}
                value={meta.current.data}
                scrollable={true}
                scrollHeight="calc(100vh - 22rem)"
                expandedKeys={getFromBag('categoriesExpandedKeys') || {}}
                globalFilter={meta.current.globalFilter}
                onToggle={e => {
                    setInBag('categoriesExpandedKeys', e.value)
                    utilFunc().saveScrollPos()
                    meta.current.isMounted && setRefresh({})
                }}>
                <PrimeColumn
                    expander
                    className="min-width-10rem"
                    field="catName"
                    header='Category name'>
                </PrimeColumn>

                <PrimeColumn
                    className="min-width-10rem"
                    header={
                        <Button
                            variant="contained"
                            className="add-category"
                            color="secondary"
                            size="small"
                            onClick={handleAddRootcategory}
                            startIcon={<AddIcon />}
                        >Add root category</Button>
                    }
                    body={(node: any) => {
                        let ret = null
                        const isAddChildAllowed = !node.data.isLeaf
                        const isDeleteAllowed = getDeleteAllowed()
                        const isChangeParentAllowed = node.data.parentId // root nodes cannot change parents
                        ret = <div>
                            <Button
                                // variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditSelf(node)}
                            >Edit self</Button>

                            <span>{' '}</span>
                            {
                                isAddChildAllowed && <Button
                                    // variant="contained"
                                    color="secondary"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddChild(node)}
                                >
                                    Add Child
                                </Button>
                            }

                            <span>{' '}</span>
                            {
                                isChangeParentAllowed && <Button
                                    size="small"
                                    onClick={() => handleChangeParent(node)}
                                    startIcon={<LinkIcon />}>
                                    Change parent
                                </Button>
                            }

                            <span>{' '}</span>
                            {
                                isDeleteAllowed && <IconButton
                                    size="small"
                                    onClick={() => handleDelete(node)}
                                    className="delete-category" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            }
                        </div>
                        return (ret)

                        function getDeleteAllowed() {
                            let ret = true
                            if (node.children?.length && (node.children.length > 0)) {
                                ret = false
                            } else if (node.data.isUsedInProductM) {
                                ret = false
                            }
                            return (ret)
                        }

                    }}
                />

                <PrimeColumn
                    field='descr'
                    header='Description'
                />

                <PrimeColumn
                    field="isLeaf"
                    header='Leaf'
                    style={{ width: '4rem' }}
                    body={(node: any) => {
                        return node.data.isLeaf ? 'Yes' : 'No'
                    }}
                />

                <PrimeColumn
                    field="isUsedInProductM"
                    header="Used"
                    style={{ width: '4rem' }}
                    body={(node: any) => {
                        return node.data.isUsedInProductM ? 'Yes' : 'No'
                    }}
                />
            </TreeTable>

            <TraceDialog meta={meta} /> 
            {/* materialDialogProps={{ className: classes.dialog }}  */}
        </div>
    )

    function handleAddChild(node: any) {
        const pre = meta.current.dialogConfig
        pre.title = `Add child for ${node.data.catName}`
        pre.formId = 'traceAddChild'
        resetForm(pre.formId)

        pre.content = addChild
        pre.actions = () => <TraceFullWidthSubmitButton onClick={submit}></TraceFullWidthSubmitButton>
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function addChild() {
            if (!meta.current.showDialog) { // to avoid un-necessary execution of code while closing the dialog box
                return <></>
            }

            const json: any = getAddChildJson()
            const ret = <ReactForm
                formId={meta.current.dialogConfig.formId}
                jsonText={JSON.stringify(json)}
                name={getCurrentEntity()}
            />
            return (ret)

            function getAddChildJson() {
                return {
                    "class": "generic-dialog",
                    "style": { width: '100%' },
                    "items": [
                        {
                            "type": "Text",
                            "name": "catName",
                            "label": "Category name",
                            "validations": [{
                                "name": "required",
                                "message": "Category name is rrequired"
                            }]
                        },
                        {
                            "type": "Text",
                            "name": "descr",
                            "label": "Category description",
                        },
                        {
                            "type": "Checkbox",
                            "name": "isLeaf",
                            "label": "Is leaf",
                        }
                    ]
                }
            }
        }

        async function submit() {
            const formData = JSON.parse(JSON.stringify(getFormData(meta.current.dialogConfig.formId)))
            formData.parentId = node.data.id
            formData.isLeaf = formData.isLeaf || false
            const formId = meta.current.dialogConfig.formId
            await doValidateForm(formId)
            const options: any = {
                data: {
                    data: formData,
                    tableName: 'CategoryM',
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            }
            if (isValidForm(formId)) {
                saveForm(options)
            } else {
                meta.current.isMounted && setRefresh({})
            }
        }
    }

    function handleChangeParent(node: any) {
        const selectedNodeId = node.data.id
        let destinationPath: string
        let newParentId: any
        //Open dialog and show tree to select from
        const pre = meta.current.dialogConfig
        pre.title = `Select new parent for ${node.data.catName}`
        pre.content = () => {
            return (
                <TreeTable
                    className="select-parent"
                    value={meta.current.data}
                    selectionMode="single"
                    onSelect={(e: any) => {
                        destinationPath = e.node.data.path
                        // console.log(e)
                    }}
                    onSelectionChange={(e: any) => {
                        newParentId = e.value
                    }}>
                    <PrimeColumn expander
                        field="catName"
                        header='Category name' />

                    <PrimeColumn
                        field="descr"
                        header='Description' />

                    <PrimeColumn
                        style={{ width: '3rem', fontSize: '0.8rem' }}
                        field="isLeaf"
                        header='Leaf'
                        body={(node: any) => {
                            return node.data.isLeaf ? 'Y' : 'N'
                        }} />
                </TreeTable>
            )
        }
        pre.actions = () => <TraceFullWidthSubmitButton onClick={submit}></TraceFullWidthSubmitButton>
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        async function submit() {
            try {
                const pathArray = destinationPath.split(',')
                const formId = meta.current.dialogConfig.formId
                if (pathArray.includes(String(selectedNodeId))) {
                    alert('not allowed')
                } else {
                    await doValidateForm(formId)
                    const options: any = {
                        data: {
                            tableName: 'CategoryM',
                            data: {
                                id: selectedNodeId,
                                parentId: newParentId
                            }
                        },
                        queryId: 'genericUpdateMaster',
                        afterMethod: handleOnCloseDialog,
                    }
                    if (isValidForm(formId)) {
                        await saveForm(options)
                    } else {
                        meta.current.isMounted && setRefresh({})
                    }
                }

            } catch (e) {
                console.log(e.message)
            }
        }
    }

    async function handleDelete(node: any) {
        try {
            const id = node.data.id
            const deletedIds = [id]
            const options: any = {
                data: {
                    tableName: 'CategoryM',
                    deletedIds: deletedIds
                },
                queryId: 'genericUpdateMaster'
            }
            const confirmOptions = {
                description: messages.deleteConfirm,
                title: messages.deleteMessage,
                cancellationText: 'Cancel'
            }
            confirm(confirmOptions).then(async () => {
                await saveForm(options)
            }).catch(() => { })
        } catch (e) {
            console.log(e)
        }
    }

    function handleEditSelf(node: any) {
        const pre = meta.current.dialogConfig
        pre.title = `Edit ${node.data.catName}`
        pre.formId = 'editTraceCategory'
        resetForm(pre.formId)

        pre.content = editCategory
        pre.actions = () => <TraceFullWidthSubmitButton onClick={submit}></TraceFullWidthSubmitButton>
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function editCategory() {
            if (!meta.current.showDialog) { // to avoid un-necessary execution of code while closing the dialog box
                return <></>
            }
            const json: any = getEditCategoryJson()
            const leafJson: any = getLeafJson()

            // leaf disabled when its parentId is null (root node) or it has children or ProductM has catId
            const isLeafDisabled = (!node.data.parentId)
                || (node.data.children)
                || (node.data.isUsedInProductM)
            isLeafDisabled && (leafJson.htmlProps = { "disabled": true })
            leafJson.value = node.data.isLeaf

            json.items.push(leafJson)
            json.items[0].value = node.data.catName
            json.items[1].value = node.data.descr
            const ret = <ReactForm
                formId={meta.current.dialogConfig.formId}
                jsonText={JSON.stringify(json)}
                name={getCurrentEntity()}
            />

            return (ret)

            function getEditCategoryJson() {
                return {
                    "class": "generic-dialog",
                    "style": { width: '100%' },
                    "items": [
                        {
                            "type": "Text",
                            "name": "catName",
                            "label": "Category name",
                            "validations": [{
                                "name": "required",
                                "message": "Category name is required"
                            }]
                        },
                        {
                            "type": "Text",
                            "name": "descr",
                            "label": "Category description",
                        },
                    ]
                }
            }

            function getLeafJson() {
                return {
                    "type": "Checkbox",
                    "name": "isLeaf",
                    "label": "Is leaf",
                }
            }
        }

        function submit() {
            const formData = JSON.parse(JSON.stringify(getFormData(meta.current.dialogConfig.formId)))
            formData.isLeaf = formData.isLeaf || false
            formData.id = node.data.id
            // this is update because id is present in data
            saveForm({
                data: {
                    data: formData,
                    tableName: 'CategoryM',
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            })
        }
    }

    function handleAddRootcategory() {
        const pre = meta.current.dialogConfig
        pre.formId = 'addTraceRootCategory'
        pre.title = 'Add root category'
        resetForm(pre.formId)
        meta.current.showDialog = true
        pre.content = rootCategoryEntry
        pre.actions = () => <TraceFullWidthSubmitButton onClick={handleOnSubmit}></TraceFullWidthSubmitButton>
        meta.current.isMounted && setRefresh({})

        function handleOnSubmit() {
            const formData = JSON.parse(JSON.stringify(getFormData(meta.current.dialogConfig.formId)))
            saveForm({
                data: {
                    data: formData,
                    tableName: 'CategoryM',
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            })
        }

        function rootCategoryEntry() {
            return (
                <ReactForm
                    formId={meta.current.dialogConfig.formId}
                    jsonText={JSON.stringify(rootCategoryEntryJson())}
                    name={getCurrentEntity()}
                />
            )

            function rootCategoryEntryJson() {
                return {
                    "class": "generic-dialog",
                    "style": { width: '100%' },
                    "items": [
                        {
                            "type": "Text",
                            "name": "catName",
                            "label": "Category name",
                            "validations": [{
                                "name": "required",
                                "message": "Category name is required"
                            }]
                        },
                        {
                            "type": "Text",
                            "name": "descr",
                            "label": "Category description",
                        },
                    ]
                }
            }
        }
    }

    function handleOnCloseDialog() {
        meta.current.showDialog = false
        meta.current.isMounted && setRefresh({})
    }

    async function getData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const q = queries['genericQueryBuilder']({ // in shared artifacts
            queryName: 'allCategories'
            , queryType: 'query'
        })
        try {
            if (q) {
                const result: any = await queryGraphql(q)
                const pre = result.data.accounts.allCategories
                meta.current.allKeys = pre.allKeys
                meta.current.data = pre.categories
                await processTree(meta.current.data) // experimental
            }

        } catch (e) {
            emit('SHOW-MESSAGE', { severity: 'error', message: messages['errorInOperation'], duration: null })
            console.log(e.message)
        }
        emit('SHOW-LOADING-INDICATOR', false)
        meta.current.isMounted && setRefresh({})

    }

    async function processTree(tree: any[]) {
        for (let node of tree) {
            node.label = node.data.catName
            if (node.children) {
                processTree(node.children)
            }
        }
    }
}

export { CategoriesMaster }