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
import SearchIcon from '@material-ui/icons/Search'
import styled from 'styled-components'
import { TreeTable } from 'primereact/treetable'
import { Column } from "primereact/column"
import { InputSwitch } from 'primereact/inputswitch'
import { Button } from 'primereact/button'
import { graphqlService } from '../../../common-utils/graphql-service'
import queries from '../artifacts/graphql-queries-mutations'
import { manageEntitiesState } from '../../../common-utils/esm'
import { utilMethods } from '../../../common-utils/util-methods'
import { utils } from '../utils'
import { useIbuki } from '../../../common-utils/ibuki'

function BalanceSheetProfitLoss() {
    const { queryGraphql } = graphqlService()
    const { getCurrentComponent, getCurrentEntity, getFromBag, setInBag } = manageEntitiesState()
    const [, setRefresh] = useState({})
    const { getUnitHeading } = utils()
    const meta: any = useRef({
        isMounted: false
        , isLoading: false
        , leftView: []
        , rightView: []
        , leftAggregate: 0.00
        , rightAggregate: 0.00
        , leftTableHeader: ''
        , rightTableHeader: ''
        , title: ''
        , allKeys: []
        , isLeftExpandAll: false
        , isRightExpandAll: false
    })
    const classes = useStyles({ meta: meta })
    const { toDecimalFormat } = utilMethods()
    const { emit } = useIbuki()
    useEffect(() => {
        meta.current.isMounted = true
        getData()
        return (() => { meta.current.isMounted = false })
    }, [])

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

    async function getData() {
        const currentComponent: any = getCurrentComponent()
        const componentName: string = currentComponent.componentName
        let profitOrLoss = 0.00
        meta.current.isLoading = true
        meta.current.isMounted && setRefresh({})
        const q = queries['genericQueryBuilder']({
            queryName: 'balanceSheetProfitLoss'
        })
        if (q) {
            let results: any
            try {
                results = await queryGraphql(q)
                const pre = results.data.accounts.balanceSheetProfitLoss
                const dt: any[] = pre.balanceSheetProfitLoss || []
                meta.current.allKeys = pre.allKeys || []
                profitOrLoss = pre.profitOrLoss
                const aggregates: any[] = pre.aggregates || []
                const aggrObject: any = {}
                for (let aggr of aggregates) {
                    const prop: string = aggr['accType']
                    aggrObject[prop] = aggr.amount
                }
                let left: any[] = [], right: any[] = [], leftAggr: number = 0.00, rightAggr: number = 0.00
                if (componentName === 'balanceSheet') {
                    left = dt.filter((x) => x.data.accType === 'L')
                    right = dt.filter((x) => x.data.accType === 'A')
                    leftAggr = -(aggrObject['L'] || 0.00)
                    rightAggr = aggrObject['A'] || 0.00
                    meta.current.leftTableHeader = 'Liabilities'
                    meta.current.rightTableHeader = 'Assets'
                    meta.current.title = 'Balance sheet'
                } else {
                    left = dt.filter((x) => x.data.accType === 'E')
                    right = dt.filter((x) => x.data.accType === 'I')
                    leftAggr = aggrObject['E'] || 0.00
                    rightAggr = -(aggrObject['I'] || 0.00)
                    meta.current.leftTableHeader = 'Expences'
                    meta.current.rightTableHeader = 'Income'
                    meta.current.title = 'Profit & loss'
                }

                if (profitOrLoss >= 0) {
                    leftAggr = leftAggr + profitOrLoss
                    left.push({ key: 0, data: { accName: "Profit for the year", amount: profitOrLoss } })
                } else {
                    rightAggr = rightAggr - profitOrLoss
                    right.push({ key: 0, data: { accName: "Loss for the year", amount: -profitOrLoss } })
                }

                meta.current.leftView = left
                meta.current.rightView = right
                meta.current.leftAggregate = leftAggr
                meta.current.rightAggregate = rightAggr
                meta.current.isLoading = false
                meta.current.isMounted && setRefresh({})
            } catch (error) {
                console.log(error)
            }
        }
    }

    function amountTemplate(node: any) {
        let ret
        let amt: number = 0.00
        if ((node.data.accType === 'L') || (node.data.accType === 'I')) {
            amt = -node.data.amount
        } else {
            amt = node.data.amount
        }
        const amount = toDecimalFormat(amt)
        if (node.data.parentId) {
            ret = <div >{amount}</div>
        } else {
            ret = <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{amount}</div>
        }
        return ret
    }

    return <div>
        {/* left */}
        {/* <TopHeader>{meta.current.topHeader}</TopHeader> */}
        <Typography
            color='primary'
            variant='h6'
            component='div'
        >{meta.current.title}
        </Typography>
        <TreeTable
            // className={classes.treeTable}
            style={{ minWidth: '24rem', maxWidth: '40rem', display: 'inline-block', marginRight: '1rem', marginBottom: '1rem' }}
            value={meta.current.leftView}
            loading={meta.current.isLoading}
            expandedKeys={getFromBag('bsLeftExpandedKeys') || {}}
            onToggle={e => {
                setInBag('bsLeftExpandedKeys', e.value)
                setRefresh({})
            }}
            header={
                <HeaderDiv>
                    {meta.current.leftTableHeader}
                    <InputSwitch
                        checked={meta.current.isLeftExpandAll}
                        style={{ float: 'right', marginRight: '0.5rem' }}
                        onChange={e => {
                            meta.current.isLeftExpandAll = e.target.value
                            if (meta.current.isLeftExpandAll) {
                                const expObject = meta.current.allKeys.reduce((prev: any, x: any) => {
                                    prev[x] = true
                                    return prev
                                }, {})
                                setInBag('bsLeftExpandedKeys', expObject)
                            } else {
                                setInBag('bsLeftExpandedKeys', {})
                            }
                            setRefresh({})
                        }}>
                    </InputSwitch>
                    <Span>Expand</Span>
                </HeaderDiv>
            }>
            <Column
                field="accName"
                header={<TDiv align='left'>Account names</TDiv>}
                footer={<TDiv align='left'>Total</TDiv>}
                expander></Column>
            <Column
                field="amount"
                header={<TDiv align='right'>Amount</TDiv>}
                style={{ textAlign: 'right', width: '8rem', fontSize: '0.9rem' }}
                // className='acc-amount'
                footer={<TDiv align='right'>{toDecimalFormat(meta.current.leftAggregate)}</TDiv>}
                body={amountTemplate}></Column>
            <Column body={actionTemplate} style={{ width: '3rem' }} />
        </TreeTable>
        {/* right */}
        <TreeTable
            // className={classes.treeTable}
            style={{ minWidth: '24rem', maxWidth: '40rem', display: 'inline-block', marginRight: '1rem', marginBottom: '1rem' }}
            // style={{ width: '40rem', display: 'inline-block' }}
            value={meta.current.rightView}
            expandedKeys={getFromBag('bsRightExpandedKeys') || {}}
            onToggle={e => {
                setInBag('bsRightExpandedKeys', e.value)
                setRefresh({})
            }}
            header={<HeaderDiv>
                {meta.current.rightTableHeader}
                <InputSwitch
                    checked={meta.current.isRightExpandAll}
                    style={{ float: 'right', marginRight: '0.5rem' }}
                    onChange={e => {
                        meta.current.isRightExpandAll = e.target.value
                        if (meta.current.isRightExpandAll) {
                            const expObject = meta.current.allKeys.reduce((prev: any, x: any) => {
                                prev[x] = true
                                return prev
                            }, {})
                            setInBag('bsRightExpandedKeys', expObject)
                        } else {
                            setInBag('bsRightExpandedKeys', {})
                        }
                        setRefresh({})
                    }}>
                </InputSwitch>
                <Span>Expand</Span>
            </HeaderDiv>}>
            <Column
                field="accName"
                header={<TDiv align='left'>Account names</TDiv>}
                footer={<TDiv align='left'>Total</TDiv>}
                expander></Column>
            <Column
                field="amount"
                header={<TDiv align='right'>Amount</TDiv>}
                style={{ textAlign: 'right', width: '8rem', fontSize: '0.9rem' }}
                // className='acc-amount'
                footer={<TDiv align='right'>{toDecimalFormat(meta.current.rightAggregate)}</TDiv>}
                body={amountTemplate}></Column>
            <Column body={actionTemplate} style={{ width: '3rem' }} />
        </TreeTable>
    </div>
}

