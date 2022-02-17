import { _, InputSwitch, PrimeColumn, TreeTable, useState, useEffect, useRef } from '../../../../imports/regular-imports'
import styled from 'styled-components'
import {
    Avatar,
    Box,
    Button, Dialog,
    DialogActions, IconButton,
    DialogContent, Switch, Typography,
    DialogTitle,
    Chip,
} from '../../../../imports/gui-imports'
import {
    Add,
    Edit, SyncSharp,
    CloseSharp,
} from '../../../../imports/icons-import'
import { useSharedElements, useStyles } from '../common/shared-elements-hook'
import { useTheme } from '../../../../imports/gui-imports'

function AccountsMaster() {
    const [, setRefresh] = useState({})
    const formIdRef: any = useRef('accounts-master')

    const {
        clearServerError,
        doFormRefresh,
        doValidateForm,
        emit,
        execGenericView,
        genericUpdateMaster,
        genericUpdateMasterNoForm,
        getArtifacts,
        getCurrentEntity,
        getCurrentMediaSize,
        getFromBag,
        getFormData,
        getFormObject,
        globalMessages,
        hotFilterOn,
        init,
        isMediumSizeUp,
        isControlDisabled,
        isValidForm,
        messages,
        queries,
        queryGraphql,
        ReactForm,
        resetForm,
        resetAllFormErrors,
        saveForm,
        setInBag,
        setFormError,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
    } = useSharedElements()
    const theme: any = useTheme()
    const [data, setData]: any[] = useState([])
    const accClassRef = useRef(JSON.parse(JSON.stringify(accClassAddition)))

    const meta: any = useRef({
        isMounted: false,
        accClassMRef: [],
        groupsLedgersRef: [],
        showDialog: false,
        showAddressDialog: false,
        dialogConfig: {
            title: '',
            dialogActions: <></>,
            dialogContent: <></>,
            entryType: '',
            dialogWidth: '',
        },
        addressDialogConfig: {
            title: 'Address',
            formId: 'addressEntryForm',
            accId: '',
            id: '',
        },

        allKeys: [],
        globalFilter: '',
        windowWidth: '',
        headerConfig: {
            title: 'Accounts master',
            textVariant: 'subtitle1',
        },
        tableConfig: {
            expanderColumn: '',
            buttonsColumn: '',
        },
    })

    function getFormId() {
        return formIdRef.current
    }

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        getData()
        const subs = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').subscribe(
            (d: any) => {
                curr.accClassMRef = d.data.allClasses.map((x: any) => {
                    return { value: x.id, label: x.accClass }
                })
            }
        )
        return () => {
            utilFunc().saveScrollPos()
            curr.isMounted = false
            subs.unsubscribe()
        }
    }, [])

    const tableConfig = meta.current.tableConfig
    const headerConfig = meta.current.headerConfig
    const dialogConfig = meta.current.dialogConfig
    const classes = useStyles({ meta: meta })

    if (isMediumSizeUp) {
        dialogConfig.dialogWidth = '360px'
    } else {
        dialogConfig.dialogWidth = '290px'
    }

    utilFunc().applyScrollPos()

    const mediaLogic: any = {
        xs: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '15rem'
            tableConfig.buttonsColumn = '12rem'
        },
        sm: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '22rem'
            tableConfig.buttonsColumn = '12rem'
        },
        md: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '25rem'
            tableConfig.buttonsColumn = '20rem'
        },
        lg: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '28rem'
            tableConfig.buttonsColumn = '20rem'
        },
        xl: () => mediaLogic['lg'](),
    }

    const currentMediaSize = getCurrentMediaSize()
    currentMediaSize && mediaLogic[currentMediaSize]()

    return (
        <Box
            className={classes.content}>
            <Box className={classes.header}>
                <Typography
                    color="primary"
                    variant={meta.current.headerConfig.textVariant || 'h6'}
                    component="span">
                    {headerConfig.title}
                </Typography>
                <Box component="span" className={classes.expandRefresh}>
                    <Span style={{ marginTop: '-1px' }}>Expand</Span>
                    <InputSwitch
                        checked={getFromBag('accMasterExpandAll') || false}
                        style={{ float: 'right', marginRight: '0.5rem' }}
                        onChange={(e: any) => {
                            const val = e.target.value
                            setInBag('accMasterExpandAll', val)
                            if (val) {
                                const expObject = meta.current.allKeys.reduce(
                                    (prev: any, x: any) => {
                                        prev[x] = true
                                        return prev
                                    },
                                    {}
                                )
                                setInBag('accMasterExpandedKeys', expObject)
                            } else {
                                setInBag('accMasterExpandedKeys', {})
                            }
                            meta.current.isMounted && setRefresh({})
                        }}></InputSwitch>
                    <IconButton
                        className={classes.syncSharpButton}
                        size="medium"
                        color="secondary"
                        onClick={(e: any) => getData()}>
                        <SyncSharp />
                    </IconButton>
                </Box>
                {traceGlobalSearch({
                    meta: meta,
                    isMediumSizeUp: isMediumSizeUp,
                })}
            </Box>

            <TreeTable
                scrollable={true}
                scrollHeight="calc(100vh - 20rem)"
                value={data}
                expandedKeys={getFromBag('accMasterExpandedKeys') || {}}
                globalFilter={meta.current.globalFilter}
                onToggle={(e: any) => {
                    setInBag('accMasterExpandedKeys', e.value)
                    utilFunc().saveScrollPos()
                    meta.current.isMounted && setRefresh({})
                }}>
                {/* Account name */}
                <PrimeColumn
                    expander
                    style={{ width: tableConfig.expanderColumn }}
                    field="accName"
                    header={
                        <div>
                            <label
                                style={{ float: 'left', fontSize: '0.9rem' }}>
                                Account name
                            </label>
                        </div>
                    }></PrimeColumn>

                {/* Add / delete / edit buttons */}
                <PrimeColumn
                    style={{ width: tableConfig.buttonsColumn }}
                    body={(node: any) => {
                        const isDeleteAllowed =
                            !node.children &&
                            !node.data.isPrimary &&
                            !node.data.accTranYear &&
                            !node.data.accOpBal
                        const isAddAllowed =
                            node.data.accLeaf === 'L' ||
                            node.data.accLeaf === 'N'
                        const isEditAllowed = !node.data.isPrimary
                        return (
                            <div>
                                {isAddAllowed && (
                                    <Button
                                        disabled={isControlDisabled(
                                            'masters-accounts-add-child'
                                        )}
                                        className={classes.addButton}
                                        color="inherit"
                                        size="small"
                                        startIcon={<Add></Add>}
                                        onClick={() => {
                                            utilFunc().saveScrollPos()
                                            resetForm(getFormId())
                                            dialogConfig.id = undefined // otherwise if edit is done then this contains old value
                                            const accName = node.data.accName
                                            dialogConfig.entryType = 'newChild'
                                            dialogConfig.title = 'New child of '.concat(
                                                accName
                                            )
                                            dialogConfig.parentId = node.data.id
                                            dialogConfig.classId =
                                                node.data.classId
                                            dialogConfig.accType =
                                                node.data.accType
                                            dialogConfig.accLeaf =
                                                node.data.accLeaf
                                            meta.current.showDialog = true
                                            meta.current.isMounted &&
                                                setRefresh({})
                                        }}>
                                        {isMediumSizeUp ? 'Add child' : ''}
                                    </Button>
                                )}

                                {isEditAllowed && (
                                    <Button
                                        className={classes.editButton}
                                        disabled={isControlDisabled(
                                            'masters-accounts-add-child'
                                        )}
                                        size="small"
                                        color="secondary"
                                        startIcon={<Edit></Edit>}
                                        onClick={() => {
                                            utilFunc().saveScrollPos()
                                            const accName = node.data.accName
                                            dialogConfig.entryType = 'editSelf'
                                            dialogConfig.title = 'Edit '.concat(
                                                accName
                                            )
                                            dialogConfig.id = node.data.id
                                            dialogConfig.parentId =
                                                node.data.parentId
                                            dialogConfig.accClass =
                                                node.data.accClass
                                            dialogConfig.classId =
                                                node.data.classId
                                            dialogConfig.accType =
                                                node.data.accType
                                            dialogConfig.accLeaf =
                                                node.data.accLeaf
                                            dialogConfig.accCode =
                                                node.data.accCode
                                            dialogConfig.accName =
                                                node.data.accName
                                            meta.current.showDialog = true
                                            meta.current.isMounted &&
                                                setRefresh({})
                                        }}>
                                        {isMediumSizeUp ? 'Edit self' : ''}
                                    </Button>
                                )}

                                {isDeleteAllowed && (
                                    <Button
                                        disabled={isControlDisabled(
                                            'masters-accounts-add-child'
                                        )}
                                        size="small"
                                        style={{ width: theme.spacing(3) }}
                                        className={classes.deleteButton}
                                        startIcon={<CloseSharp />}
                                        onClick={async () => {
                                            const id = node.data.id
                                            const toDelete = window.confirm(
                                                globalMessages['deleteConfirm']
                                            )
                                            if (toDelete) {
                                                const ret = await genericUpdateMaster(
                                                    {
                                                        deletedIds: [id],
                                                        tableName: 'AccM',
                                                    }
                                                )
                                                if (ret?.length <= 10) { // it cannot be an error message
                                                    emit('SHOW-MESSAGE', {})
                                                    getData()
                                                }
                                            }
                                        }}>
                                        Del
                                    </Button>
                                )}
                            </div>
                        )
                    }}
                    header={
                        <Button
                            color="primary"
                            disabled={isControlDisabled('masters-accounts-add-child')}
                            className={classes.addButton}
                            startIcon={<Add />}
                            onClick={() => {
                                dialogConfig.entryType = 'newGroup'
                                dialogConfig.title = 'New group account as root'
                                dialogConfig.parentId = null
                                dialogConfig.classId = null
                                dialogConfig.accType = null
                                dialogConfig.accLeaf = 'N'
                                meta.current.showDialog = true
                                meta.current.isMounted && setRefresh({})
                            }}>
                            Add group
                        </Button>
                    }></PrimeColumn>
                {/* accCode */}
                {isMediumSizeUp && (
                    <PrimeColumn
                        field="accCode"
                        style={{ width: '10rem', overflowX: 'hidden' }}
                        header={
                            <div>
                                <label
                                    style={{
                                        float: 'left',
                                        fontSize: '0.9rem',
                                    }}>
                                    Short code
                                </label>
                            </div>
                        }></PrimeColumn>
                )}
                {/* primary */}
                <PrimeColumn
                    field="isPrimary"
                    header={<div style={{ textAlign: 'left' }}>Primary</div>}
                    body={(e: any) => {
                        return e.data.isPrimary ? 'Yes' : 'No'
                    }}
                    style={{ width: '4.5rem' }}></PrimeColumn>
                {/* Type */}
                <PrimeColumn
                    field="accType"
                    header={<div style={{ textAlign: 'left' }}>Type</div>}
                    style={{ width: '5rem', color: 'blue', fontWeight: 'bold' }}
                    body={(node: any) => {
                        const mType: any = {
                            L: 'Liability',
                            A: 'Asset',
                            E: 'Expence',
                            I: 'Income',
                        }
                        const ret = mType[node.data.accType]
                        return ret
                    }}></PrimeColumn>
                {/* class */}
                <PrimeColumn
                    field="accClass"
                    header={<div style={{ textAlign: 'left' }}>Class</div>}
                    style={{ width: '5rem' }}></PrimeColumn>
                {/* level */}
                <PrimeColumn
                    field="className"
                    header={<div style={{ textAlign: 'left' }}>Level</div>}
                    body={(e: any) => {
                        const trace: any = {
                            Y: 'Leaf',
                            N: 'Group',
                            L: 'Ledger',
                            S: 'Subledger',
                        }
                        return trace[e.data.accLeaf]
                    }}
                    style={{ width: '8rem' }}></PrimeColumn>
                {/* Addr */}
                <PrimeColumn
                    field="addressable"
                    header="Addr"
                    body={(node: any) => {
                        return (
                            node.data.addressable && (
                                <Chip
                                    clickable={true}
                                    size="small"
                                    label={
                                        node.data.isAddressExists
                                            ? 'Filled'
                                            : 'Empty'
                                    }
                                    color="secondary"
                                    onClick={() => {
                                        meta.current.addressDialogConfig.title = `Address for ${node.data.accName}`
                                        meta.current.addressDialogConfig.accId =
                                            node.data.id //accid
                                        meta.current.addressDialogConfig.id =
                                            node.data.extBusinessContactsAccMId
                                        meta.current.showAddressDialog = true
                                        meta.current.isMounted && setRefresh({})
                                    }}
                                    avatar={
                                        node.data.isAddressExists ? (
                                            <Avatar>A</Avatar>
                                        ) : (
                                            <></>
                                        )
                                    }
                                />
                            )
                        )
                    }}
                    style={{
                        width: '5rem',
                        textAlign: 'center',
                        marginRight: '0.5rem',
                    }}></PrimeColumn>
                {/* Auto subledger */}
                <PrimeColumn
                    header="Auto sub"
                    field="isAutoSubledger"
                    body={(node: any) => {
                        const ret = (
                            <Switch
                                disabled={node.children?.length > 0}
                                color="secondary"
                                checked={node.data.isAutoSubledger}
                                onChange={(e: any) =>
                                    autoSubledgerChange(e, node)
                                }
                            />
                        )
                        return node.data.accLeaf === 'L' &&
                            node.data.accClass === 'debtor'
                            ? ret
                            : null
                    }}
                    style={{ width: '6rem', marginRight: '0.2rem' }}
                />
            </TreeTable>

            {/* Accounts dialog */}
            <Dialog
                classes={{ paper: classes.dialogPaper }} // overriding to adjust dialog width as per device viewport
                open={meta.current.showDialog}
                onClose={closeDialog}>
                <DialogTitle
                    id="generic-dialog-title"
                    className={classes.dialogTitle}>
                    <div>{meta.current.dialogConfig.title}</div>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={closeDialog}
                        aria-label="close">
                        <CloseSharp />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <Comp></Comp>
                </DialogContent>
                <DialogActions>
                    <TraceFullWidthSubmitButton
                        onClick={
                            submitAccountEntry
                        }></TraceFullWidthSubmitButton>
                </DialogActions>
            </Dialog>
            {/* Address dialog */}
            <Dialog
                open={meta.current.showAddressDialog}
                onClose={closeAddressDialog}
                fullWidth={true}
                className={classes.addressEntry}>
                <DialogTitle
                    // disableTypography
                    id="generic-address-dialog-title"
                    className={classes.dialogTitle}>
                    <div>{meta.current.addressDialogConfig.title}</div>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={closeAddressDialog}
                        aria-label="closeAddress">
                        <CloseSharp />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <AddressComp></AddressComp>
                </DialogContent>
                <DialogActions>
                    <TraceFullWidthSubmitButton
                        onClick={
                            handleSubmitAddress
                        }></TraceFullWidthSubmitButton>
                </DialogActions>
            </Dialog>
        </Box>
    )

    async function autoSubledgerChange(e: any, node: any) {
        try {
            emit('SHOW-LOADING-INDICATOR', true)
            const val = e.target.checked
            await genericUpdateMasterNoForm({
                customCodeBlock: 'upsert_autoSubledger',
                data: {
                    accId: node.data.id,
                    isAutoSubledger: val,
                },
            })
            utilFunc().saveScrollPos()
            node.data.isAutoSubledger = val
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
            utilFunc().applyScrollPos()
        } catch (e: any) {
            console.log(e.message)
            emit('SHOW-MESSAGE', {
                message: messages['errorInOperation'],
                severity: 'error',
                duration: null,
            })
        }
    }

    async function getData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const q = queries['genericQueryBuilder']({
            // in shared artifacts
            queryName: 'accountsMasterGroupsLedgers',
            queryType: 'query',
        })
        if (q) {
            const results: any = await queryGraphql(q)
            const pre = results.data.accounts.accountsMasterGroupsLedgers
            meta.current.allKeys = pre.allKeys
            const dt1: any[] = pre.accountsMaster
            const logic: any = { N: 'Group', L: 'Ledger' }
            const dt2: any[] = pre.groupsLedgers.map((x: any) => {
                return {
                    value: x.id,
                    label: logic[x.accLeaf].concat(
                        ': ',
                        x.accClass,
                        ': ',
                        x.accName
                    ),
                    accLeaf: x.accLeaf,
                    accType: x.accType,
                    accClass: x.accClass,
                }
            })
            meta.current.groupsLedgersRef = dt2
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setData(dt1)
        }
        utilFunc().applyScrollPos()
    }

    async function handleSubmitAddress() {
        const formId = meta.current.addressDialogConfig.formId
        resetAllFormErrors(formId)
        emit('SHOW-LOADING-INDICATOR', true)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            transformAddressAndSubmit()
        } else {
            setFormError(formId, globalMessages.formError)
        }
        emit('SHOW-LOADING-INDICATOR', false)
        meta.current.isMounted && setRefresh({})

        async function transformAddressAndSubmit() {
            const formData = JSON.parse(JSON.stringify(getFormData(formId)))
            formData.accId = meta.current.addressDialogConfig.accId
            const jAddress = formData.jAddress
            const jData = formData.jData
            _.isEmpty(jAddress)
                ? (formData.jAddress = null)
                : (formData.jAddress = JSON.stringify(jAddress))
            _.isEmpty(jData)
                ? (formData.jData = null)
                : (formData.jData = JSON.stringify(jData))
            saveForm({
                data: {
                    data: formData,
                    tableName: 'ExtBusinessContactsAccM',
                },
                formId: formId,
                queryId: 'genericUpdateMaster',
                afterMethod: closeAddressDialog,
            })
        }
    }

    async function submitAccountEntry() {
        utilFunc().saveScrollPos()
        const formId = getFormId()
        clearServerError(formId)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            let data: any = getFormData(formId)
            data.parentId ||
                (data.parentId = meta.current.dialogConfig.parentId)
            data.isPrimary = false
            data.accLeaf || (data.accLeaf = meta.current.dialogConfig.accLeaf)
            data.classId || (data.classId = meta.current.dialogConfig.classId)
            data.accType || (data.accType = meta.current.dialogConfig.accType)
            data.id || (data.id = meta.current.dialogConfig.id)
            if (data.id) {
                // edit is done, remove unwanted columns
                data.accLeaf = undefined
                data.accType = undefined
                data.isPrimary = undefined
            }
            data = JSON.parse(JSON.stringify(data))
            const finalData: any = {}
            finalData.tableName = 'AccM'
            finalData.updateCodeBlock = 'updateBlock_editAccount'
            finalData.data = { ...data }
            saveForm({
                data: finalData,
                formId: formId,
                queryId: 'genericUpdateMaster',
                afterMethod: closeDialog,
            })
        } else {
            doFormRefresh(getFormId())
        }
    }

    function closeDialog() {
        meta.current.showDialog = false
        resetForm(getFormId())
        resetAllFormErrors(getFormId())
        meta.current.isMounted && setRefresh({})
    }

    function closeAddressDialog() {
        const formId = meta.current.addressDialogConfig.formId
        meta.current.showAddressDialog = false
        resetAllFormErrors(formId)
        resetForm(formId)
        meta.current.isMounted && setRefresh({})
    }

    function AddressComp() {
        const [, setRefresh] = useState({})
        const addressMeta = useRef({
            isMounted: false,
            reactForm: <></>,
        })

        useEffect(() => {
            const address = addressMeta.current
            address.isMounted = true
            meta.current.showAddressDialog && asyncWrapper()
            return () => {
                address.isMounted = false
            }
        }, [])

        return addressMeta.current.reactForm

        async function asyncWrapper() {
            emit('SHOW-LOADING-INDICATOR', true)
            const ret = await execGenericView({
                isMultipleRows: false,
                sqlKey: 'get_extBusinessContactsAccM',
                args: { id: meta.current.addressDialogConfig.id },
            })
            emit('SHOW-LOADING-INDICATOR', false)
            addressMeta.current.reactForm = getReactForm()
            if (ret) {
                let formData = getFormData(
                    meta.current.addressDialogConfig.formId
                )
                Object.keys(ret).forEach((x) => {
                    formData[x] = ret[x]
                })
            }
            addressMeta.current.isMounted && setRefresh({})
        }

        function getReactForm() {
            const addressClone = JSON.parse(JSON.stringify(addressEntry))
            const jAddressClone = JSON.parse(JSON.stringify(jAddressEntry))
            addressClone.items = addressClone.items.concat(
                jAddressClone,
            )
            const addressCloneString = JSON.stringify(addressClone)
            return (
                <ReactForm
                    formId={meta.current.addressDialogConfig.formId}
                    jsonText={addressCloneString}
                    name={getCurrentEntity()}></ReactForm>
            )
        }
    }

    function Comp() {
        if (!meta.current.dialogConfig.entryType) {
            return <></>
        }

        function getParentOptions(
            allOptions: any[],
            accClass: string,
            accType: string,
            accLeaf: string
        ) {
            let options: any[] = []
            const specialClasses: string[] = [
                'cash',
                'bank',
                'sale',
                'purchase',
                'ecash',
                'card',
            ]
            const assetsLiabs: string[] = ['L', 'A']
            const expIncomes: string[] = ['E', 'I']
            if (specialClasses.includes(accClass)) {
                options = allOptions.filter((x: any) => x.accClass === accClass)
            } else if (assetsLiabs.includes(accType)) {
                options = allOptions.filter((x: any) => {
                    return (
                        assetsLiabs.includes(x.accType) &&
                        !specialClasses.includes(x.accClass) &&
                        !(x.accClass === accClass && x.accLeaf === accLeaf)
                    )
                })
            } else if (expIncomes.includes(accType)) {
                options = allOptions.filter(
                    (x: any) =>
                        expIncomes.includes(x.accType) &&
                        !specialClasses.includes(x.accClass) &&
                        !(x.accClass === accClass && x.accLeaf === accLeaf)
                )
            }
            return options
        }

        function onAccTypeChange(value: string) {
            const sw: any = {
                A: () => assetOptions,
                L: () => liabOptions,
                E: () => expOptions,
                I: () => incomeOptions,
            }
            const assetClassNames = [
                'branch',
                'other',
                'loan',
                'creditor',
                'debtor',
                'bank',
                'cash',
                'card',
                'ecash',
            ]
            const liabClassNames = [
                'branch',
                'capital',
                'other',
                'loan',
                'creditor',
                'debtor',
                'bank',
                'card',
                'ecash',
            ]
            const expClassNames = ['other', 'iexp', 'purchase', 'dexp']
            const incomeClassNames = ['other', 'iincome', 'sale', 'dincome']
            const assetOptions = meta.current.accClassMRef.filter((x: any) =>
                assetClassNames.includes(x.label)
            )
            const liabOptions = meta.current.accClassMRef.filter((x: any) =>
                liabClassNames.includes(x.label)
            )
            const expOptions = meta.current.accClassMRef.filter((x: any) =>
                expClassNames.includes(x.label)
            )
            const incomeOptions = meta.current.accClassMRef.filter((x: any) =>
                incomeClassNames.includes(x.label)
            )
            const selectOption = [{ label: '---select---', value: '' }]
            const tempArray = selectOption.concat(sw[value] ? sw[value]() : [])
            accClassRef.current.options = [...tempArray]

            meta.current.isMounted && setRefresh({})
        }

        function onParentChange(value: string) { }

        const cusMethods = getArtifacts('accounts').customMethods
        cusMethods['onAccTypeChange'] = onAccTypeChange
        cusMethods['onParentChange'] = onParentChange

        const accClassTemp: any = JSON.parse(JSON.stringify(accClassAddition)) // meta.current.accClassRef
        accClassTemp.options = accClassRef.current.options
        const accTypeTemp: any = JSON.parse(JSON.stringify(accTypeAddition))
        const accLeafTemp: any = JSON.parse(JSON.stringify(accLeafAddition))
        const accParentTemp: any = JSON.parse(JSON.stringify(accParentAddition))
        accParentTemp.options = accParentTemp.options.concat(
            getParentOptions(
                meta.current.groupsLedgersRef,
                meta.current.dialogConfig.accClass,
                meta.current.dialogConfig.accType,
                meta.current.dialogConfig.accLeaf
            )
        )
        const workingJson: any = {
            newGroup: () => {
                const accEntryTemp: any = JSON.parse(
                    JSON.stringify(accountsEntry)
                )
                accEntryTemp.items.push(accTypeTemp)
                accEntryTemp.items.push(accClassTemp)
                return accEntryTemp
            },
            newChild: () => {
                resetForm(getFormId())
                // let formData = getFormData(getFormId())
                const accEntryTemp: any = JSON.parse(
                    JSON.stringify(accountsEntry)
                )
                // restrict cash / bank / sale / purchase being Ledger type of account
                const restrictedClasses = [
                    'purchase',
                    'sale',
                    'cash',
                    'bank',
                    'ecash',
                    'card',
                ]
                if (meta.current.dialogConfig.accLeaf === 'N') {
                    if (
                        restrictedClasses.includes(
                            meta.current.dialogConfig.accClass
                        )
                    ) {
                        accLeafTemp.options = accLeafTemp.options.concat(
                            accLeafOptionsGroupWithoutLedger
                        )
                    } else {
                        accLeafTemp.options = accLeafTemp.options.concat(
                            accLeafOptionsGroupWithLedger
                        )
                    }
                } else if (meta.current.dialogConfig.accLeaf === 'L') {
                    meta.current.dialogConfig.accLeaf = 'S'
                    const formObject = getFormObject(getFormId())
                    formObject &&
                        formObject.formData &&
                        (formObject.formData.accLeaf = 'S')
                    accLeafTemp.options = accLeafTemp.options.concat(
                        accLeafOptionsLedger
                    )
                }
                accEntryTemp.items.push(accLeafTemp)
                return accEntryTemp
            },
            editSelf: () => {
                resetForm(getFormId())
                const accEntryTemp: any = JSON.parse(
                    JSON.stringify(accountsEntry)
                )
                init(getFormId()) // necessary. Otherwise text boxes are not populated for first time
                const formObject: any = getFormObject(getFormId())
                if (formObject && formObject.formData) {
                    formObject.formData.accCode =
                        meta.current.dialogConfig.accCode
                    formObject.formData.accName =
                        meta.current.dialogConfig.accName
                    formObject.formData.id = meta.current.dialogConfig.id
                    formObject.formData.parentId =
                        meta.current.dialogConfig.parentId
                }
                accEntryTemp.items.push(accParentTemp)
                return accEntryTemp
            },
        }
        const entryType = meta.current.dialogConfig.entryType
        const jsonObject = workingJson[entryType]()

        return (
            <ReactForm
                formId={getFormId()}
                jsonText={JSON.stringify(jsonObject)}
                name={getCurrentEntity()}
                className={classes.common}></ReactForm>
        )
    }

    function utilFunc() {
        function saveScrollPos() {
            const scrollPos = window.pageYOffset
            setInBag('accMasterScrollPos', scrollPos)
        }

        function applyScrollPos() {
            const scrollPos = getFromBag('accMasterScrollPos')
            window.scrollTo(0, scrollPos || 0)
        }
        return { saveScrollPos, applyScrollPos }
    }
}

