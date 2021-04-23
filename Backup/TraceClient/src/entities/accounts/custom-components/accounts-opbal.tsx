import React, { useState, useEffect, useRef } from 'react'
import hash from 'object-hash'
import {
    Toolbar, Typography, Backdrop
    // , Button
    , Hidden
    , IconButton, Chip,
    Avatar, Box, Container, Paper
    // , Dialog
    , DialogTitle
    , DialogActions, DialogContent, Theme, useTheme,
    createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText, Grid
    , TextField, InputAdornment
} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import SyncIcon from '@material-ui/icons/SyncSharp'
import SaveIcon from '@material-ui/icons/Save'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'
import { useTraceGlobal } from '../../../common-utils/trace-global'
import styled from 'styled-components'
import { TreeTable } from 'primereact/treetable'
import { InputSwitch } from 'primereact/inputswitch'
import NumberFormat from 'react-number-format'
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber'
import { Dialog } from 'primereact/dialog'
import { Column } from "primereact/column"
import { Button } from 'primereact/button'
import { useIbuki } from '../../../common-utils/ibuki'
import { manageFormsState } from '../../../react-form/core/fsm'
import { graphqlService } from '../../../common-utils/graphql-service'
import queries from '../artifacts/graphql-queries-mutations'
import { manageEntitiesState } from '../../../common-utils/esm'
// import ReactForm from '../../../react-form/react-form'
import { componentStore } from '../../../react-form/component-store/html-core'
import { utilMethods } from '../../../common-utils/util-methods'
import messages from '../accounts-messages.json'
import globalMessages from '../../../messages.json'
// import customMethods from '../artifacts/custom-methods'
import { getArtifacts } from '../../../react-form/common/react-form-hook'
import DataTable from 'react-data-table-component'


