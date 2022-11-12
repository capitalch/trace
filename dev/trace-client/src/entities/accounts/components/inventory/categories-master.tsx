import { useCategoriesMaster, useStyles } from './categories-master-hook'
import {
    _, Add, Attachment, Box, Button, DeleteForever, Edit, Grid, IconButton, IMegaData, Link, MegaDataContext, PrimeColumn, ReactSelect,
    Switch, SyncSharp, TreeTable, Typography, useContext, useState, useTheme, useEffect, useSharedElements, utils, utilMethods
} from './redirect'

function CategoriesMaster() {
    const [, setRefresh] = useState({})
    const { handleHsnLeafCategories, handleManageTags, meta, utilFunc } = useCategoriesMaster()
    const classes = useStyles()
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const inventory:any = megaData.accounts.inventory
    const { execGenericView, genericUpdateMasterNoForm } = utilMethods()
    // const { } = utils()
    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        megaData.registerKeyWithMethod('fetchAllTags:categoriesMaster', fetchAllTags)
        megaData.registerKeyWithMethod('render:categoriesMaster', setRefresh)
        getData()
        return () => {
            curr.isMounted = false
        }
    }, [])

    const {
        BasicMaterialDialog,
        confirm,
        doValidateForm,
        emit,
        getCurrentEntity,
        getFormData,
        getFromBag,
        isValidForm,
        messages,
        queries,
        queryGraphql,
        ReactForm,
        resetForm,
        saveForm,
        setInBag,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <Box className="header">
                <Typography variant="h6" component="span">
                    {meta.current.headerConfig.title}
                </Typography>
                <Typography component="div">
                    <Grid component="label" container alignItems="center">
                        <Grid item>Expand</Grid>
                        <Grid item>
                            <Switch
                                checked={
                                    getFromBag('categoriesExpandAll') || false
                                }
                                onChange={(e: any) => {
                                    const val = e.target.checked
                                    setInBag('categoriesExpandAll', val)
                                    if (val) {
                                        const expObject =
                                            meta.current.allKeys.reduce(
                                                (prev: any, x: any) => {
                                                    prev[x] = true
                                                    return prev
                                                },
                                                {}
                                            )
                                        setInBag(
                                            'categoriesExpandedKeys',
                                            expObject
                                        )
                                    } else {
                                        setInBag('categoriesExpandedKeys', {})
                                    }
                                    meta.current.isMounted && setRefresh({})
                                }}
                            />
                        </Grid>
                        <Grid>
                            <IconButton
                                className={classes.syncSharpButton}
                                size="medium"
                                color="secondary"
                                onClick={getData}>
                                <SyncSharp />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 4, rowGap: 1, }}>
                    <Button size='small' color='secondary' variant='contained' onClick={handleHsnLeafCategories}>HSN for leaf categories</Button>
                    <Button size='small' color='primary' variant='contained' onClick={handleManageTags}>Manage tags</Button>
                    {traceGlobalSearch({ meta: meta, isMediumSizeUp: true })}
                </Box>
            </Box>
            <TreeTable
                className={classes.content}
                value={meta.current.data}
                scrollable={true}
                scrollHeight="calc(100vh - 22rem)"
                expandedKeys={getFromBag('categoriesExpandedKeys') || {}}
                globalFilter={meta.current.globalFilter}
                onToggle={(e: any) => {
                    setInBag('categoriesExpandedKeys', e.value)
                    utilFunc().saveScrollPos()
                    meta.current.isMounted && setRefresh({})
                }}>
                <PrimeColumn
                    expander
                    className="min-width-10rem"
                    field="catName"
                    header="Category name"></PrimeColumn>

                <PrimeColumn
                    className="min-width-10rem"
                    header={
                        <Button
                            variant="contained"
                            className="add-category"
                            color="secondary"
                            size="small"
                            onClick={handleAddRootcategory}
                            startIcon={<Add />}>
                            Add root category
                        </Button>
                    }
                    body={(node: any) => {
                        let ret = null
                        const isAddChildAllowed = !node.data.isLeaf
                        const isDeleteAllowed = getDeleteAllowed()
                        const isChangeParentAllowed = node.data.parentId // root nodes cannot change parents
                        ret = (
                            <div>
                                <Button
                                    color="primary"
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => handleEditSelf(node)}>
                                    Edit self
                                </Button>

                                <span> </span>
                                {isAddChildAllowed && (
                                    <Button
                                        color="secondary"
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={() => handleAddChild(node)}>
                                        Add Child
                                    </Button>
                                )}

                                <span> </span>
                                {isChangeParentAllowed && (
                                    <Button
                                        size="small"
                                        onClick={() => handleChangeParent(node)}
                                        startIcon={<Link />}>
                                        Change parent
                                    </Button>
                                )}
                                {/* Tag */}
                                <Button
                                    onClick={() => handleTag(node)}
                                    startIcon={<Attachment />}
                                    size='small' >
                                    Tag
                                </Button>
                                <span> </span>
                                {isDeleteAllowed && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(node)}
                                        className="delete-category"
                                        aria-label="delete">
                                        <DeleteForever />
                                    </IconButton>
                                )}
                            </div>
                        )
                        return ret

                        function getDeleteAllowed() {
                            let ret = true
                            if (
                                node.children?.length &&
                                node.children.length > 0
                            ) {
                                ret = false
                            } else if (node.data.isUsedInProductM) {
                                ret = false
                            }
                            return ret
                        }
                    }}
                />

                <PrimeColumn field='tagName' header='Tag' style={{ width: '6rem' }} />

                <PrimeColumn field="descr" header="Description" style={{ width: '10rem' }} />

                <PrimeColumn
                    field="isLeaf"
                    header="Leaf"
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
        </div>
    )

    async function fetchAllTags() {
        emit('SHOW-LOADING-INDICATOR', true)
        inventory.allTags = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_tags',
        }) || []
        setId(inventory.allTags)
        emit('SHOW-LOADING-INDICATOR', false)
        // setRefresh({})

        function setId(rows: any[]) {
            let count = 1
            for (const row of rows) {
                row.id1 = row.id
                row.id = incr()
            }
            function incr() {
                return (count++)
            }
        }
    }

    function handleAddChild(node: any) {
        const pre = meta.current.dialogConfig
        pre.title = `Add child for ${node.data.catName}`
        pre.formId = 'traceAddChild'
        resetForm(pre.formId)

        pre.content = addChild
        pre.actions = () => (
            <TraceFullWidthSubmitButton
                onClick={submit}></TraceFullWidthSubmitButton>
        )
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function addChild() {
            if (!meta.current.showDialog) {
                // to avoid un-necessary execution of code while closing the dialog box
                return <></>
            }

            const json: any = getAddChildJson()
            const ret = (
                <ReactForm
                    formId={meta.current.dialogConfig.formId}
                    jsonText={JSON.stringify(json)}
                    name={getCurrentEntity()}
                />
            )
            return ret

            function getAddChildJson() {
                return {
                    class: 'generic-dialog',
                    style: { width: '100%' },
                    items: [
                        {
                            type: 'Text',
                            name: 'catName',
                            label: 'Category name',
                            validations: [
                                {
                                    name: 'required',
                                    message: 'Category name is rrequired',
                                },
                            ],
                        },
                        {
                            type: 'Text',
                            name: 'descr',
                            label: 'Category description',
                        },
                        {
                            type: 'Checkbox',
                            name: 'isLeaf',
                            label: 'Is leaf',
                        },
                    ],
                }
            }
        }

        async function submit() {
            const formData = JSON.parse(
                JSON.stringify(getFormData(meta.current.dialogConfig.formId))
            )
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
                await saveForm(options)
                await getData()
            } else {
                meta.current.isMounted && setRefresh({})
            }
        }
    }

    function handleChangeParent(node: any) {
        const pre = meta.current.dialogConfig
        const selectedNodeId = node.data.id
        let destinationPath: string
        let newParentId: any
        //Open dialog and show tree to select from
        pre.title = `Select new parent for ${node.data.catName}`
        pre.content = () => {
            return (
                <TreeTable
                    className="select-parent"
                    value={meta.current.data}
                    selectionMode="single"
                    onSelect={(e: any) => {
                        destinationPath = e.node.data.path
                    }}
                    onSelectionChange={(e: any) => {
                        newParentId = e.value
                    }}>
                    <PrimeColumn
                        expander
                        field="catName"
                        header="Category name"
                    />

                    <PrimeColumn field="descr" header="Description" />

                    <PrimeColumn
                        style={{ width: '3rem', fontSize: '0.8rem' }}
                        field="isLeaf"
                        header="Leaf"
                        body={(node: any) => {
                            return node.data.isLeaf ? 'Y' : 'N'
                        }}
                    />
                </TreeTable>
            )
        }
        pre.actions = () => (
            <TraceFullWidthSubmitButton
                onClick={submit}></TraceFullWidthSubmitButton>
        )
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        async function submit() {
            try {
                // No form required. This is direct update
                const pathArray = destinationPath.split(',')
                if (pathArray.includes(String(selectedNodeId))) {
                    alert('not allowed')
                } else {
                    const options: any = {
                        data: {
                            tableName: 'CategoryM',
                            data: {
                                id: selectedNodeId,
                                parentId: newParentId,
                            },
                        },
                        queryId: 'genericUpdateMaster',
                        afterMethod: handleOnCloseDialog,
                    }
                    await saveForm(options)
                    await getData()
                }
            } catch (e: any) {
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
                    await getData()
                })
                .catch(() => { })
        } catch (e: any) {
            console.log(e)
        }
    }

    function handleEditSelf(node: any) {
        const pre = meta.current.dialogConfig
        pre.title = `Edit ${node.data.catName}`
        pre.formId = 'editTraceCategory'
        resetForm(pre.formId)

        pre.content = editCategory
        pre.actions = () => (
            <TraceFullWidthSubmitButton
                onClick={submit}></TraceFullWidthSubmitButton>
        )
        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function editCategory() {
            if (!meta.current.showDialog) {
                // to avoid un-necessary execution of code while closing the dialog box
                return <></>
            }
            const json: any = getEditCategoryJson()
            const leafJson: any = getLeafJson()

            // leaf disabled when its parentId is null (root node) or it has children or ProductM has catId
            const isLeafDisabled =
                !node.data.parentId ||
                node.data.children ||
                node.data.isUsedInProductM
            isLeafDisabled && (leafJson.htmlProps = { disabled: true })
            leafJson.value = node.data.isLeaf

            json.items.push(leafJson)
            json.items[0].value = node.data.catName
            json.items[1].value = node.data.descr
            const ret = (
                <ReactForm
                    formId={meta.current.dialogConfig.formId}
                    jsonText={JSON.stringify(json)}
                    name={getCurrentEntity()}
                />
            )

            return ret

            function getEditCategoryJson() {
                return {
                    class: 'generic-dialog',
                    style: { width: '100%' },
                    items: [
                        {
                            type: 'Text',
                            name: 'catName',
                            label: 'Category name',
                            validations: [
                                {
                                    name: 'required',
                                    message: 'Category name is required',
                                },
                            ],
                        },
                        {
                            type: 'Text',
                            name: 'descr',
                            label: 'Category description',
                        },
                    ],
                }
            }

            function getLeafJson() {
                return {
                    type: 'Checkbox',
                    name: 'isLeaf',
                    label: 'Is leaf',
                }
            }
        }

        async function submit() {
            const formData = JSON.parse(
                JSON.stringify(getFormData(meta.current.dialogConfig.formId))
            )
            formData.isLeaf = formData.isLeaf || false
            formData.id = node.data.id
            // this is update because id is present in data
            await saveForm({
                data: {
                    data: formData,
                    tableName: 'CategoryM',
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            })
            await getData()
        }
    }

    function handleAddRootcategory() {
        const pre = meta.current.dialogConfig
        pre.formId = 'addTraceRootCategory'
        pre.title = 'Add root category'
        resetForm(pre.formId)
        meta.current.showDialog = true
        pre.content = rootCategoryEntry
        pre.actions = () => (
            <TraceFullWidthSubmitButton
                onClick={handleOnSubmit}></TraceFullWidthSubmitButton>
        )
        meta.current.isMounted && setRefresh({})

        async function handleOnSubmit() {
            const formData = JSON.parse(
                JSON.stringify(getFormData(meta.current.dialogConfig.formId))
            )
            saveForm({
                data: {
                    data: formData,
                    tableName: 'CategoryM',
                },
                afterMethod: handleOnCloseDialog,
                queryId: 'genericUpdateMaster',
            })
            await getData()
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
                    class: 'generic-dialog',
                    style: { width: '100%' },
                    items: [
                        {
                            type: 'Text',
                            name: 'catName',
                            label: 'Category name',
                            validations: [
                                {
                                    name: 'required',
                                    message: 'Category name is required',
                                },
                            ],
                        },
                        {
                            type: 'Text',
                            name: 'descr',
                            label: 'Category description',
                        },
                    ],
                }
            }
        }
    }

    function handleOnCloseDialog() {
        meta.current.showDialog = false
        meta.current.isMounted && setRefresh({})
    }

    async function handleTag(node: any) {
        const pre = meta.current
        const selectedTagId = node.data.tagId
        pre.showDialog = true
        pre.dialogConfig.title = 'Attach / Detach tag'
        pre.dialogConfig.content = () => <TagContent />
        setRefresh({})

        function TagContent() {
            const [, setRefresh] = useState({})
            useEffect(() => {
                pre.options = inventory.allTags.map((x: any) => ({
                    label: x.tagName,
                    value: x.id1
                }))
                pre.selectedTag = pre.options.find((x: any) => (x.value === selectedTagId)) || { label: 'Nothing', value: null }
                pre.options.unshift({ label: 'Nothing', value: null })
                setRefresh({})
            }, [])

            return (<Box sx={{ display: 'flex', flexDirection: 'column'}}>
                <ReactSelect
                    menuPlacement='bottom'
                    placeholder="Select tag"
                    options={pre.options}
                    value={pre.selectedTag}
                    onChange={onTagChanged}
                />
                {/* Empty box to increase the height of dialog */}
                <Box sx={{ height: theme.spacing(20) }}></Box>
                <Box sx={{ display: 'flex', ml: 'auto' }}>
                    <Button size='small' color='primary' onClick={handleCloseDialog} variant='contained'>Cancel</Button>
                    <Button size='small' color='secondary' onClick={handleSubmit} variant='contained' sx={{ ml: 2 }}>Submit</Button>
                </Box>
            </Box>)

            function handleCloseDialog() {
                pre.showDialog = false
                megaData.executeMethodForKey('render:categoriesMaster', {})
            }

            async function handleSubmit() {
                try {
                    emit('SHOW-LOADING-INDICATOR', true)
                    await genericUpdateMasterNoForm({
                        tableName: 'CategoryM',
                        data: {
                            id: node.data.id,
                            tagId: pre.selectedTag.value
                        }
                    })
                    getData(false, false)
                    emit('SHOW-LOADING-INDICATOR', false)
                    emit('SHOW-MESSAGE', {})
                    handleCloseDialog()
                } catch (e: any) {
                    emit('SHOW-LOADING-INDICATOR', false)
                    console.log(e.message)
                }
            }

            function onTagChanged(selectedItem: any) {
                pre.selectedTag = selectedItem
                setRefresh({})
            }
        }
    }

    async function getData(showLoading: any = true, isFetchAllTags: any = true) {
        showLoading && emit('SHOW-LOADING-INDICATOR', true)
        const q = queries['genericQueryBuilder']({
            // in shared artifacts
            queryName: 'allCategories',
            queryType: 'query',
        })
        try {
            if (q) {
                const result: any = await queryGraphql(q)
                if (isFetchAllTags) {
                    await fetchAllTags()
                }
                const pre = result.data.accounts.allCategories
                meta.current.allKeys = pre.allKeys
                meta.current.data = pre.categories
                await processTree(meta.current.data)
            }
        } catch (e: any) {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: messages['errorInOperation'],
                duration: null,
            })
            console.log(e.message)
        }
        showLoading && emit('SHOW-LOADING-INDICATOR', false)
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
