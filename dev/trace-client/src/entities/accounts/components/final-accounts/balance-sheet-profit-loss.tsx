import { Big, InputSwitch, PrimeColumn, TreeTable, useState, useEffect, useRef } from '../../../../imports/regular-imports'
import {
    Typography,
    IconButton,
    Theme,
    useTheme,
    createStyles,
    makeStyles,
    Box,
} from '../../../../imports/gui-imports'
import { Search } from '../../../../imports/icons-import'
import styled from 'styled-components'
import { queries, useTraceGlobal, useTraceMaterialComponents } from '../../../../imports/trace-imports'
import accountsMessages from '../../json/accounts-messages.json'
import { useSharedElements } from '../common/shared-elements-hook'

function BalanceSheetProfitLoss() {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const meta: any = useRef({
        globalFilter: '',
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

        isAllBranches: false
    })

    const {
        emit,
        filterOn,
        getCurrentComponent,
        getFromBag,
        queryGraphql,
        setInBag,
        toDecimalFormat,
    } = useSharedElements()
    const theme: Theme = useTheme()
    const { traceGlobalSearch } = useTraceMaterialComponents()
    const { isMediumSizeUp } =
        useTraceGlobal()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs1 = filterOn('TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE').subscribe(
            () => {
                setTimeout(() => {
                    getData(false)
                }, 0)
            }
        )
        getData()
        return () => {
            curr.isMounted = false
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
                    <Search></Search>
                </IconButton>
            )
        }
        return ret
    }

    async function getData(isBusyIndicator = true) {
        const branchObject: any = getFromBag('branchObject')
        const currentComponent: any = getCurrentComponent()
        const componentName: string = currentComponent.componentName
        meta.current.isBs = componentName === 'balanceSheet'
        let profitOrLoss = 0.0
        const args = encodeURIComponent(JSON.stringify({
            branchId: meta.current.isAllBranches ? null : branchObject.branchId
        }))
        const q = queries['genericQueryBuilder']({
            queryName: 'balanceSheetProfitLoss',
            args: args
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
                let total: any = Big(0)
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
            <Box display='flex' justifyContent='space-between' paddingBottom={theme.spacing(2)}>
                <Typography color="primary" variant="h6" component="div">
                    {meta.current.title}
                </Typography>
                <Span style={{ display: 'flex' }}>
                    <Span>This branch</Span>
                    <InputSwitch
                        checked={meta.current.isAllBranches}
                        onChange={(e: any) => {
                            meta.current.isAllBranches = e.target.value
                            getData()
                            setRefresh({})
                        }}></InputSwitch>
                    <Span style={{ marginLeft: theme.spacing(2) }}>All branches</Span>
                </Span>
                {traceGlobalSearch({
                    meta: meta,
                    isMediumSizeUp: isMediumSizeUp,
                })}
            </Box>
            <div className="bs-pl">
                {/* <div> */}
                <TreeTable
                    scrollable={true}
                    scrollHeight="calc(100vh - 22rem)"
                    style={{
                        minWidth: '24rem',
                        width: '47%',
                        // maxWidth: '40rem',
                        display: 'inline-block',
                        marginRight: '1rem',
                    }}
                    value={meta.current.leftView}
                    expandedKeys={
                        meta.current.isBs
                            ? getFromBag('bsLeftExpandedKeys') || {}
                            : getFromBag('plLeftExpandedKeys') || {}
                    }
                    onToggle={(e: any) => {
                        meta.current.isBs
                            ? setInBag('bsLeftExpandedKeys', e.value)
                            : setInBag('plLeftExpandedKeys', e.value)
                        meta.current.isMounted && setRefresh({})
                    }}
                    globalFilter={meta.current.globalFilter}
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
                                onChange={(e: any) => {
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
                    <PrimeColumn
                        columnKey='0'
                        field="accName"
                        header={<TDiv align="left">Account names</TDiv>}
                        footer={<TDiv align="left">Total</TDiv>}
                        expander></PrimeColumn>
                    <PrimeColumn
                        columnKey='1'
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
                        body={amountTemplate}></PrimeColumn>
                    <PrimeColumn
                        columnKey='2'
                        body={actionTemplate}
                        style={{ width: '3rem' }}
                    />
                </TreeTable>
                {/* </div> */}

                {/* right */}
                {/* <div> */}
                <TreeTable
                    scrollable={true}
                    scrollHeight="calc(100vh - 22rem)"
                    style={{
                        minWidth: '24rem',
                        width: '47%',
                        // maxWidth: '40rem',
                        display: 'inline-block',
                        marginRight: '1rem',
                    }}
                    value={meta.current.rightView}
                    globalFilter={meta.current.globalFilter}
                    expandedKeys={
                        meta.current.isBs
                            ? getFromBag('bsRightExpandedKeys') || {}
                            : getFromBag('plRightExpandedKeys') || {}
                    }
                    onToggle={(e: any) => {
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
                                onChange={(e: any) => {
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
                    <PrimeColumn
                        field="accName"
                        header={<TDiv align="left">Account names</TDiv>}
                        footer={<TDiv align="left">Total</TDiv>}
                        expander></PrimeColumn>
                    <PrimeColumn
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
                                    meta.current.rightAggregate
                                )}
                            </TDiv>
                        }
                        body={amountTemplate}></PrimeColumn>
                    <PrimeColumn
                        body={actionTemplate}
                        style={{ width: '3rem' }}
                    />
                </TreeTable>
                {/* </div> */}
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
                justifyContent: 'space-between'
            },
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