function AccountsOpBal() {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const meta: any = useRef({
        isMounted: false
        , windowWidth: ''
        , globalFilter: ''
        , footer: {
            debits: 0,
            credits: 0
        }
        , tableConfig: {
            expanderColumn: '',
        }
        , headerConfig: {
            title: 'Accounts opening balances',
            textVariant: 'subtitle1',
        }
        , data: []
        , initialData: []
        , editModeStatus: {}
        , initialDataHash: ''
        , isLoading: false
        , allKeys: []
        , isExpandAll: false
    })

    const classes = useStyles({ meta: meta })
    const theme = useTheme()
    const { getCurrentMediaSize, isMediumSizeUp } = useTraceGlobal()
    const { traceGlobalSearch, TraceFullWidthSubmitButton } = useTraceMaterialComponents()
    const tableConfig = meta.current.tableConfig
    const headerConfig = meta.current.headerConfig
    const { queryGraphql, mutateGraphql } = graphqlService()
    const { toDecimalFormat, extractAmount, saveForm, execGenericView, genericUpdateMaster } = utilMethods()
    const { getCurrentEntity, getFromBag, setInBag } = manageEntitiesState()

    useEffect(() => {
        meta.current.isMounted = true
        getData()
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const mediaLogic: any = {
        xs: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '15rem'
            // tableConfig.buttonsColumn = '12rem'
        },
        sm: () => {
            meta.current.windowWidth = 'calc(100vw - 20px)'
            tableConfig.expanderColumn = '22rem'
            // tableConfig.buttonsColumn = '12rem'
        },
        md: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '25rem'
            // tableConfig.buttonsColumn = '20rem'
        },
        lg: () => {
            meta.current.windowWidth = 'calc(100vw - ( 260px + 65px ))' // 65px is used otherwise a horizontal scrollbar appears
            tableConfig.expanderColumn = '35rem'
            // tableConfig.buttonsColumn = '20rem'
        },
        xl: () => mediaLogic['lg']()
    }

    const currentMediaSize = getCurrentMediaSize()
    currentMediaSize && mediaLogic[currentMediaSize]()

    async function getData() {
        const q = queries['genericQueryBuilder']({ // in shared artifacts
            queryName: 'accountsOpBal'
            , queryType: 'query'
        })

        if (q) {
            meta.current.isLoading = true
            meta.current.isMounted && setRefresh({})
            const results: any = await queryGraphql(q)
            const pre = results.data.accounts.accountsOpBal
            const opBal = pre.opBal
            meta.current.allKeys = pre.allKeys
            utilFunc().calculateFooter(opBal)
            meta.current.data = JSON.parse(JSON.stringify(opBal))
            meta.current.initialData = JSON.parse(JSON.stringify(opBal))
            meta.current.initialDataHash = hash(opBal)
            meta.current.isLoading = false
            meta.current.isMounted && setRefresh({})
        }
    }

    function debitCreditEditor(props: any) {
        const field = props.field
        let ret: any = props.node.data[field]
        if (['Y', 'S'].includes(props.node.data['accLeaf'])) {
            ret = <NumberFormat
                style={{ width: '6rem', textAlign: 'right' }}
                thousandSeparator={true}
                thousandsGroupStyle="thousand"
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                onFocus={e => e.target.select()}
                onValueChange={(e) => {
                    props.node.data[field] = e.floatValue || 0.00
                    utilFunc().calculateFooter(meta.current.data)
                    setRefresh({})
                }}
                value={props.node.data[field]}
            ></NumberFormat>
        }
        return ret
    }

    return <div className={classes.content}>

        <Box className={classes.header}>
            <Typography
                color='primary'
                variant={meta.current.headerConfig.textVariant || 'h6'}
                component='span'
            >{headerConfig.title}</Typography>
            <Box component='span' className={classes.expandRefreshSubmit}>
                <Span style={{ marginTop: '-1px' }}>Expand</Span>
                <InputSwitch
                    checked={meta.current.isExpandAll}
                    style={{ float: 'right', marginRight: '0.2rem' }}
                    onChange={e => {
                        meta.current.isExpandAll = e.target.value
                        if (meta.current.isExpandAll) {
                            const expObject = meta.current.allKeys.reduce((prev: any, x: any) => {
                                prev[x] = true
                                return prev
                            }, {})
                            setInBag('opBalExpandedKeys', expObject)
                        } else {
                            setInBag('opBalExpandedKeys', {})
                        }
                        setRefresh({})
                    }}>
                </InputSwitch>
                
                <IconButton
                    disabled={utilFunc().getNotAllowSubmit()}
                    className={classes.iconButton}
                    size='medium'
                    color='secondary'
                    onClick={(e: any) => {
                        const debits = meta.current.footer.debits
                        const credits = meta.current.footer.credits
                        if (debits === credits) {
                            const diffObj = utilFunc()
                                .getDataDiff(meta.current.initialData, meta.current.data)
                            if (diffObj.length > 0) {
                                const finalData: any = {
                                    data: diffObj
                                }
                                try {
                                    saveForm({
                                        data: finalData
                                        , queryId: 'accountsUpdateOpBal'
                                    })
                                } catch (error) {
                                    emit('SHOW-MESSAGE', { message: globalMessages['errorInOperation'], severity: 'error', duration: null })
                                }
                            }
                        } else {
                            emit('SHOW-MESSAGE', { message: messages['debitCreditNotEqual'], severity: 'error', duration: null })
                        }
                    }}>
                    <SaveIcon></SaveIcon>
                </IconButton>

                <IconButton
                    className={classes.iconButton}
                    size='medium'
                    color='secondary'
                    onClick={(e: any) => getData()}>
                    <SyncIcon></SyncIcon>
                </IconButton>

            </Box>
            {/* </Box> */}
            {traceGlobalSearch({ meta: meta, isMediumSizeUp: isMediumSizeUp })}
        </Box>

        <TreeTable
            value={meta.current.data}
            // loading={meta.current.isLoading}
            expandedKeys={getFromBag('opBalExpandedKeys') || {}}
            onToggle={e => {
                setInBag('opBalExpandedKeys', e.value)
                setRefresh({})
            }}
            globalFilter={meta.current.globalFilter}>
            <Column
                expander
                style={{ width: tableConfig.expanderColumn }}
                field="accName"
                header={
                    <div>
                        <label style={{ float: 'left', fontSize: '0.9rem' }}>Account name</label>
                    </div>
                }>
            </Column>
            <Column
                field="debit"
                editor={debitCreditEditor}
                header={<div style={{ textAlign: 'right' }}>Debit</div>}
                body={(node: any) => {
                    return <div
                        style={{ backgroundColor: `${['Y', 'S'].includes(node.data.accLeaf) ? 'yellow' : 'white'}` }}>
                        {toDecimalFormat(node.data.debit)}
                    </div>
                }}
                footer={<div style={{ textAlign: 'right' }}>{toDecimalFormat(meta.current.footer['debits'])}</div>}
                style={{ width: '8rem', textAlign: 'right' }}
            ></Column>
            <Column
                field="credit"
                editor={debitCreditEditor}
                header={<div style={{ textAlign: 'right' }}>Credit</div>}
                body={(node: any) => {
                    return <div
                        style={{ backgroundColor: `${['Y', 'S'].includes(node.data.accLeaf) ? 'yellow' : 'white'}` }}>
                        {toDecimalFormat(node.data.credit)}
                    </div>
                }}
                footer={<div style={{ textAlign: 'right' }}>{toDecimalFormat(meta.current.footer['credits'])}</div>}
                style={{ width: '8rem', textAlign: 'right' }}
            ></Column>
            <Column
                field="accType"
                header={<div style={{ textAlign: 'left' }}>Type</div>}
                style={{ width: '5rem', color: 'blue', fontWeight: 'bold' }}
                body={(node: any) => {
                    const mType: any = { L: 'Liability', A: 'Asset', E: 'Expence', I: 'Income' }
                    const ret = mType[node.data.accType]
                    return ret
                }}
            ></Column>
            <Column
                field="className"
                header={<div style={{ textAlign: 'left' }}>Level</div>}
                body={(e: any) => {
                    const trace: any = { Y: 'Leaf', N: 'Group', L: 'Ledger', S: 'Subledger' }
                    return trace[e.data.accLeaf]
                }}
                style={{ width: '8rem' }}
            ></Column>
        </TreeTable>

        <Backdrop
            className={classes.backdrop}
            open={meta.current.isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </div>
    function utilFunc() {
        function calculateFooter(itemArray: any[]) {
            let debits = 0, credits = 0
            function processChildren(itArray: any[]) {
                for (const item of itArray) {
                    if (item.data) {
                        debits = debits + item.data.debit
                        credits = credits + item.data.credit
                    }
                    if (item.children) {
                        processChildren(item.children)
                    }
                }
            }
            processChildren(itemArray)
            meta.current.footer = { debits, credits }
        }

        function getNotAllowSubmit() {
            let ret = false
            const dataHash = hash(meta.current.data)
            if (dataHash === meta.current.initialDataHash) {
                ret = true
            }
            return ret
        }

        function getDataDiff(data1: any[], data2: any[]) {
            const diffObj: any[] = []
            const flatData1 = getFlatData(data1)
            const flatData2 = getFlatData(data2)
            const len: number = flatData1.length
            for (let i: number = 0; i < len; i++) {
                if ((flatData2[i].debit !== 0) && (flatData2[i].credit !== 0)) {
                    diffObj.length = 0
                    emit('SHOW-MESSAGE', { message: messages['errorOpBalDebitCreditTogether'], severity: 'error', duration: null })
                    break
                }
                if (hash(flatData1[i]) !== hash(flatData2[i])) {
                    diffObj.push({
                        accMId: flatData2[i].accMId
                        , opId: flatData2[i].opId
                        , debit: flatData2[i].debit
                        , credit: flatData2[i].credit
                    })
                }
            }
            return diffObj
        }

        function getFlatData(itemArray: any[]) {
            let flatData: any[] = []
            function processChildren(itArray: any[]) {
                for (const item of itArray) {
                    if (item.data) {
                        flatData.push(item.data)
                    }
                    if (item.children) {
                        processChildren(item.children)
                    }
                }
            }
            processChildren(itemArray)
            return flatData
        }
        return { calculateFooter, getNotAllowSubmit, getDataDiff }
    }
}

export { AccountsOpBal }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: theme.palette.primary.dark,
        },

        content: {
            marginBottom: theme.spacing(1),
            width: (props: any) => props.meta.current.windowWidth,
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
            paddingRight: theme.spacing(1)
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
    font-weight:normal;
`
const StyledTableHeader = styled.div`
    text-align:left;
    font-size: 1.2rem;
`

const StyledGlobalSearch = styled.div`
    float:right;
    text-align:left;
    margin-left: 0.8rem;
    /* margin-bottom: 0.2rem; */
    margin-top: -0.2rem;
    /* display: inline-block; */
    i {
        margin-right: 0.3rem;
        font-size: 0.8rem;
    }
`