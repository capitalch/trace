import React, { useState, useEffect, Suspense, useRef } from 'react'
import moment from 'moment'
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {
    useMediaQuery, Drawer, Box, CssBaseline, AppBar, Toolbar, List, Typography
    , Divider, IconButton, Button, Grid, Paper, TextField, FormControl, Chip, Avatar, Container
} from '@material-ui/core'
// import * as moment from 'moment/moment.js';
import { useIbuki } from '../common-utils/ibuki'
import { getArtifacts } from '../react-form/common/react-form-hook'
import { StyledMain, StyledMainHeading } from './trace-styled-components'
import { manageEntitiesState } from '../common-utils/esm'
import { manageFormsState } from '../react-form/core/fsm'
import { graphqlService } from '../common-utils/graphql-service'
import { AccountsLedgerDialog } from '../entities/accounts/custom-components/accounts-ledger-dialog'
import { utilMethods } from '../common-utils/util-methods'
import { LaunchPad } from '../entities/accounts/launch-pad'

function TraceMain({ open }: any) {
    const { setCurrentComponent, getCurrentEntity, getCurrentComponent
        , setCurrentFormId, getCurrentFormId, getFromBag, setInBag } = manageEntitiesState()
    const { filterOn, emit } = useIbuki()
    const { queryGraphql }: any = graphqlService()
    const entityName = getCurrentEntity()
    const artifacts = getArtifacts(entityName)
    const [, setRefresh] = useState({})
    const { execGenericView } = utilMethods()
    const { setFormData, resetFormErrors } = manageFormsState()
    const meta: any = useRef({
        launchPad: undefined
        , mainHeading: ''
    })
    const classes = useStyles()
    const theme = useTheme()

    useEffect(() => {
        setInBag('traceMain', 'traceMain')
        const subs = filterOn('LOAD-MAIN-COMPONENT-NEW').subscribe((d: any) => {
            if (!getCurrentEntity()) {
                return
            }
            if (d.data) {
                d.data.mode = 'new'
                setCurrentComponent(d.data)
                const voucherComponents = ['payments', 'receipts', 'contra', 'journals', 'sales', 'purchases']
                if (voucherComponents.includes(d.data.componentName)) {
                    setInBag('showNewView', true)
                } else {
                    setInBag('showNewView', false)
                }
                emit('LOAD-SUBHEADER-JUST-REFRESH', '') // to refresh subheader to show new / view button
            } else {
                getCurrentComponent() && (getCurrentComponent().mode = 'new')
            }
            setRefresh({})
        })

        const subs1 = filterOn('LOAD-MAIN-COMPONENT-VIEW').subscribe((d: any) => {
            if (!getCurrentEntity()) {
                return
            }
            getCurrentComponent() && (getCurrentComponent().mode = 'view')
            setRefresh({})
        })

        function getDebitsAndCredits(tranDetails: any[], tranTypeId: number) {
            const debits: any[] = tranDetails.filter((x: any) => x.dc === 'D')
            const credits: any[] = tranDetails.filter((x: any) => x.dc === 'C')
            const logic: any = {
                1: () => {
                    return {
                        debits: debits
                        , credits: credits
                    }
                }
                , 2: () => {
                    return {
                        debits: debits
                        , credits: credits[0]
                    }
                }
                , 3: () => {
                    return {
                        debits: debits[0]
                        , credits: credits
                    }
                }
                , 6: () => {
                    return {
                        debits: debits[0]
                        , credits: credits[0]
                    }
                }
            }
            return logic[tranTypeId]()
        }

        const subs2 = filterOn('LOAD-MAIN-COMPONENT-EDIT').subscribe((d: any) => {
            const currentFormId = getCurrentFormId()
            resetFormErrors(currentFormId)
            let headerId = d.data.headerId
            getCurrentComponent().mode = 'edit'
            if (headerId) { // assuming master details data format
                async function doQuery() {
                    const ret: any = await execGenericView({
                        isMultipleRows: false
                        , args: {
                            id: headerId
                        }
                        , sqlKey: 'getJson_tranHeader_details'
                    })
                    const dateFormat = getFromBag('dateFormat')
                    const jsonResult = ret.jsonResult
                    const tranDetails: any[] = jsonResult.tranDetails
                    const tranHeader: any = jsonResult.tranHeader
                    tranHeader.tranDate = moment(tranHeader.tranDate).format(dateFormat)
                    const tranTypeId = tranHeader.tranTypeId
                    const { debits, credits }: any = getDebitsAndCredits(tranDetails, tranTypeId)
                    setFormData(currentFormId, {
                        header: { ...tranHeader }
                        , credits: JSON.parse(JSON.stringify(credits))
                        , debits: JSON.parse(JSON.stringify(debits))
                    })
                    setRefresh({})
                }
                doQuery()
            }
        })

        const subs3 = filterOn('LOAD-MAIN-JUST-REFRESH').subscribe(d => {
            meta.current.launchPad = LaunchPad
            if (d.data === 'reset') {
                setCurrentComponent({})
                meta.current.mainHeading = ''
            } else if (d.data?.mainHeading) {
                meta.current.mainHeading = d.data.mainHeading
            }
            setRefresh({})
        })

        subs.add(subs1).add(subs2).add(subs3)//.add(subs4)
        return (() => {
            subs.unsubscribe()
        })

    }, [])

    function Comp() {
        let ret = <div></div>
        const finYearObject = getFromBag('finYearObject')
        let allowed = false
        if (getCurrentEntity() === 'authentication') {
            allowed = true
        } else if (getCurrentEntity() === 'accounts') {
            if (finYearObject?.finYearId) {
                allowed = true
            }
        }
        const currentComponent = getCurrentComponent()
        if ((!currentComponent)) {
            return ret
        }
        let currentComponentName = ''
        if (currentComponent.mode === 'view') {
            const viewables: string[] = ['payments', 'receipts', 'contra', 'journals'] // sales and purchases is not yet implemented, 'sales', 'purchases']
            if (viewables.includes(currentComponent.componentName)) {
                currentComponentName = 'dataView'
            }
        } else {
            currentComponentName = currentComponent.componentName
        }
        // if finYearId is not actuated then don't try to refresh component. This is to avoid unnecessary call to server with null finYearId and branchId during initialize (init-code execution) period
        if (currentComponentName && allowed) {
            if (artifacts) {
                if (artifacts['allForms']) {
                    if (artifacts['allForms'][currentComponentName]) {
                        ret = artifacts['allForms'][currentComponentName]()
                        const currentFormId = ret && ret.props && ret.props.formId
                        currentFormId && setCurrentFormId(currentFormId)
                    } else if (artifacts['customComponents'] && artifacts['customComponents'][currentComponentName]) {
                        ret = artifacts['customComponents'][currentComponentName](currentComponent.args)
                    }
                }
            }
        }
        return (ret)
    }

    //launchPad is the launching component of an entity
    return (
        <Container className={clsx(classes.content, {
            [classes.contentShift]: open,
        })}>
            <Typography variant='h6' className={classes.title}>
                {meta.current.mainHeading}
            </Typography>
            <Comp></Comp>
            <AccountsLedgerDialog></AccountsLedgerDialog>
        </Container>
    )
}

export { TraceMain }

const drawerWidth = 260
const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        
        content: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
            marginTop: '112px',
            maxWidth: '100%'
        },

        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },

        title: {
            color: theme.palette.primary.dark,
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        }
    }),
)

/*
<StyledMain>
        <StyledMainHeading>{meta.current.mainHeading}</StyledMainHeading>
        <Suspense fallback={"Loading..."}>
            <Comp></Comp>
        </Suspense>
        <AccountsLedgerDialog></AccountsLedgerDialog>
        {meta.current.launchPad && meta.current.launchPad()}
    </StyledMain>
*/
