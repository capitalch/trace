import React, { useEffect, useState, useRef } from 'react'
import gql from 'graphql-tag'
import {
    Toolbar, Typography, Grid
    , Button, IconButton, Chip,
    Avatar, Box, Container, Paper
    , Dialog, DialogTitle
    , DialogActions, DialogContent, Theme, useTheme, createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText
} from '@material-ui/core'
import MaterialTable from "material-table"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import InputMask from 'react-input-mask'
import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button'
import { SplitButton } from 'primereact/splitbutton'
import exportIcon from '@material-ui/icons/CallMissedOutgoingSharp'
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
import { ajaxService } from '../../../common-utils/ajax-service'
import { useTraceMaterialComponents } from '../../../common/trace-material-components'
import { tableIcons } from './material-table-icons'

function GenericExports() {
    const meta: any = useRef({
        isMounted: false
        , count: 1
    })
    // const theme: any = useTheme()
    // const classes = useStyles()

    const { getUnitHeading } = utils()
    const { getLoginData, getCurrentEntity, setInBag, getFromBag, setCurrentComponent } = manageEntitiesState()
    const { filterOn, emit } = useIbuki()
    const [, setRefresh] = useState({})
    const { getSqlObjectString, execGenericView, genericUpdateMaster, saveForm } = utilMethods()
    const { queryGraphql, mutateGraphql } = graphqlService()
    const { getDashedEntityName, toDecimalFormat, getDateMaskMap } = utilMethods()
    const { resetAllValidators, clearServerError, resetForm, getFormData, setFormData, showServerError, getValidationFabric } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()

    const { httpPost, httpGet, downloadFile } = ajaxService()

    useEffect(() => {
        meta.current.isMounted = true
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const data = [
        { label: 'Accounts master', name: 'accountsMaster' }
        , { label: 'Payments', name: 'payments' }
        , { label: 'Receipts', name: 'receipts' }
        , { label: 'Contra', name: 'contra' }
        , { label: 'Journals', name: 'journals' }
        , { label: 'All vouchers', name: 'allVouchers' }
        , { label: 'Trial balance', name: 'trialBalance' }
        , { label: 'Final accounts', name: 'finalAccounts' }
    ].map((x: any, index: number) => {
        return {
            index: index + 1, ...x
        }
    })

    function getItems(name: any) {
        return [
            {
                label: 'Json',
                icon: 'pi pi-compass',
                command: async (e: any) => {
                    const dateFormat = getFromBag('dateFormat')
                    await downloadFile({
                        name: name
                        , fileFormat: 'json'
                        , dateFormat: dateFormat
                    })
                }
            },
            {
                label: 'CSV',
                icon: 'pi pi-chart-line',
                command: async (e: any) => {
                    const dateFormat = getFromBag('dateFormat')
                    await downloadFile({
                        name: name
                        , fileFormat: 'csv'
                        , dateFormat: dateFormat
                    })
                }
            },
            {
                label: 'xlsx',
                icon: 'pi pi-file-excel',
                command: async (e: any) => {
                    const dateFormat = getFromBag('dateFormat')
                    await downloadFile({
                        name: name
                        , fileFormat: 'xlsx'
                        , dateFormat: dateFormat
                    })
                }
            },
            {
                label: 'pdf',
                icon: 'pi pi-file-pdf',
                command: async (e: any) => {
                    // const dateFormat = getFromBag('dateFormat')

                    alert('Not yet implemented')
                    // await downloadFile({
                    //     name: name
                    //     , fileFormat: 'pdf'
                    //     , dateFormat: dateFormat
                    // })
                }
            }
        ]
    }

    return <Grid container >
        <Grid item xs={12} sm={10} md={8} lg={6} >
            <MaterialTable
                icons={tableIcons}
                title={"All exports"}
                columns={[
                    { title: 'Index', field: 'index', width:30 },
                    { title: 'Label', field: 'label', width: 20 },
                    {
                        title: 'Exports', render: (rowData: any) =>
                            <SplitButton label="Export" icon="pi pi-download" model={getItems(rowData.name)}></SplitButton>
                    }
                ]}
                data={data}
                options={{
                    paging: false,
                    search: false
                }
                }
            />
        </Grid>
    </Grid>
}

export { GenericExports }

// const useStyles: any = makeStyles((theme: Theme) =>
//     createStyles({
//         table: {
//             width: '100%'
//         },
//         index: {
//             width: '4rem'
//         },
//         label: {
//             width: '10rem'
//             , textAlign: 'left'
//             , fontWeight: 'bold'
//             , color: theme.palette.secondary.dark
//         },
//         exportButton: {
//             textAlign: 'left'
//             , fontWeight: 'bold'
//         }
//     })
// )

