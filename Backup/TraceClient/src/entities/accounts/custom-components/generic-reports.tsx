import React, { useEffect, useState, useRef } from 'react'
import MaterialTable from "material-table"
import {
    Toolbar, Typography
    , Button, IconButton, Chip,
    Avatar, Box, Container, Paper
    , Dialog, DialogTitle
    , DialogActions, DialogContent, Theme, useTheme, createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText, Grid
} from '@material-ui/core'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import InputMask from 'react-input-mask'
import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
// import { Dialog } from 'primereact/dialog'
import styled from 'styled-components'
import moment from 'moment'
import { useIbuki } from '../../../common-utils/ibuki'
import { manageFormsState } from '../../../react-form/core/fsm'
import { getArtifacts } from '../../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../../common-utils/esm'
import ReactForm from '../../../react-form/react-form'
import { componentStore } from '../../../react-form/component-store/html-core'
import { graphqlService } from '../../../common-utils/graphql-service'
// import queries from '../entities/accounts/artifacts/graphql-queries-mutations'
import { utilMethods } from '../../../common-utils/util-methods'
import queries from '../artifacts/graphql-queries-mutations'
// import { DialogContent } from '@material-ui/core'
import { initialize } from '../../../react-form/common/react-form-hook'
import { utils } from '../utils'
import { initCode } from '../init-code'
import messages from '../../../messages.json'
import accountMessages from '../accounts-messages.json'
import { tableIcons } from './material-table-icons'

function GenericReports({ loadReport }: any) {
    const meta: any = useRef({
        isMounted: false
        , isLoading: false
        , title: ''
        , reportData: []
        , globalFilter: null
        , dateFilterValue: ''
    })
    let dataTableRef: any = useRef(null)
    const theme: any = useTheme()
    const classes = useStyles()
    const { getUnitHeading } = utils()
    const { getLoginData, getCurrentEntity, setInBag, getFromBag, setCurrentComponent } = manageEntitiesState()
    const { filterOn, emit } = useIbuki()
    const [, setRefresh] = useState({})
    const { getSqlObjectString, execGenericView, genericUpdateMaster, saveForm } = utilMethods()
    const { queryGraphql, mutateGraphql } = graphqlService()
    const { getDashedEntityName, toDecimalFormat, getDateMaskMap } = utilMethods()
    const { resetAllValidators, clearServerError, resetForm, getFormData, setFormData, showServerError, getValidationFabric } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()

    const dateFormat = getFromBag('dateFormat')
    const entityName = getCurrentEntity()
    const maskMap: any = getDateMaskMap()
    useEffect(() => {
        meta.current.isMounted = true
        const selectedLogic = selectLogic()[loadReport]()
        selectedLogic.fetch()
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    function selectLogic(): any {
        const logic = {
            allTransactions: allTransactionReport
        }
        return logic
    }

    function allTransactionReport() {

        // const dateFilter = <InputMask
        //     style={{ width: '6rem', fontSize: '0.8rem' }}
        //     mask={maskMap[dateFormat]}
        //     placeholder={dateFormat}
        //     value={meta.current.dateFilterValue}
        //     onChange={e => {
        //         meta.current.dateFilterValue = e.target.value
        //         // meta.current.dt.filter(e.target.value, 'tranDate', 'equals')
        //         dataTableRef.current.filter(e.target.value, 'tranDate', 'equals')
        //         setRefresh({})
        //     }}
        // ></InputMask>

        async function fetch() {
            meta.current.title = 'All transactions report'
            meta.current.isLoading = true
            setRefresh({})
            const ret = await execGenericView({
                isMultipleRows: true
                , sqlKey: 'get_allTransactions'
                , args: { dateFormat: dateFormat }
                , entityName: entityName
            })
            meta.current.isLoading = false
            ret && (meta.current.reportData = ret)
            setRefresh({})
        }

        function display() {
            const columnsArray: any[] = [
                { title: "Index", field: "index", width: 20 },
                { title: "Id", field: "id", sorting: true, width: 20 },
                { title: "Date", field: "tranDate", sorting: true },
                { title: "Account", field: "accName" },
                { title: "Debit", field: "debit", type: "numeric", render: (rowData: any) => toDecimalFormat(rowData.debit) },
                { title: "Credit", field: "credit", type: "numeric", render: (rowData: any) => toDecimalFormat(rowData.credit) },
                { title: "Auto ref no", field: "autoRefNo" },
                { title: "Instr no", field: "instrNo" },
                { title: "Ref no", field: "lineRefNo" },
                { title: "Remarks", field: "remarks" },
            ]
            return (
                // <div style={{ maxWidth: '100%' }}>
                <MaterialTable
                    isLoading={meta.current.isLoading}
                    icons={tableIcons}
                    columns={columnsArray}
                    data={meta.current.reportData}
                    title="All transactions"
                    options={{
                        paging: true,
                        pageSize: 15,
                        pageSizeOptions: [15, 20, 30, 50],
                        search: true,
                        draggable: true,
                        // to make fixed header
                        headerStyle: { position: 'sticky', top: 0 },
                        maxBodyHeight: '650px'
                    }}
                />
                // </div>
            )
        }


        return { fetch, display }
    }

    return selectLogic()[loadReport]().display()

}

export { GenericReports }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        test: {
            margin: '0px'
        }
    })
)

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

