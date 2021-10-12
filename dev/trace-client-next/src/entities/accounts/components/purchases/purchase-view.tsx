import { useSharedElements } from '../common/shared-elements-hook'
import { useContext } from '../../../../imports/regular-imports'
import { usePurchaseView, useStyles } from './purchase-view-hook'
import { PurchasesContext } from './purchases-provider'

function PurchaseView({ purchaseType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const arbitraryData: any = useContext(PurchasesContext)
    const {
        meta,
        getXXGridParams,
    } = usePurchaseView(arbitraryData, purchaseType, drillDownEditAttributes)

    const {
        // getFromBag,
        // LedgerSubledgerCascade,
        // setInBag,
        // tableIcons,
        XXGrid
    } = useSharedElements()

    const { columns, queryArgs, queryId, specialColumns, summaryColNames } = getXXGridParams()

    return (
        <div className={classes.content}>
            <XXGrid
                columns={columns}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                title=''
                viewLimit='100'
            />
        </div>
    )
}

export { PurchaseView }

{/* <MaterialTable
    style={{ zIndex: 0 }}
    icons={tableIcons}
    columns={getColumnsArray()}
    data={meta.current.data}
    title={meta.current.title}
    actions={getActionsList()}
    options={{
        maxBodyHeight: 'calc(100vh - 15rem)',
        headerStyle: {
            backgroundColor: '#01579b',
            color: '#FFF',
        },

        actionsColumnIndex: 1,
        paging: false,
    }}
    components={{
        Action: (props: any) => {
            // If it is edit or delete retain the functionality defined in action
            let ret: any = (
                <IconButton
                    onClick={(event: any) =>
                        props.action.onClick(event, props.data)
                    }>
                    <Icon>{props.action.icon()}</Icon>
                </IconButton>
            )
            if (props.action.name === 'select') {
                const label = purchaseType === 'pur' ? 'purchaseTran' : 'purchaseretTran'
                ret = (
                    <Box className="select-last" component="span">
                        <Typography
                            variant="caption"
                            component="span">
                            Last
                        </Typography>
                        <NativeSelect
                            value={getFromBag(label) ?? meta.current.no} // if undefined or null then 10
                            style={{
                                width: '3.3rem',
                                marginLeft: '0.1rem',
                            }}
                            onChange={(e) => {
                                setInBag(label, e.target.value)
                                fetchData()
                            }}>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                            <option value={''}>All</option>
                        </NativeSelect>
                    </Box>
                )
            } else if (props.action.name === 'selectParty') {
                ret = (
                    <LedgerSubledgerCascade
                        allAccounts={meta.current.allAccounts}
                        ledgerAccounts={meta.current.ledgerAccounts}
                        onSelectionChange={fetchData}
                        rowData={meta.current}
                    />
                )
            }
            return ret
        },
    }}
/> */}