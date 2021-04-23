import React, { useState, useEffect, useRef } from 'react'
import {
    Toolbar, Typography, Backdrop
    // , Button
    , Hidden
    , IconButton, Chip,
    Avatar, Box, Container, Paper
    , Dialog
    , DialogTitle
    , DialogActions, DialogContent, Theme, useTheme,
    createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText, Grid
    , TextField, InputAdornment
} from '@material-ui/core'
import SyncIcon from '@material-ui/icons/SyncSharp'
import CircularProgress from '@material-ui/core/CircularProgress'
import RefreshIcon from '@material-ui/icons/Refresh'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'
import { useTraceGlobal } from '../../../common-utils/trace-global'
import styled from 'styled-components'
import { InputText } from 'primereact/inputtext';
import Big from 'big.js'
import queries from '../artifacts/graphql-queries-mutations'
import { graphqlService } from '../../../common-utils/graphql-service'
import { utilMethods } from '../../../common-utils/util-methods'
import { useIbuki } from '../../../common-utils/ibuki'
import { TreeTable } from 'primereact/treetable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch'
import { utils } from '../utils'
import messages from '../../../messages.json'
import { manageEntitiesState } from '../../../common-utils/esm'
// import { getArtifacts } from '../../../react-form/common/react-form-hook'

