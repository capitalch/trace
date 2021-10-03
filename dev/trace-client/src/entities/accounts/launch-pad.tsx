import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { usingIbuki } from '../../common-utils/ibuki'
import { getArtifacts } from '../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../common-utils/esm'
// import { manageFormsState } from '../../react-form/core/fsm'
import { AccountsLedgerDialog } from './components/final-accounts/accounts-ledger-dialog'
// import { utilMethods } from '../../common-utils/util-methods'
import { utils } from './utils'

function LaunchPad() {
    const { getUnitHeading } = utils()
    const {
        setCurrentComponent,
        getCurrentEntity,
        getCurrentComponent,
        setCurrentFormId,
        // getCurrentFormId,
    } = manageEntitiesState()
    const { filterOn, emit } = usingIbuki()
    const currentEntityName = getCurrentEntity()
    const artifacts = getArtifacts(currentEntityName)
    const [, setRefresh] = useState({})
    // const { execGenericView } = utilMethods()
    // const { setFormData, resetAllFormErrors } = manageFormsState()
    const meta: any = useRef({
        isMounted: false,
        mainHeading: '',
    })
    const classes = useStyles()
    meta.current.mainHeading = getUnitHeading()
    useEffect(() => {
        meta.current.isMounted = true
        const subs:any = filterOn('LAUNCH-PAD:LOAD-COMPONENT').subscribe((d: any) => {
            if (!getCurrentEntity()) {
                return
            }
            if (d.data) {
                // d.data.mode = 'new'
                setCurrentComponent(d.data)
            }
            // } else {
            //     getCurrentComponent() && (getCurrentComponent().mode = 'new')
            // }
            meta.current.isMounted && setRefresh({})
        })

        // const subs1:any = filterOn('LOAD-MAIN-COMPONENT-VIEW').subscribe(
        //     (d: any) => {
        //         if (!getCurrentEntity()) {
        //             return
        //         }
        //         getCurrentComponent() && (getCurrentComponent().mode = 'view')
        //         setRefresh({})
        //     }
        // )

        // const subs2:any = filterOn('LOAD-MAIN-COMPONENT-EDIT').subscribe(
        //     (d: any) => {
        //         const currentFormId = getCurrentFormId()
        //         resetAllFormErrors(currentFormId)
        //         let headerId = d.data.headerId
        //         getCurrentComponent().mode = 'edit'
        //         if (headerId) {                    
        //             doQuery()
        //         }
        //         // assuming master details data format
        //         async function doQuery() {
        //             emit('SHOW-LOADING-INDICATOR', true)
        //             const ret: any = await execGenericView({
        //                 isMultipleRows: false,
        //                 args: {
        //                     id: headerId,
        //                 },
        //                 sqlKey: 'getJson_tranHeader_details',
        //             })
        //             const jsonResult = ret.jsonResult
        //             const tranDetails: any[] = jsonResult.tranDetails
        //             const tranHeader: any = jsonResult.tranHeader
        //             const tranTypeId = tranHeader.tranTypeId
        //             const { debits, credits }: any = getDebitsAndCredits(
        //                 tranDetails,
        //                 tranTypeId
        //             )
        //             setFormData(currentFormId, {
        //                 header: { ...tranHeader },
        //                 credits: JSON.parse(JSON.stringify(credits)),
        //                 debits: JSON.parse(JSON.stringify(debits)),
        //             })
        //             emit('SHOW-LOADING-INDICATOR', false)
        //             meta.current.isMounted && setRefresh({})
        //         }
        //     }
        // )

        return () => {
            subs.unsubscribe()
            // subs1.unsubscribe()
            // subs2.unsubscribe()
            meta.current.isMounted = false
        }
    }, [])

    return (
        <>
            <Typography variant="h6" className={classes.title}>
                {meta.current.mainHeading}
            </Typography>
            <Comp></Comp>
            <AccountsLedgerDialog></AccountsLedgerDialog>
        </>
    )

    // function getDebitsAndCredits(tranDetails: any[], tranTypeId: number) {
    //     const debits: any[] = tranDetails.filter((x: any) => x.dc === 'D')
    //     const credits: any[] = tranDetails.filter((x: any) => x.dc === 'C')
    //     const logic: any = {
    //         1: () => {
    //             return {
    //                 debits: debits,
    //                 credits: credits,
    //             }
    //         },
    //         2: () => {
    //             return {
    //                 debits: debits,
    //                 credits: credits[0],
    //             }
    //         },
    //         3: () => {
    //             return {
    //                 debits: debits[0],
    //                 credits: credits,
    //             }
    //         },
    //         6: () => {
    //             return {
    //                 debits: debits[0],
    //                 credits: credits[0],
    //             }
    //         },
    //     }
    //     return logic[tranTypeId]()
    // }

    function Comp() {
        let ret = <div></div>
        const currentComponent = getCurrentComponent()
        if (!currentComponent) {
            return ret
        }
        let currentComponentName = ''
        // if (currentComponent.mode === 'view') {
        //     const viewables: string[] = [
        //         'payments',
        //         'receipts',
        //         'contra',
        //         'journals',
        //     ]
        //     if (
        //         viewables.includes(currentComponent.componentName) ||
        //         viewables.includes(currentComponent.args.loadComponent)
        //     ) {
        //         currentComponentName = 'dataView'
        //     }
        // } else {
            currentComponentName = currentComponent.componentName
        // }
        // if finYearId is not actuated then don't try to refresh component. This is to avoid unnecessary call to server with null finYearId and branchId during initialize (init-code execution) period
      
        if (currentComponentName) {
            if (artifacts) {
                if (artifacts['allForms']) {
                    if (artifacts['allForms'][currentComponentName]) {
                        ret = artifacts['allForms'][currentComponentName]()
                        const currentFormId =
                            ret && ret.props && ret.props.formId
                        currentFormId && setCurrentFormId(currentFormId)
                    } else if (
                        artifacts['customComponents'] &&
                        artifacts['customComponents'][currentComponentName]
                    ) {
                        ret = artifacts['customComponents'][
                            currentComponentName
                        ](currentComponent.args)
                    }
                }
            }
        }
        return ret
    }
}

export { LaunchPad }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            color: theme.palette.primary.dark,
            marginTop: theme.spacing(0.2),
            marginBottom: theme.spacing(0.2),
        },
    })
)