export { AccountsMaster }

const Span = styled.span`
    float: right;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight: normal;
`

const jAddressEntry: any = {
    type: 'Range',
    name: 'jAddress',
    label: 'Addresses',
    pattern: {
        type: 'Set',
        name: 'jAddress',
        label: 'Address',
        validations: [],
        items: [
            {
                type: 'TextMaterial',
                name: 'address1',
                class: 'textField',
                materialProps: {
                    size: 'small',
                    fullWidth: true,
                },
                label: 'Address1',
                validations: [
                    {
                        name: 'required',
                        message: 'Address1 is required',
                    },
                ],
            },
            {
                type: 'TextMaterial',
                class: 'textField',
                name: 'address2',
                materialProps: {
                    size: 'small',
                    fullWidth: true,
                },
                label: 'Address2',
                validations: [],
            },
            {
                type: 'TextMaterial',
                class: 'textField',
                name: 'pin',
                materialProps: {
                    size: 'small',
                },
                label: 'Pin',
                validations: [
                    {
                        name: 'required',
                        message: 'Pin is required',
                    },
                ],
            },
            {
                type: 'TextMaterial',
                class: 'textField',
                name: 'city',
                materialProps: {
                    size: 'small',
                },
                label: 'City',
                validations: [
                    {
                        name: 'required',
                        message: 'City is required',
                    },
                ],
            },
            {
                type: 'TextMaterial',
                class: 'textField',
                name: 'state',
                materialProps: {
                    size: 'small',
                },
                label: 'State',
                validations: [
                    {
                        name: 'required',
                        message: 'State is required',
                    },
                ],
            },
            {
                type: 'TextMaterial',
                name: 'country',
                class: 'textField',
                materialProps: {
                    size: 'small',
                },
                label: 'Country',
                validations: [
                    {
                        name: 'required',
                        message: 'Country is required',
                    },
                ],
            },
        ],
    },
}

