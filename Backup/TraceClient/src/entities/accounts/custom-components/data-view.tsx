import React, { useState, useEffect, useRef } from 'react'
import upperFirst from 'lodash/capitalize'
import moment from 'moment'
import { Button } from 'primereact/button'
import { graphqlService } from '../../../common-utils/graphql-service'
import queries from '../artifacts/graphql-queries-mutations'
import { manageEntitiesState } from '../../../common-utils/esm'
import DataTable from 'react-data-table-component'
import SortIcon from "@material-ui/icons/ArrowDownward"
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'
import { useIbuki } from '../../../common-utils/ibuki'
import messages from '../../../messages.json'
import customMethods from '../artifacts/custom-methods'
import { utils } from '../utils'
import { utilMethods } from '../../../common-utils/util-methods'
//// @ts-ignore

const { emit, filterOn } = useIbuki()
//generic view to display data in view mode
// to avoid react warning of memory leak only render a component when it is already mounted.
const DataView = () => {
    const { getGloballyFilteredData } = utils()
    const { queryGraphql } = graphqlService()
    const { getCurrentComponent, getFromBag } = manageEntitiesState()
    let [data, setData]: any[] = useState([])
    const origData: any = useRef([])
    const filterText = useRef('')
    const [, setRefresh] = useState({})
    const currentComponent = getCurrentComponent()
    const currentComponentName: string = currentComponent && currentComponent.componentName
    const [pending, setPending] = useState(true)
    const isMounted = useRef(true)
    const { toDecimalFormat, execGenericView} = utilMethods()
    const dateFormat = getFromBag('dateFormat') //'YYYY-MM-DD'

    function dataFormatter(raw: any[]) {
        return raw.map((x: any) => {
            if (x.dc === 'D') {
                x.debit = x.amount
            } else {
                x.credit = x.amount
            }
            const formattedResult = { ...x, tranDate: moment(x.tranDate).format(dateFormat), debit: toDecimalFormat(x.debit), credit: toDecimalFormat(x.credit) }
            return formattedResult
        })
    }

    function setFilteredData() {
        const filteredData = getGloballyFilteredData(origData.current, columns, filterText.current)
        isMounted.current && setData([...filteredData])
    }

    useEffect(() => {
        const subs = filterOn('NO-OF-ROWS').subscribe(d => {
            getData(d.data)
        })
        isMounted.current = true
        async function getData(no = null) {
            const tranTypeId: number = tranTypes[currentComponentName]
            setPending(true)
            const ret = await execGenericView({
                isMultipleRows: true
                , sqlKey: 'get_tranHeaders_details'
                , args: {
                    tranTypeId: tranTypeId
                    , no: (() => {
                        let ret: any = 10
                        if (no === 'null') {
                            ret = null
                        } else if (no) {
                            ret = no
                        }
                        return ret
                    })()
                }
            })
            const rawResults: any = ret && Object.values(ret) //[0]
            if (rawResults) {
                const formattedResults: any[] = dataFormatter(rawResults)
                origData.current = formattedResults
                setFilteredData()
            }
            isMounted.current && setPending(false)
        }
        currentComponentName && getData()
        return (() => {
            subs.unsubscribe()
            isMounted.current = false
        })
    }, [])

    function handleFilterChange(e: any) {
        filterText.current = e.target.value
        setFilteredData()
        setRefresh({})
    }

    return <div style={{ width: '85%', height: '80vh', overflow: 'auto', margin: '1rem', border: '1px solid blue' }}>
        <DataTable
            style={{ width: '99%', margin: '1rem' }}
            title={upperFirst(currentComponentName)}
            columns={columns}

            keyField="id"
            highlightOnHover={true}
            pointerOnHover={true}
            dense={true}
            striped={true}
            progressPending={pending}
            progressComponent={<LinearIndeterminate />}
            actions={[<input type='search' key='1' value={filterText.current} placeholder='Global filter'
                onChange={e => handleFilterChange(e)}></input>, <NoOfRowsSelector key='2'></NoOfRowsSelector>]}
            data={data}

            subHeader={false}
            subHeaderComponent={<button>SubHeader1</button>}
            sortIcon={<SortIcon />}
        ></DataTable>
    </div>

}
export { DataView }

const useStyles: any = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const LinearIndeterminate = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <LinearProgress />
        </div>
    );
}

const columns: any[] = [
    { name: "Id", selector: "tranHeaderId", width: '6rem', sortable: true },
    { name: "Date", selector: "tranDate", width: '8rem', sortable: true },
    { name: "Auto ref no", selector: "autoRefNo", width: '10rem', sortable: true },
    { name: "Account name", selector: "accName", sortable: true },
    { name: "Instrument", selector: "instrNo", width:'6rem' },
    { name: "Debit", selector: "debit", sortable: true, width: '8rem', right: true },
    { name: "Credit", selector: "credit", sortable: true, right: true, width: '8rem', style: { color: 'red' } },
    { name: "Header remarks", selector: "headerRemarks", width:"10rem"},
    {
        name: "Actions", cell: (row: any) => <>
            {/* edit */}
            <Button
                className='p-button-warning'
                icon='pi pi-pencil'
                onClick={e => {
                    const tranHeaderId = row['tranHeaderId']
                    emit('LOAD-MAIN-COMPONENT-EDIT', { headerId: tranHeaderId })
                }}></Button>

            {/* delete */}
            <Button
                style={{ marginLeft: '0.2rem' }}
                className="p-button-danger"
                icon='pi pi-times'
                onClick={async (e: any) => {
                    const { genericUpdateMaster } = utilMethods()
                    const tranHeaderId = row['tranHeaderId']
                    const toDelete = window.confirm(messages['deleteConfirm'])
                    if (toDelete) {
                        const ret = await genericUpdateMaster({
                            deletedIds: [tranHeaderId]
                            , tableName: 'TranH'
                        })
                        emit('SHOW-MESSAGE', {})
                        emit('LOAD-MAIN-JUST-REFRESH', '')
                        // customMethods['deleteTranH']({ id: tranHeaderId })
                    }
                }}></Button></>
    }
]

const tranTypes: any = {
    payments: 2
    , receipts: 3
    , contra: 6
    , journals: 1
}

function NoOfRowsSelector() {
    const [value, setValue] = useState(10)
    return <><span style={{ fontSize: '1rem', marginBottom: '.2rem' }}>Records:</span>
        <select style={{ color: 'blue', cursor: 'pointer' }} value={value} onChange={(e: any) => {
            setValue(e.target.value)
            emit('NO-OF-ROWS', e.target.value)
        }}>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="null">All</option>
        </select></>
}

/*

*/