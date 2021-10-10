import { useSharedElements } from '../shared/shared-elements-hook'
import { MaterialTable } from '../../../../imports/regular-imports'
import { useSaleView, useStyles } from './sale-view-hook'
import {
    Box,
    Icon,
    NativeSelect,
    Typography,
    Button,
} from '../../../../imports/gui-imports'
import {} from '../../../../imports/icons-import'
function SaleView({ arbitraryData, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const { fetchData, getActionsList, getColumnsArray, meta } = useSaleView(
        arbitraryData,
        drillDownEditAttributes
    )

    const {
        emit,
        getFromBag,
        setInBag,
        LedgerSubledgerCascade,
        tableIcons,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            {/* <Button onClick={()=>{
                loadSaleOnId(9779, true)
                // emit('SALE-VIEW-HOOK-GET-SALE-ON-ID', 9779)
            }}>Load</Button> */}
            <MaterialTable
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
                    // selection: true,
                }}
                components={{
                    Action: (props: any) => {
                        // If it is edit or delete retain the functionality defined in action
                        let ret: any = (
                            <Button
                                size="small"
                                onClick={(event: any) =>
                                    props.action.onClick(event, props.data)
                                }>
                                <Icon>{props.action.icon()}</Icon>
                            </Button>
                        )
                        if (props.action.name === 'select') {
                            const label = arbitraryData.isSales
                                ? 'salesTran'
                                : 'salesRetTran'
                            ret = (
                                <Box className="select-last" component="span">
                                    <Typography
                                        variant="caption"
                                        component="span">
                                        Last
                                    </Typography>
                                    <NativeSelect
                                        value={
                                            getFromBag(label) ?? meta.current.no // if undefined or null then 10
                                        }
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
                                    onChange={fetchData}
                                    rowData={meta.current}
                                />
                            )
                        }
                        return ret
                    },
                }}
            />
        </div>
    )
}

export { SaleView }