const addressEntry: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'TextMaterial',
            name: 'contactName',
            class: 'textField',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Contact name',
            validations: [
                {
                    name: 'required',
                    message: 'Contact name is required',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'contactCode',
            class: 'textField',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Contact code',
            validations: [
                {
                    name: 'required',
                    message: 'Contact code is required',
                },
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed in contact code',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'mobileNumber',
            class: 'textField',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Primary mobile number',
            validations: [
                {
                    name: 'phoneNumber',
                    message: 'Invalid mobile number',
                },
            ],
        },
        {
            type: 'TextMaterial',
            name: 'otherMobileNumber',
            class: 'textField',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Other mobile numbers',
            validations: [],
        },
        {
            type: 'TextMaterial',
            name: 'landPhone',
            class: 'textField',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Land phone',
            validations: [],
        },
        {
            type: 'TextMaterial',
            class: 'textField',
            name: 'email',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Primary email',
            validations: [
                {
                    name: 'required',
                    message: 'Email is required',
                },
                {
                    name: 'email',
                    message: 'Invalid email',
                },
            ],
        },
        {
            type: 'TextMaterial',
            class: 'textField',
            name: 'otherEmail',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Other email addresses',
            validations: [],
        },
        {
            type: 'TextMaterial',
            class: 'textField',
            name: 'descr',
            placeholder: 'Description',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Description',
            validations: [],
        },
        {
            type: 'TextMaterial',
            class: 'textField',
            name: 'gstin',
            placeholder: 'Gstin',
            materialProps: {
                size: 'small',
                fullWidth: true,
            },
            label: 'Gstin number',
            validations: [
                {
                    name: 'gstinValidation',
                    message: 'Invalid GSTIN',
                },
            ],
        },
        {
            type: 'Numeric',
            class: 'textField',
            name: 'stateCode',
            placeholder: 'State code',
            label: 'State code',
            validations: [
                {
                    name: 'required',
                    message: 'State code is required',
                },
            ],
        }
    ],
}

