import React, { useEffect, useState, useRef } from 'react'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'
import {
    useMediaQuery, Drawer, Box, CssBaseline, AppBar, Toolbar, List, Typography
    , Divider, IconButton, Backdrop
    , Button, CircularProgress
    , Grid, Paper, TextField, FormControl, Chip, Avatar, Container
} from '@material-ui/core'
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import SyncIcon from '@material-ui/icons/SyncSharp'
import MinusIcon from '@material-ui/icons/RemoveCircleOutline'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import moment from 'moment'
// import { Button } from 'primereact/button'
// import { Breakpoint } from 'react-socks'
// import { Dropdown } from 'primereact/dropdown'
// import { Dialog } from 'primereact/dialog'
import styled from 'styled-components'

import { StyledSubHeader } from './trace-styled-components'
import { useIbuki } from '../common-utils/ibuki'
import { manageFormsState } from '../react-form/core/fsm'
import { manageEntitiesState } from '../common-utils/esm'
import { graphqlService } from '../common-utils/graphql-service'
import { utilMethods } from '../common-utils/util-methods'
import { initCode } from '../entities/accounts/init-code'
import { utils } from '../entities/accounts/utils'
import { useTraceGlobal } from '../common-utils/trace-global'

// Subheader displays controls based on entity. For accounts entity it will be different than payroll entity
function TraceSubHeader() {
    const meta: any = useRef({
        showDialog: false
        , isMounted: true
        , topMenuItem: {}
        , bu: []
        , finYears: []
        , branches: []
        , value: ''
        , isLoading: false
        // , statusColor: ''
        // , statusMessage: ''
        , dialogConfig: {
            title: ""
            , buId: null
            , fyId: null
            , branchId: 1
            , formId: 'selectionCriteria'
        }
    })
    // let [topMenuItem, setTopMenuItem]: any = useState({})    
    const { getCurrentEntity, getFromBag, setInBag } = manageEntitiesState()
    const { filterOn, emit } = useIbuki()
    const [, setRefresh] = useState({})
    // const { queryGraphql } = graphqlService()
    const { getUnitHeading } = utils()
    const { execGenericView } = utilMethods()
    // const { resetAllValidators, resetForm, getFormData } = manageFormsState()
    const dateFormat = getFromBag('dateFormat')
    const { getCurrentMediaSize } = useTraceGlobal()
    const theme = useTheme()
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        const subs = filterOn('TOP-MENU-ITEM-CLICKED').subscribe((d: any) => {
            meta.current.topMenuItem = d.data
            meta.current.isMounted && setRefresh({})
        })
        const subs1 = filterOn('LOAD-SUBHEADER-JUST-REFRESH').subscribe(d => {
            meta.current.isMounted && setRefresh({})
        })
        const subs2 = filterOn('SHOW-SUBHEADER-BUSY').subscribe(d => {
            meta.current.isLoading = d.data
            meta.current.isMounted && setRefresh({})
        })
        subs.add(subs1).add(subs2)
        return (() => {
            subs.unsubscribe()
            meta.current.isMounted = false
        })
    }, [])

    // function resetStatus() {
    //     meta.current.statusColor = 'red'
    //     meta.current.statusMessage = '... Initializing'
    // }

    const displayLogic: any = {
        accounts: () => {
            const { execDataCache } = initCode()
            // const showNewView = getFromBag('showNewView')
            // const newViewVisible: string = showNewView ? 'visible' : 'hidden'

            const buCode = getFromBag('buCode')
            const finYearObject = getFromBag('finYearObject') || undefined

            const branchObject = getFromBag('branchObject')  // default is HEAD
            const currentMediaSize: string = getCurrentMediaSize()
            const exhibitLogic: any = {
                xs: () => {
                    return {
                        bu: buCode || 'Select'
                        , fy: finYearObject?.finYearId || 'Select'
                        , br: branchObject?.branchCode || 'Select'
                        , maxWidth: '22%'
                        , fyMaxWidth: '22%'
                    }
                }
                , sm: () => {
                    return {
                        bu: buCode || 'Select'
                        , fy: finYearObject?.finYearId || 'Select'
                        , br: branchObject?.branchName || 'Select'
                        , maxWidth: '22%'
                        , fyMaxWidth: '22%'
                        , refreshCache: true
                    }
                }
                , md: () => {
                    const finYearRange = String(finYearObject?.finYearId || '').concat(' ( ', finYearObject?.startDate || '', ' - ', finYearObject?.endDate || '', ' )')
                    return {
                        bu: buCode || 'Select business unit'
                        , fy: finYearRange || 'Select fin year'
                        , br: branchObject?.branchName || 'Select branch'
                        , maxWidth: '12rem'
                        , fyMaxWidth: '16rem'
                        , refreshCache: true
                    }
                }
                , lg: () => {
                    return exhibitLogic['md']()
                }
                , xl: () => {
                    return exhibitLogic['md']()
                }
            }

            return (
                <Box component='div' className={classes.containerBox}>
                    {/* business unit */}
                    <Chip
                        style={{ maxWidth: exhibitLogic[currentMediaSize || 'md']().maxWidth }}
                        size='medium'
                        className={classes.chipSelect}
                        clickable={true}
                        color='secondary'
                        avatar={<Avatar>BU</Avatar>}
                        label={exhibitLogic[currentMediaSize || 'md']().bu}
                        onClick={() => {
                            emit('LOAD-MAIN-COMPONENT-NEW', {
                                componentName: 'genericDialoges'
                                , args: {
                                    loadDialog: 'selectBu'
                                }
                                , isCustomComponent: true
                            })
                            meta.current.isMounted && setRefresh({})
                        }}
                    ></Chip>

                    {/* financial year */}
                    <Box component='span'>
                        <IconButton style={{ paddingRight: '0.5rem' }}
                            size='medium'
                            onClick={e => {
                                utilFunc().changeFinYear(1)
                            }}>
                            <AddIcon></AddIcon>
                        </IconButton>
                        <Chip
                            size='medium'
                            className={classes.chipSelect}
                            style={{ maxWidth: exhibitLogic[currentMediaSize || 'md']().fyMaxWidth }}
                            clickable={true}
                            label={exhibitLogic[currentMediaSize || 'md']().fy}
                            color='secondary'
                            avatar={<Avatar>FY</Avatar>}
                            onClick={e => {
                                emit('LOAD-MAIN-COMPONENT-NEW', {
                                    componentName: 'genericDialoges'
                                    , args: {
                                        loadDialog: 'selectFinYear'
                                    }
                                })
                                meta.current.isMounted && setRefresh({})
                            }}
                        ></Chip>
                        <IconButton style={{ paddingLeft: '0.5rem' }}
                            size='medium'
                            onClick={e => {
                                utilFunc().changeFinYear(-1)
                            }}>
                            <MinusIcon></MinusIcon>
                        </IconButton>
                    </Box>

                    {/* branch */}
                    <Chip
                        size='medium'
                        className={classes.chipSelect}
                        style={{ maxWidth: exhibitLogic[currentMediaSize || 'md']().maxWidth }}
                        clickable={true}
                        avatar={<Avatar>BR</Avatar>}
                        label={exhibitLogic[currentMediaSize || 'md']().br}
                        color='secondary'
                        onClick={e => {
                            emit('LOAD-MAIN-COMPONENT-NEW', {
                                componentName: 'genericDialoges'
                                , args: {
                                    loadDialog: 'selectBranch'
                                }
                            })
                            meta.current.isMounted && setRefresh({})
                        }}
                    ></Chip>

                    {/* Refresh cache */}
                    {exhibitLogic[currentMediaSize || 'md']().refreshCache &&
                        <IconButton
                            size='medium'
                            color='inherit'
                            onClick={async (e) => {
                                meta.current.isLoading = true
                                setRefresh({})
                                await execDataCache()
                                meta.current.isLoading = false
                                setRefresh({})
                            }}>
                            <SyncIcon></SyncIcon>
                        </IconButton>
                    }

                    {/* busy spinner */}
                    {meta.current.isLoading && <FontAwesomeIcon style={{ float: 'right', marginTop: theme.spacing(2) }} icon={faSpinner} spin />}
                    
                    {/* Backdrop */}
                    <Backdrop
                        className={classes.backdrop}
                        open={meta.current.isLoading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Box>
            )
        }
    }

    function Comp() {
        let ret = <></>
        const pre = displayLogic[meta.current.topMenuItem.name]
        if (pre) {
            ret = pre()
        }
        return ret
    }

    return (
        <Toolbar className={classes.toolbarSubHeader}>
            <Comp></Comp>
        </Toolbar>
    )

    function utilFunc() {
        async function changeFinYear(change: number) {
            const entityName = getCurrentEntity()
            const finYearObject = getFromBag('finYearObject')
            const finYearId = finYearObject?.finYearId
            if (finYearId) {
                const prevFinYearId = finYearId + change
                const ret = await execGenericView({
                    isMultipleRows: false
                    , sqlKey: 'get_finYearDates'
                    , args: { finYearId: prevFinYearId }
                    , entityName: entityName
                })
                const startDate = ret?.startDate
                const endDate = ret?.endDate
                if (startDate && endDate) {
                    finYearObject.finYearId = prevFinYearId
                    finYearObject.startDate = moment(startDate).format(dateFormat)
                    finYearObject.endDate = moment(endDate).format(dateFormat)
                    setInBag('finYearObject', finYearObject)
                    emit('LOAD-SUBHEADER-JUST-REFRESH', '')
                    emit('LOAD-MAIN-JUST-REFRESH', { mainHeading: getUnitHeading() })
                }
            }
        }

        return { changeFinYear }
    }
}
export { TraceSubHeader }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: theme.palette.primary.dark,
        },

        toolbarSubHeader: {
            backgroundColor: theme.palette.secondary.light
            , minHeight: '35px'
            , flexWrap: 'wrap'
        },

        chipSelect: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },

        containerBox: {
            width: '100%',
            alignItems: 'center',
        }

    }),
)

const TDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

const InitSpan = styled.span`
        color: ${props => props.color};
        font-weight:700;
        font-size: 1.0rem;
        margin-left: 1rem;
        margin-right: 1rem;
        width: auto;
        `

const DivNewView: any = styled.div`
    display: inline-block;
    visibility: ${(props: any) => props.showNewView};
`

    // < Box component = 'span' >
        // <Button style={{ marginRight: '0.5rem' }} className="subheader-link-button" label='Refresh cache'
        //     onClick={async (e) => {
        //         setBusyStatus(true)
        //         setRefresh({})
        //         await execDataCache()
        //         setBusyStatus(false)
        //         setRefresh({})
        //     }}
        // ></Button>
    //     <FontAwesomeIcon icon={faSpinner} className="fa fa-spinner fa-spin" style={{ fontSize: '1rem', color: 'red', display: `${getBusyStatus()}` }} ></FontAwesomeIcon>
    //     <InitSpan color={meta.current.statusColor}>{meta.current.statusMessage}</InitSpan>
    //     < DivNewView showNewView={newViewVisible} >
    //         <Button className="subheader-button" style={{ marginRight: '0.3rem' }} onClick={(e) => { emit('LOAD-MAIN-COMPONENT-NEW', '') }}>New </Button>
    //         <Button className='subheader-button' onClick={(e) => { emit('LOAD-MAIN-COMPONENT-VIEW', '') }}>View</Button>
    //     </ DivNewView>
    //                 </Box>