function TrialBalance() {
    const { emit } = useIbuki()
    const { getUnitHeading } = utils()
    const [, setRefresh] = useState({})
    const { toDecimalFormat } = utilMethods()
    const { getCurrentEntity, getFromBag, setInBag } = manageEntitiesState()
    // const artifacts = getArtifacts(getCurrentEntity())
    const meta: any = useRef({
        data: []
        , isMounted: false
        , windowWidth: ''
        , isLoading: false
        , allKeys: []
        , isExpandAll: false
        , globalFilter: ''
        , footer: {
            opening: Big(0.00)
            , debit: Big(0.00)
            , credit: Big(0.00)
            , closing: Big(0.00)
        }
        , headerConfig: {
            textVariant: 'subtitle1',
            title: 'Trial balance'
        }, dialogConfig: {
            dialogWidth: ''
        }, tableConfig: {
            expanderColumn: '',
        }
    })
    const headerConfig = meta.current.headerConfig
    const dialogConfig = meta.current.dialogConfig
    const tableConfig = meta.current.tableConfig
    const { queryGraphql } = graphqlService()
    const theme: any = useTheme()
    const classes = useStyles({ meta: meta })
    const { traceGlobalSearch, TraceFullWidthSubmitButton } = useTraceMaterialComponents()
    const { getCurrentMediaSize, isMediumSizeUp } = useTraceGlobal()

    const currentMediaSize: string = getCurrentMediaSize()

    // The library Big.js is used to escape the javascript Floating Poing precision errors
    function getFooter(data: any[]) {
        function getSigned(val: any, dc: string) {
            return dc === 'C' ? -val : val
        }
        const footer = data.reduce((prev: any, x: any) => {
            const a: any = {
                opening: Big(prev.opening).add(getSigned(Big(x.data.opening), x.data.opening_dc))
                , debit: Big(prev.debit).add(Big(x.data.debit))
                , credit: Big(prev.credit).add(Big(x.data.credit))
                , closing: Big(prev.closing).add(getSigned(Big(x.data.closing), x.data.closing_dc))
            }
            return a
        }, {
            opening: Big(0)
            , debit: Big(0)
            , credit: Big(0)
            , closing: Big(0)
        })
        return footer
    }

    async function getData() {
        try {
            meta.current.isLoading = true
            meta.current.isMounted && setRefresh({})
            const q = queries['genericQueryBuilder']({
                queryName: 'trialBalance'
            })
            const ret = await queryGraphql(q)
            const pre = ret?.data?.accounts?.trialBalance
            meta.current.data = pre?.trialBal

            meta.current.footer = getFooter(meta.current.data)
            meta.current.allKeys = pre.allKeys
            meta.current.isLoading = false
            meta.current.isMounted && setRefresh({})
        } catch (error) {
            emit('SHOW-MESSAGE', { message: messages['errorInOperation'], severity: 'error', duration: null })
        }
    }

    useEffect(() => {
        meta.current.isMounted = true
        getData()
        return (() => {
            meta.current.isMounted = false
            // setInBag('trialBalance', 'trialBalance')
        })
    }, [])

    if (isMediumSizeUp) {
        dialogConfig.dialogWidth = '360px'
    }
    else {
        dialogConfig.dialogWidth = '290px'
    }

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
        xl: () => mediaLogic['lg']()
    }

    currentMediaSize && mediaLogic[currentMediaSize]()

    function actionTemplate(node: any) {
        let ret = <></>
        if (node.children === null) {
            ret = <IconButton
                size='small'
                color='secondary'
                onClick={(e: any) => emit('SHOW-LEDGER', node.data.id)}>
                <SearchIcon></SearchIcon>
            </IconButton>
        }
        return ret
    }

    interface amountTemplateOptions {
        amt: any
        dc?: string
        isOpeningClosing?: boolean
        accLeaf?: string
    }
    function amountTemplate(options: amountTemplateOptions) {
        let ret, dcFormat, dcColor = 'black'
        if ((options.amt === 0) && (options.isOpeningClosing)) {
            options.dc = 'D'
        }
        let amount = toDecimalFormat(options.amt)
        if (options.dc === 'D') {
            dcFormat = " Dr"
        } else if (options.dc === 'C') {
            dcFormat = " Cr"
            dcColor = 'red'
        }
        const fontColor: string = (options.accLeaf === 'Y' || options.accLeaf === 'S') ? 'black' : 'darkGrey'
        ret = <div style={{
            textAlign: 'right'
            , color: `${fontColor}`
        }}>{amount}<span style={{ color: `${dcColor}` }}>{dcFormat}</span></div>
        return ret
    }


    return (
        <div className={classes.content}>
            <Box className={classes.header}>
                <Typography
                    color='primary'
                    variant={meta.current.headerConfig.textVariant || 'h6'}
                    component='span'
                >{headerConfig.title}</Typography>
                <Box component='span' className={classes.expandRefresh}>
                    <Span style={{ marginTop: '-1px' }}>Expand</Span>
                    <InputSwitch
                        checked={meta.current.isExpandAll}
                        style={{ float: 'right', marginRight: '0.5rem' }}
                        onChange={e => {
                            meta.current.isExpandAll = e.target.value
                            if (meta.current.isExpandAll) {
                                const expObject = meta.current.allKeys.reduce((prev: any, x: any) => {
                                    prev[x] = true
                                    return prev
                                }, {})
                                setInBag('trialBalExpandedKeys', expObject)
                            } else {
                                setInBag('trialBalExpandedKeys', {})
                            }
                            setRefresh({})
                        }}>
                    </InputSwitch>
                    <IconButton
                        // className={classes.syncIconButton}
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
                expandedKeys={getFromBag('trialBalExpandedKeys') || {}}
                globalFilter={meta.current.globalFilter}
                onToggle={e => {
                    setInBag('trialBalExpandedKeys', e.value)
                    setRefresh({})
                }}>
                <Column
                    // style={{ width: '20rem' }}
                    field="accName"
                    expander
                    style={{ width: tableConfig.expanderColumn }}
                    header={<TDiv align='left'>Account names</TDiv>}
                    footer={<TDiv align='left'>Total</TDiv>}
                    body={(node: any) => { return <span>{node.data.accName}</span> }}
                ></Column>
                <Column style={{ width: '10rem' }}
                    field="opening"
                    header={<TDiv align='right'>Opening</TDiv>}
                    footer={<TDiv align='right'>{meta.current.footer.opening >= 0 ?
                        amountTemplate({ amt: meta.current.footer.opening, dc: 'D', isOpeningClosing: true, accLeaf: 'Y' })
                        : amountTemplate({ amt: meta.current.footer.opening, dc: 'C', isOpeningClosing: true, accLeaf: 'Y' })
                    }</TDiv>}
                    body={
                        (node: any) => amountTemplate({
                            amt: node.data.opening
                            , isOpeningClosing: true
                            , dc: node.data.opening_dc
                            , accLeaf: node.data.accLeaf
                        })
                    }
                ></Column>
                <Column style={{ width: '10rem' }}
                    field="debit"
                    header={<TDiv align='right'>Debits</TDiv>}
                    footer={<TDiv align='right'>{amountTemplate({ amt: meta.current.footer.debit, accLeaf: 'Y' })}</TDiv>}
                    body={(node: any) => amountTemplate({ amt: node.data.debit, accLeaf: node.data.accLeaf })}
                ></Column>
                <Column style={{ width: '10rem' }}
                    field="credit"
                    header={<TDiv align='right'>Credits</TDiv>}
                    footer={<TDiv align='right'>{amountTemplate({ amt: meta.current.footer.credit, accLeaf: 'Y' })}</TDiv>}
                    body={(node: any) => amountTemplate({ amt: node.data.credit, accLeaf: node.data.accLeaf })}
                ></Column>
                <Column style={{ width: '10rem' }}
                    field="closing"
                    header={<TDiv align='right'>Closing</TDiv>}
                    footer={<TDiv align='right'>{meta.current.footer.closing >= 0 ?
                        amountTemplate({ amt: meta.current.footer.closing, dc: 'D', isOpeningClosing: true, accLeaf: 'Y' })
                        : amountTemplate({ amt: meta.current.footer.closing, dc: 'C', isOpeningClosing: true, accLeaf: 'Y' })
                    }</TDiv>}
                    body={(node: any) =>
                        amountTemplate({ amt: node.data.closing, dc: node.data.closing_dc, isOpeningClosing: true, accLeaf: node.data.accLeaf })}
                ></Column>
                <Column style={{ width: '5rem' }}
                    field="accType"
                    header={<TDiv align='left'>Type</TDiv>}
                    body={(node: any) => {
                        const logic: any = { A: 'Asset', L: 'Liability', I: 'Income', E: 'Expence' }
                        return <TDiv align='left'>{logic[node.data.accType]}</TDiv>
                    }}
                ></Column>
                <Column body={actionTemplate} style={{ width: '4rem' }} />
            </TreeTable>
            <Backdrop
                className={classes.backdrop}
                open={meta.current.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export { TrialBalance }

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

        expandRefresh: {
            display: 'flex',
            alignItems: 'center',
            float: 'right',
        },

        syncIconButton: {
            // paddingRight: theme.spacing(1)
        }
    })
)

const TDiv: any = styled.div`
    text-align: ${(props: any) => props.align};
    margin: 0px;
    padding: 0px;
    /* position: sticky;
    top: 0; */
`



const Span = styled.span`
    float: right;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight:normal;
`