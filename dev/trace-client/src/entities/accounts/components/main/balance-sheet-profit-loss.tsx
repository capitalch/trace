import { useState, useEffect, useRef } from 'react'
import {
    Typography,
    IconButton,
    Theme,
    useTheme,
    createStyles,
    makeStyles,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import styled from 'styled-components'
import { TreeTable } from 'primereact/treetable'
import { Column } from 'primereact/column'
import { InputSwitch } from 'primereact/inputswitch'
import { graphqlService } from '../../../../common-utils/graphql-service'
import queries from '../../artifacts/graphql-queries-mutations'
import { manageEntitiesState } from '../../../../common-utils/esm'
import { utilMethods } from '../../../../common-utils/util-methods'
import { usingIbuki } from '../../../../common-utils/ibuki'
import accountsMessages from '../../json/accounts-messages.json'
import { useSharedElements } from '../common/shared-elements-hook'
import _ from 'lodash'

function BalanceSheetProfitLoss() {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const meta: any = useRef({
        isMounted: false,
        leftView: [],
        rightView: [],
        leftAggregate: 0.0,
        rightAggregate: 0.0,
        leftTableHeader: '',
        rightTableHeader: '',
        title: '',
        allKeys: [],
        isBs: false,
        isOpBalError: false,
    })

    const {
        _,
        Big,
        emit,
        filterOn,
        getCurrentComponent,
        getFromBag,
        queryGraphql,
        setInBag,
        toDecimalFormat,
    } = useSharedElements()
    const theme = useTheme()

    useEffect(() => {
        meta.current.isMounted = true
        const subs1 = filterOn('VOUCHER-UPDATED-REFRESH-REPORTS').subscribe(
            () => {
                setTimeout(() => {
                    getData(false)
                }, 0)
            }
        )
        getData()
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    function actionTemplate(node: any) {
        let ret = <></>
        if (node.children === null) {
            ret = (
                <IconButton
                    size="small"
                    color="secondary"
                    onClick={(e: any) => emit('SHOW-LEDGER', node.data.id)}>
                    <SearchIcon></SearchIcon>
                </IconButton>
            )
        }
        return ret
    }

    async function getData(isBusyIndicator=true) {
        const currentComponent: any = getCurrentComponent()
        const componentName: string = currentComponent.componentName
        meta.current.isBs = componentName === 'balanceSheet'
        let profitOrLoss = 0.0

        const q = queries['genericQueryBuilder']({
            queryName: 'balanceSheetProfitLoss',
        })
        if (q) {
            let results: any
            try {
                isBusyIndicator && emit('SHOW-LOADING-INDICATOR', true)
                results = await queryGraphql(q)
                emit('SHOW-LOADING-INDICATOR', false)
                const pre = results.data.accounts.balanceSheetProfitLoss
                const dt: any[] = pre.balanceSheetProfitLoss || []
                meta.current.allKeys = pre.allKeys || []
                profitOrLoss = pre.profitOrLoss
                const aggregates: any[] = pre.aggregates || []
                const aggrObject: any = {}
                let total:any = Big(0)
                for (let aggr of aggregates) {
                    const prop: string = aggr['accType']
                    aggrObject[prop] = aggr.amount
                    total = Big(total).plus(Big(aggr.amount))
                }
                total = total.toNumber()
                
                if (total !== 0) {
                    meta.current.isOpBalError = true
                }
                let left: any[] = [],
                    right: any[] = [],
                    leftAggr: number = 0.0,
                    rightAggr: number = 0.0
                if (componentName === 'balanceSheet') {
                    left = dt.filter((x) => x.data.accType === 'L')
                    right = dt.filter((x) => x.data.accType === 'A')
                    leftAggr = -(aggrObject['L'] || 0.0)
                    rightAggr = aggrObject['A'] || 0.0
                    meta.current.leftTableHeader = 'Liabilities'
                    meta.current.rightTableHeader = 'Assets'
                    meta.current.title = 'Balance sheet'
                } else {
                    left = dt.filter((x) => x.data.accType === 'E')
                    right = dt.filter((x) => x.data.accType === 'I')
                    leftAggr = aggrObject['E'] || 0.0
                    rightAggr = -(aggrObject['I'] || 0.0)
                    meta.current.leftTableHeader = 'Expences'
                    meta.current.rightTableHeader = 'Income'
                    meta.current.title = 'Profit & loss'
                }

                if (profitOrLoss >= 0) {
                    leftAggr = leftAggr + profitOrLoss
                    left.push({
                        key: 0,
                        data: {
                            accName: 'Profit for the year',
                            amount: profitOrLoss,
                        },
                    })
                } else {
                    rightAggr = rightAggr - profitOrLoss
                    right.push({
                        key: 0,
                        data: {
                            accName: 'Loss for the year',
                            amount: -profitOrLoss,
                        },
                    })
                }

                meta.current.leftView = left
                meta.current.rightView = right
                meta.current.leftAggregate = leftAggr
                meta.current.rightAggregate = rightAggr
                meta.current.isMounted && setRefresh({})
            } catch (error) {
                emit('SHOW-LOADING-INDICATOR', false)
                console.log(error)
            }
        }
    }

    function amountTemplate(node: any) {
        let ret
        let amt: number = 0.0
        if (node.data.accType === 'L' || node.data.accType === 'I') {
            amt = -node.data.amount
        } else {
            amt = node.data.amount
        }
        const amount = toDecimalFormat(amt)
        if (node.data.parentId) {
            ret = <div>{amount}</div>
        } else {
            ret = (
                <div
                    style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    {amount}
                </div>
            )
        }
        return ret
    }

    return (
        <div className={classes.content}>
            <Typography color="primary" variant="h6" component="div">
                {meta.current.title}
            </Typography>
            <div className="bs-pl">
                <div>
                    <TreeTable
                        scrollable={true}
                        scrollHeight="calc(100vh - 22rem)"
                        style={{
                            minWidth: '24rem',
                            maxWidth: '40rem',
                            display: 'inline-block',
                            marginRight: '1rem',
                        }}
                        value={meta.current.leftView}
                        expandedKeys={
                            meta.current.isBs
                                ? getFromBag('bsLeftExpandedKeys') || {}
                                : getFromBag('plLeftExpandedKeys') || {}
                        }
                        onToggle={(e) => {
                            meta.current.isBs
                                ? setInBag('bsLeftExpandedKeys', e.value)
                                : setInBag('plLeftExpandedKeys', e.value)
                            meta.current.isMounted && setRefresh({})
                        }}
                        header={
                            <HeaderDiv>
                                {meta.current.leftTableHeader}
                                <InputSwitch
                                    checked={
                                        meta.current.isBs
                                            ? getFromBag('bsLeftExpandAll') ||
                                              false
                                            : getFromBag('plLeftExpandAll') ||
                                              false
                                    }
                                    style={{
                                        float: 'right',
                                        marginRight: '0.5rem',
                                    }}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        meta.current.isBs
                                            ? setInBag('bsLeftExpandAll', val)
                                            : setInBag('plLeftExpandAll', val)
                                        if (val) {
                                            const expObject = meta.current.allKeys.reduce(
                                                (prev: any, x: any) => {
                                                    prev[x] = true
                                                    return prev
                                                },
                                                {}
                                            )
                                            meta.current.isBs
                                                ? setInBag(
                                                      'bsLeftExpandedKeys',
                                                      expObject
                                                  )
                                                : setInBag(
                                                      'plLeftExpandedKeys',
                                                      expObject
                                                  )
                                        } else {
                                            meta.current.isBs
                                                ? setInBag(
                                                      'bsLeftExpandedKeys',
                                                      {}
                                                  )
                                                : setInBag(
                                                      'plLeftExpandedKeys',
                                                      {}
                                                  )
                                        }
                                        meta.current.isMounted && setRefresh({})
                                    }}></InputSwitch>
                                <Span>Expand</Span>
                            </HeaderDiv>
                        }>
                        <Column
                            field="accName"
                            header={<TDiv align="left">Account names</TDiv>}
                            footer={<TDiv align="left">Total</TDiv>}
                            expander></Column>
                        <Column
                            field="amount"
                            header={<TDiv align="right">Amount</TDiv>}
                            style={{
                                textAlign: 'right',
                                width: '8rem',
                                fontSize: '0.9rem',
                            }}
                            footer={
                                <TDiv align="right">
                                    {toDecimalFormat(
                                        meta.current.leftAggregate
                                    )}
                                </TDiv>
                            }
                            body={amountTemplate}></Column>
                        <Column
                            body={actionTemplate}
                            style={{ width: '3rem' }}
                        />
                    </TreeTable>
                </div>
                {/* right */}
                <div>
                    <TreeTable
                        scrollable={true}
                        scrollHeight="calc(100vh - 22rem)"
                        style={{
                            minWidth: '24rem',
                            maxWidth: '40rem',
                            display: 'inline-block',
                            marginRight: '1rem',
                        }}
                        value={meta.current.rightView}
                        expandedKeys={
                            meta.current.isBs
                                ? getFromBag('bsRightExpandedKeys') || {}
                                : getFromBag('plRightExpandedKeys') || {}
                        }
                        onToggle={(e) => {
                            meta.current.isBs
                                ? setInBag('bsRightExpandedKeys', e.value)
                                : setInBag('plRightExpandedKeys', e.value)
                            meta.current.isMounted && setRefresh({})
                        }}
                        header={
                            <HeaderDiv>
                                {meta.current.rightTableHeader}
                                <InputSwitch
                                    checked={
                                        meta.current.isBs
                                            ? getFromBag('bsRightExpandAll') ||
                                              false
                                            : getFromBag('plRightExpandAll') ||
                                              false
                                    }
                                    style={{
                                        float: 'right',
                                        marginRight: '0.5rem',
                                    }}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        meta.current.isBs
                                            ? setInBag('bsRightExpandAll', val)
                                            : setInBag('plRightExpandAll', val)
                                        if (val) {
                                            const expObject = meta.current.allKeys.reduce(
                                                (prev: any, x: any) => {
                                                    prev[x] = true
                                                    return prev
                                                },
                                                {}
                                            )
                                            meta.current.isBs
                                                ? setInBag(
                                                      'bsRightExpandedKeys',
                                                      expObject
                                                  )
                                                : setInBag(
                                                      'plRightExpandedKeys',
                                                      expObject
                                                  )
                                        } else {
                                            meta.current.isBs
                                                ? setInBag(
                                                      'bsRightExpandedKeys',
                                                      {}
                                                  )
                                                : setInBag(
                                                      'plRightExpandedKeys',
                                                      {}
                                                  )
                                        }
                                        meta.current.isMounted && setRefresh({})
                                    }}></InputSwitch>
                                <Span>Expand</Span>
                            </HeaderDiv>
                        }>
                        <Column
                            field="accName"
                            header={<TDiv align="left">Account names</TDiv>}
                            footer={<TDiv align="left">Total</TDiv>}
                            expander></Column>
                        <Column
                            field="amount"
                            header={<TDiv align="right">Amount</TDiv>}
                            style={{
                                textAlign: 'right',
                                width: '8rem',
                                fontSize: '0.9rem',
                            }}
                            // className='acc-amount'
                            footer={
                                <TDiv align="right">
                                    {toDecimalFormat(
                                        meta.current.rightAggregate
                                    )}
                                </TDiv>
                            }
                            body={amountTemplate}></Column>
                        <Column
                            body={actionTemplate}
                            style={{ width: '3rem' }}
                        />
                    </TreeTable>
                </div>
            </div>
            <Typography
                style={{ color: theme.palette.error.main }}
                variant="body2"
                component="div">
                {meta.current.isOpBalError
                    ? accountsMessages.debitCreditErrorInOpBal
                    : null}
            </Typography>
        </div>
    )
}

export { BalanceSheetProfitLoss }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .bs-pl': {
                display: 'flex',
                flexWrap: 'wrap',
            },
            // minWidth: '24rem',
            // maxWidth: '40rem',
            // display: 'inline-block',
            // marginRight: '1rem',
            // marginBottom: '1rem',
        },
    })
)

const TDiv: any = styled.div`
    text-align: ${(props: any) => props.align};
`

const HeaderDiv: any = styled.div`
    font-size: 1rem;
    text-decoration: underline;
    /* font-weight: bold; */
`

const Span = styled.span`
    float: right;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight: normal;
`
/*

*/