const accountsEntry: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'accCode',
            placeholder: 'Account code',
            label: 'Account code',
            validations: [
                {
                    name: 'required',
                    message: 'Account code is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'accName',
            placeholder: 'Account name',
            label: 'Account name',
            validations: [
                {
                    name: 'required',
                    message: 'Account name is required',
                },
            ],
        },
    ],
}

const accTypeAddition = {
    type: 'Select',
    name: 'accType',
    label: 'Account type',
    onChange: 'onAccTypeChange',
    validations: [{ name: 'required', message: 'Account type is required' }],
    options: [
        { label: '---select---', value: '' },
        { label: 'Asset', value: 'A' },
        { label: 'Expence', value: 'E' },
        { label: 'Income', value: 'I' },
        { label: 'Liability', value: 'L' },
    ],
}

const accClassAddition = {
    type: 'Select',
    name: 'classId',
    label: 'Account class',
    validations: [{ name: 'required', message: 'Account class is required' }],
    options: [{ value: '', label: '---select---' }],
}

const accParentAddition = {
    type: 'Select',
    name: 'parentId',
    label: 'Parent account',
    onChange: 'onParentChange',
    validations: [
        { name: 'required', message: 'Parent of account is required' },
    ],
    options: [{ value: '', label: '---select---' }],
}

const accLeafAddition = {
    type: 'Select',
    name: 'accLeaf',
    label: 'Account level',
    validations: [{ name: 'required', message: 'Account level is required' }],
    options: [
        {
            label: '---select---',
            value: '',
        },
    ],
}

const accLeafOptionsGroupWithoutLedger = [
    {
        label: 'Group',
        value: 'N',
    },
    {
        label: 'Leaf',
        value: 'Y',
    },
]

const accLeafOptionsGroupWithLedger = [
    {
        label: 'Group',
        value: 'N',
    },
    {
        label: 'Leaf',
        value: 'Y',
    },
    {
        label: 'Ledger',
        value: 'L',
    },
]

const accLeafOptionsLedger = [
    {
        label: 'Subledger',
        value: 'S',
    },
]