export { BalanceSheetProfitLoss }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        treeTable: {
            minWidth: '24rem',
            maxWidth: '40rem',
            display: 'inline-block',
            marginRight: '1rem',
            marginBottom: '1rem'
        }
        // backdrop: {
        //     zIndex: theme.zIndex.drawer + 1,
        //     color: theme.palette.primary.dark,
        // },

        // content: {
        //     marginBottom: theme.spacing(1),
        //     width: (props: any) => props.meta.current.windowWidth,
        //     overflowX: 'auto',
        // },

        // header: {
        //     display: 'flex',
        //     flexWrap: 'wrap',
        //     justifyContent: 'space-between',
        //     alignItems: 'center',
        //     marginBottom: theme.spacing(1),
        // },

        // expandRefresh: {
        //     display: 'flex',
        //     alignItems: 'center',
        //     float: 'right',
        // },

        // typography: {
        //     verticalAlign: 'middle',
        // },

        // addButton: {
        //     float: 'left',
        //     backgroundColor: theme.palette.lightBlue.main,
        //     color: theme.palette.common.white,
        //     '&:hover': {
        //         backgroundColor: theme.palette.lightBlue.dark,
        //         color: theme.palette.grey[200],
        //     }
        // },

        // editButton: {
        //     float: 'left',
        //     marginLeft: theme.spacing(1),
        // },

        // deleteButton: {
        //     float: 'left',
        //     marginLeft: theme.spacing(1),
        //     backgroundColor: theme.palette.error.light,
        //     color: theme.palette.common.white,
        //     '&:hover': {
        //         backgroundColor: theme.palette.error.dark,
        //         color: theme.palette.grey[200],
        //     }
        // },

        // syncIconButton: {
        //     paddingRight: theme.spacing(2)
        // },

        // dialogPaper: {
        //     width: (props: any) => props.meta.current.dialogConfig.dialogWidth
        // },

        // dialogTitle: {
        //     display: 'flex'
        //     , justifyContent: 'space-between'
        //     , alignItems: 'center'
        //     , paddingBottom: '0px'
        // },
    })
)

const TDiv: any = styled.div`
    text-align: ${(props: any) => props.align}
`

const HeaderDiv: any = styled.div`
    font-size: 1.0rem;
    text-decoration: underline;
    /* font-weight: bold; */
`

const Span = styled.span`
    float: right;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight:normal;
`
/*

*/