import {
    hash,
    InputSwitch,
    NumberFormat,
    PrimeColumn,
    TreeTable,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    Typography,
    IconButton,
    Box,
    Theme,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'
import { Save, SyncSharp } from '../../../../imports/icons-import'
import {
    globalMessages,
    graphqlService,
    manageEntitiesState,
    queries,
    useIbuki,
    useTraceGlobal,
    useTraceMaterialComponents,
} from '../../../../imports/trace-imports'
import styled from 'styled-components'
// import { } from '../../../../global-utils/esm'
import { utilMethods } from '../../../../global-utils/misc-utils'
import messages from '../../json/accounts-messages.json'

function AccountsOpBal() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const meta: any = useRef({
        isMounted: false,
        windowWidth: '',
        globalFilter: '',
        footer: {
            debits: 0,
            credits: 0,
        },
        flatData: {},
        initialFlatData: {},
        initialFlatDataHash: '',
        tableConfig: {
            expanderColumn: '',
        },
        headerConfig: {
            title: 'Accounts opening balances',
            textVariant: 'subtitle1',
        },
        data: [],
        // initialData: [],
        editModeStatus: {},
        // initialDataHash: '',
        allKeys: [],
    })

    const classes = useStyles({ meta: meta })
    const { getCurrentMediaSize, isMediumSizeUp, getCurrentWindowSize } =
        useTraceGlobal()
    const { traceGlobalSearch } = useTraceMaterialComponents()
    const tableConfig = meta.current.tableConfig
    const headerConfig = meta.current.headerConfig
    const { queryGraphql } = graphqlService()
    const { genericUpdateMasterNoForm, toDecimalFormat, saveForm } =
        utilMethods()
    const { getFromBag, setInBag } = manageEntitiesState()

    useEffect(() => {
        meta.current.isMounted = true
        getData()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const mediaLogic: any = {
        xs: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '15rem'
        },
        sm: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '22rem'
        },
        md: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '25rem'
        },
        lg: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '35rem'
        },
        xl: () => mediaLogic['lg'](),
    }

    const currentMediaSize = getCurrentMediaSize()
    currentMediaSize && mediaLogic[currentMediaSize]()

    async function getData() {
        const q = queries['genericQueryBuilder']({
            // in shared artifacts
            queryName: 'accountsOpBal',
            queryType: 'query',
        })

        if (q) {
            emit('SHOW-LOADING-INDICATOR', true)
            const results: any = await queryGraphql(q)
            const pre = results.data.accounts.accountsOpBal
            const opBal = pre.opBal
            meta.current.allKeys = pre.allKeys
            // utilFunc().calculateFooter(opBal)
            meta.current.data = JSON.parse(JSON.stringify(opBal))

            utilFunc().flattenData() // flattens the tree data, so that it can be manipulated
            utilFunc().processTree() // sets parent node amounts as sum of children amounts
            // const flatDataLeaf = meta.current.flatData.
            meta.current.initialFlatData = JSON.parse(JSON.stringify(meta.current.flatData))
            meta.current.initialFlatDataHash = hash(meta.current.initialFlatData)
            meta.current.initialData = JSON.parse(JSON.stringify(opBal))
            meta.current.initialDataHash = hash(opBal)
            emit('SHOW-LOADING-INDICATOR', false)
            meta.current.isMounted && setRefresh({})
        }
    }

    function debitCreditEditor(props: any) {
        const field = props.field
        let ret: any = props.node.data[field]
        if (['Y', 'S'].includes(props.node.data['accLeaf'])) {
            ret = (
                <NumberFormat
                    style={{ width: '6rem', textAlign: 'right' }}
                    thousandSeparator={true}
                    thousandsGroupStyle="thousand"
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    onFocus={(e:any) => e.target.select()}

                    onValueChange={(e:any) => {
                        const delta = { debit: 0, credit: 0 }
                        if (field === 'debit') {
                            delta.debit = (e.floatValue || 0) - props.node.data['debit']
                        } else {
                            delta.credit = (e.floatValue || 0) - props.node.data['credit']
                        }
                        props.node.data[field] = e.floatValue || 0.0
                        utilFunc().processParent(delta, props.node.data.parentId)
                        utilFunc().updateFooter(delta)
                        // utilFunc().calculateFooter(meta.current.data)
                        setRefresh({})
                    }}
                    value={props.node.data[field]}></NumberFormat>
            )
        }
        return ret
    }

    return (
        <div
            className={classes.content}
            style={{ width: getCurrentWindowSize() }}>
            <Box className={classes.header}>
                <Typography
                    color="primary"
                    variant={meta.current.headerConfig.textVariant || 'h6'}
                    component="span">
                    {headerConfig.title}
                </Typography>
                <Box component="span" className={classes.expandRefreshSubmit}>
                    <Span style={{ marginTop: '-1px' }}>Expand</Span>
                    <InputSwitch
                        checked={getFromBag('opBalExpandAll') || false}
                        style={{ float: 'right', marginRight: '0.2rem' }}
                        onChange={(e:any) => {
                            const val = e.target.value
                            setInBag('opBalExpandAll', val)
                            if (val) {
                                const expObject = meta.current.allKeys.reduce(
                                    (prev: any, x: any) => {
                                        prev[x] = true
                                        return prev
                                    },
                                    {}
                                )
                                setInBag('opBalExpandedKeys', expObject)
                            } else {
                                setInBag('opBalExpandedKeys', {})
                            }
                            meta.current.isMounted && setRefresh({})
                        }}></InputSwitch>

                    <IconButton
                        disabled={utilFunc().getNotAllowSubmit()}
                        className={classes.iconButton}
                        size="medium"
                        color="secondary"
                        onClick={(e: any) => {
                            const diffObj = utilFunc().getDataDiff(
                                meta.current.initialFlatData,
                                meta.current.flatData
                            )
                            if (diffObj.length > 0) {
                                const finalData: any = {
                                    data: diffObj,
                                }
                                try {
                                    saveForm({
                                        data: finalData,
                                        queryId: 'accountsUpdateOpBal',
                                    })
                                    getData()
                                } catch (error) {
                                    emit('SHOW-MESSAGE', {
                                        message:
                                            globalMessages['errorInOperation'],
                                        severity: 'error',
                                        duration: null,
                                    })
                                }
                            }
                        }}>
                        <Save></Save>
                    </IconButton>

                    <IconButton
                        className={classes.iconButton}
                        size="medium"
                        color="secondary"
                        onClick={(e: any) => getData()}>
                        <SyncSharp></SyncSharp>
                    </IconButton>
                </Box>
                {/* </Box> */}
                {traceGlobalSearch({
                    meta: meta,
                    isMediumSizeUp: isMediumSizeUp,
                })}
            </Box>

            <TreeTable
                scrollable={true}
                scrollHeight="calc(100vh - 22rem)"
                value={meta.current.data}
                expandedKeys={getFromBag('opBalExpandedKeys') || {}}
                onToggle={(e:any) => {
                    setInBag('opBalExpandedKeys', e.value)
                    setRefresh({})
                }}
                globalFilter={meta.current.globalFilter}>
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
                <PrimeColumn
                    field="debit"
                    editor={debitCreditEditor}
                    header={<div style={{ textAlign: 'right' }}>Debit</div>}
                    body={(node: any) => {
                        return (
                            <div
                                style={{
                                    backgroundColor: `${['Y', 'S'].includes(node.data.accLeaf)
                                            ? 'yellow'
                                            : 'white'
                                        }`,
                                }}>
                                {toDecimalFormat(node.data.debit)}
                            </div>
                        )
                    }}
                    footer={
                        <div style={{ textAlign: 'right' }}>
                            {toDecimalFormat(meta.current.footer['debits'])}
                        </div>
                    }
                    style={{ width: '8rem', textAlign: 'right' }}></PrimeColumn>
                <PrimeColumn
                    field="credit"
                    editor={debitCreditEditor}
                    header={<div style={{ textAlign: 'right' }}>Credit</div>}
                    body={(node: any) => {
                        return (
                            <div
                                style={{
                                    backgroundColor: `${['Y', 'S'].includes(node.data.accLeaf)
                                            ? 'yellow'
                                            : 'white'
                                        }`,
                                }}>
                                {toDecimalFormat(node.data.credit)}
                            </div>
                        )
                    }}
                    footer={
                        <div style={{ textAlign: 'right' }}>
                            {toDecimalFormat(meta.current.footer['credits'])}
                        </div>
                    }
                    style={{ width: '8rem', textAlign: 'right' }}></PrimeColumn>
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
            </TreeTable>
        </div>
    )
    function utilFunc() {
        // function calculateFooter(itemArray: any[]) {
        //     let debits = 0,
        //         credits = 0
        //     function processChildren(itArray: any[]) {
        //         for (const item of itArray) {
        //             if (item.data) {
        //                 debits = item.data.parentId
        //                     ? debits
        //                     : debits + item.data.debit
        //                 credits = item.data.parentId
        //                     ? credits
        //                     : credits + item.data.credit
        //             }
        //             if (item.children) {
        //                 processChildren(item.children)
        //             }
        //         }
        //     }
        //     processChildren(itemArray)
        //     const footer = itemArray.reduce(
        //         (prev: any, curr: any) => {
        //             if (['Y', 'S'].includes(curr.data.accLeaf)) {
        //                 prev.debits = prev.debit + curr?.data.debit
        //                 prev.credits = prev.credit + curr?.data.credit
        //             }
        //             return prev
        //         },
        //         { debits: 0, credits: 0 }
        //     )
        //     meta.current.footer = { debits, credits }
        // }

        function flattenData() {
            // meta.current.flatData = {}
            const fd = meta.current.flatData
            // const fdLeaf = meta.current.initialFlatDataLeaf
            processChildren(meta.current.data)
            // meta.current.initialFlatDataLeafHash = hash(meta.current.initialFlatDataLeaf)

            function processChildren(treedata: any) {
                for (const item of treedata) {
                    fd[item.data.id] = item.data
                    if (item.children) {
                        processChildren(item.children)
                    }
                    // if(['Y','S'].includes(item.data.accLeaf)){
                    //     fdLeaf[item.data.id] = item.data
                    // }
                }
            }
        }

        function getNotAllowSubmit() {
            let ret = false
            const dataHash = hash(meta.current.flatData)
            if (dataHash === meta.current.initialFlatDataHash) {
                ret = true
            }
            return ret
        }

        function getDataDiff(data1: any, data2: any) {
            const diffObj: any[] = []
            const flatData1: any[] = Object.values(data1).filter((x: any) => ['Y', 'S'].includes(x.accLeaf))
            const flatData2: any[] = Object.values(data2).filter((x: any) => ['Y', 'S'].includes(x.accLeaf))
            const len: number = flatData1.length
            for (let i: number = 0; i < len; i++) {
                if (flatData2[i].debit !== 0 && flatData2[i].credit !== 0) {
                    diffObj.length = 0
                    emit('SHOW-MESSAGE', {
                        message: messages['errorOpBalDebitCreditTogether'],
                        severity: 'error',
                        duration: null,
                    })
                    break
                }
                if (hash(flatData1[i]) !== hash(flatData2[i])) {
                    diffObj.push({
                        accMId: flatData2[i].accMId,
                        opId: flatData2[i].opId,
                        debit: flatData2[i].debit,
                        credit: flatData2[i].credit,
                    })
                }
            }
            return diffObj
        }

        // function getDataDiff(data1: any[], data2: any[]) {
        //     const diffObj: any[] = []
        //     const flatData1 = getFlatData(data1)
        //     const flatData2 = getFlatData(data2)
        //     const len: number = flatData1.length
        // for (let i: number = 0; i < len; i++) {
        //     if (flatData2[i].debit !== 0 && flatData2[i].credit !== 0) {
        //         diffObj.length = 0
        //         emit('SHOW-MESSAGE', {
        //             message: messages['errorOpBalDebitCreditTogether'],
        //             severity: 'error',
        //             duration: null,
        //         })
        //         break
        //     }
        //     if (hash(flatData1[i]) !== hash(flatData2[i])) {
        //         diffObj.push({
        //             accMId: flatData2[i].accMId,
        //             opId: flatData2[i].opId,
        //             debit: flatData2[i].debit,
        //             credit: flatData2[i].credit,
        //         })
        //     }
        // }
        //     return diffObj
        // }

        // function getFlatData(itemArray: any[]) {
        //     let flatData: any[] = []

        //     function processChildren(itArray: any[]) {
        //         for (const item of itArray) {
        //             if (item.data && ['Y', 'S'].includes(item.data?.accLeaf)) {
        //                 flatData.push(item.data)
        //             } else if (item.children) {
        //                 processChildren(item.children)
        //             }
        //         }
        //     }

        //     function processChildren1(itArray: any[]) {
        //         for (const item of itArray) {
        //             if (item.data) {
        //                 flatData.push(item.data)
        //             }
        //             if (item.children) {
        //                 processChildren(item.children)
        //             }
        //         }
        //     }
        //     processChildren(itemArray)
        //     return flatData
        // }

        function processParent(delta: any, parentId: any) {
            const fd = meta.current.flatData
            fd[parentId].debit = fd[parentId].debit + delta.debit
            fd[parentId].credit = fd[parentId].credit + delta.credit
            if (fd[parentId]?.parentId) {
                processParent(delta, fd[parentId].parentId)
            }
        }

        function processTree() {
            const d = meta.current.data
            const fd = meta.current.flatData
            const footer = meta.current.footer
            footer.debits = 0
            footer.credits = 0
            processChildren(d)

            function processChildren(children: any) {
                for (const child of children) {
                    if (child.children) {
                        processChildren(child.children)
                    } else {
                        if (['Y', 'S'].includes(child.data.accLeaf)) {
                            const delta = {
                                debit: child.data.debit,
                                credit: child.data.credit,
                            }
                            footer.debits = footer.debits + child.data.debit
                            footer.credits = footer.credits + child.data.credit
                            processParent(delta, child.data.parentId)
                        }
                    }
                }
            }

            // function processParent(delta: any, parentId: any) {
            //     const fd = meta.current.flatData
            //     fd[parentId].debit = fd[parentId].debit + delta.debit
            //     fd[parentId].credit = fd[parentId].credit + delta.credit
            //     if (fd[parentId]?.parentId) {
            //         processParent(delta, fd[parentId].parentId)
            //     }
            // }
        }

        function updateFooter(delta: any) {
            const footer = meta.current.footer
            footer.debits = footer.debits + delta.debit
            footer.credits = footer.credits + delta.credit
        }

        return {
            // calculateFooter,
            flattenData,
            getNotAllowSubmit,
            getDataDiff,
            processParent,
            processTree,
            updateFooter,
        }
    }
}

export { AccountsOpBal }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginBottom: theme.spacing(1),
            overflowX: 'auto',
        },

        header: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(1),
        },

        iconButton: {
            paddingRight: theme.spacing(1),
        },

        expandRefreshSubmit: {
            display: 'flex',
            alignItems: 'center',
            float: 'right',
        },
    })
)

const Span = styled.span`
    float: right;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight: normal;
`
