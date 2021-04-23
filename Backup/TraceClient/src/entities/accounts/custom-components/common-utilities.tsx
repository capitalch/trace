import React, { useEffect, useState, useRef } from 'react'
import {
    Toolbar, Typography
    , Button, Backdrop, IconButton, Chip,
    Avatar, Box, Container, Paper
    , Dialog, DialogTitle
    , DialogActions, DialogContent, Theme, useTheme, createStyles, makeStyles
    , List, ListItem, ListItemAvatar, ListItemText, Grid
} from '@material-ui/core'
import MaterialTable from "material-table"
import { tableIcons } from './material-table-icons'
import SendIcon from '@material-ui/icons/Send'
import CircularProgress from '@material-ui/core/CircularProgress'
import gql from 'graphql-tag'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import InputMask from 'react-input-mask'
import { ProgressSpinner } from 'primereact/progressspinner';
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
import accountsMessages from '../accounts-messages.json'
import { ajaxService } from '../../../common-utils/ajax-service'

function CommonUtilities() {
    const meta: any = useRef({
        isMounted: false
        , isBusy: false
    })

    useEffect(() => {
        meta.current.isMounted = true
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const data = [
        {
            descr: accountsMessages['messTransferClosingBalance']
            , name: 'transferBalance'
            , label: 'Transfer'
        }
    ].map((item: any, index: number) => {
        return {
            index: index + 1
            , ...item
        }
    })
    // meta.current.count = 1
    const theme: any = useTheme()
    const classes = useStyles()

    return (
        // <Grid container>
        //     <Grid item lg={8}>
        <>
            <MaterialTable
                icons={tableIcons}
                title={"Utilities"}
                columns={[
                    { title: 'Index', render: (rowData: any) => rowData.index, width: 20 },
                    { title: 'Description', field: 'descr' },
                    {
                        title: 'Action',
                        render: (rowData: any) =>
                            <Button
                                endIcon={<SendIcon></SendIcon>}
                                variant='contained'
                                color='secondary'
                                onClick={async (e) => {
                                    const { transferClosingBalances } = utils()
                                    meta.current.isBusy = true
                                    setRefresh({})
                                    const ret = await transferClosingBalances()
                                    if (ret?.data?.accounts?.transferClosingBalances) {
                                        emit('SHOW-MESSAGE', '')
                                    }
                                    meta.current.isBusy = false
                                    setRefresh({})
                                }}
                            >{rowData.label}</Button>,
                        width: 20
                    }
                ]}
                data={data}
                options={{
                    paging: false,
                    search: false
                }}
            />
            <Backdrop
                className={classes.backdrop}
                open={meta.current.isBusy}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
        //     </Grid>
        // </Grid>
    )
}

export { CommonUtilities }

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

/*
<ProgressSpinner style={{
            width: '50px'
            , height: '50px'
            , margin: 'auto'
            , top: 0
            , bottom: 0
            , left: 0
            , right: 0

            , position: 'absolute'
            , display: `${meta.current.showSpinner}`
        }}
            strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />

<DataTable value={data} className={classes.table}>
                <Column className={classes.index} header='Index' body={(node: any) => meta.current.count++}>
                </Column>
                <Column className={classes.descr} header='Description' field='descr'></Column>
                <Column header='Action' className={classes.util}
                    body={(node: any) => <Button
                        endIcon={<SendIcon></SendIcon>}
                        variant='contained'
                        color='secondary'
                        onClick={async (e) => {
                            const { transferClosingBalances } = utils()
                            meta.current.showSpinner = 'block'
                            setRefresh({})
                            const ret = await transferClosingBalances()
                            if (ret?.data?.accounts?.transferClosingBalances) {
                                emit('SHOW-MESSAGE', '')
                            }
                            meta.current.showSpinner = 'none'
                            setRefresh({})
                        }}
                    >{node.label}</Button>}>
                </Column>
            </DataTable>
*/