// const refreshButtonStyle = {
//     float: "right",
//     margin: '0px',
//     padding: '0px',
//     marginTop: '-0.2rem',
//     marginRight: '0.5rem'
// }

const StyledTableHeader = styled.div`
    text-align:left;
    font-size: 1.1rem;
`

const rightAligned4Style = {
    textAlign: 'right'
    , width: '4.5rem'
    , overflow: 'hidden'
}
const leftAligned5Style = {
    textAlign: 'left'
    , width: '5rem'
    , overflow: 'hidden'
}
const leftAligned6Style = {
    textAlign: 'left'
    , width: '6rem'
    , overflow: 'hidden'
}

const leftAligned7Style = {
    textAlign: 'left'
    , width: '8rem'
    , overflow: 'hidden'
}

const leftAligned9Style = {
    textAlign: 'left'
    , width: '9rem'
    , overflow: 'hidden'
}

const leftAligned10Style = {
    textAlign: 'left'
    , width: '10rem'
    , overflow: 'hidden'
}

const rightAligned9Style = {
    textAlign: 'right',
    width: '9rem'
}

const leftAlignedStyle = {
    textAlign: 'left'
    , overflow: 'hidden'
}

const rightAlignedStyle = {
    textAlign: 'right'
}

/*
function display1() {
            return <DataTable
                // ref={(el) => meta.current.dt = el}
                ref={dataTableRef}
                value={meta.current.reportData}
                paginator={true}
                rows={20}
                loading={meta.current.isLoading}
                style={{ width: '95%', fontSize: '.75rem' }}
                header={
                    <StyledTableHeader>{meta.current.title}
                        <StyledGlobalSearch>
                            <i className="pi pi-search" ></i>
                            <InputText
                                type="search"
                                placeholder="Global search"
                                size={50}
                                onInput={(e: any) => {
                                    meta.current.globalFilter = e.target.value
                                    setRefresh({})
                                }}
                            ></InputText>
                        </StyledGlobalSearch>

                        <Button icon="pi pi-refresh"
                            style={{
                                float: 'right',
                                margin: '0px',
                                padding: '0px',
                                marginTop: '-0.2rem',
                                marginRight: '0.5rem'
                            }}
                            label="Refresh"
                            onClick={(e: any) => fetch()}
                        ></Button>
                        <Button
                            style={{
                                float: 'right',
                                // margin: '0px',
                                // padding: '0px',
                                marginTop: '-0.2rem',
                                marginRight: '0.5rem'
                            }}
                            type="button"
                            icon="pi pi-external-link"
                            iconPos="left"
                            label="CSV"
                            onClick={() =>
                                dataTableRef.current.exportCSV()
                            }></Button>
                    </StyledTableHeader>}
                globalFilter={meta.current.globalFilter}
                emptyMessage="No records found">
                <Column style={rightAligned4Style} header="Index" field="index"></Column>
                <Column style={leftAligned5Style} field='id' header="Id" filter={true} ></Column>
                <Column field="tranDate" style={leftAligned7Style} header="Date" filterMatchMode="equals"
                    filter={true} filterElement={dateFilter}></Column>
                <Column style={leftAligned10Style} field="autoRefNo" header="Auto ref no" filter={true} filterMatchMode="contains"></Column>
                <Column style={leftAlignedStyle} field="accName" header="Account name" filter={true} filterMatchMode="contains"></Column>
                <Column field="debit" style={rightAligned9Style} header="Debit" body={(node: any) => toDecimalFormat(node.debit)}></Column>
                <Column field="credit" style={rightAligned9Style} header="Credit" body={(node: any) => toDecimalFormat(node.credit)}></Column>
                <Column style={leftAligned9Style} field="instrNo" header="Instrument no" filter={true} filterMatchMode="contains"></Column>
                <Column style={leftAligned9Style} field="lineRefNo" header="Ref no" filter={true} filterMatchMode="contains"></Column>
                <Column style={leftAligned9Style} field="remarks" header="Remarks" filter={true} filterMatchMode="contains"></Column>
            </DataTable>
        }
*/