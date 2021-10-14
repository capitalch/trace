import { useState, useEffect, useRef } from '../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    Typography,
    createStyles,
} from '../../imports/gui-imports'
import {} from '@material-ui/core'
import { usingIbuki, manageEntitiesState } from '../../imports/trace-imports'
import { getArtifacts } from '../../react-form/common/react-form-hook'
import {} from '../../global-utils/esm'
import { AccountsLedgerDialog } from './components/final-accounts/accounts-ledger-dialog'
import { utils } from './utils'

function LaunchPad() {
    const { getUnitHeading } = utils()
    const {
        setCurrentComponent,
        getCurrentEntity,
        getCurrentComponent,
        setCurrentFormId,
    } = manageEntitiesState()
    const { filterOn } = usingIbuki()
    const currentEntityName = getCurrentEntity()
    const artifacts = getArtifacts(currentEntityName)
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        isMounted: false,
        mainHeading: '',
    })
    const classes = useStyles()
    meta.current.mainHeading = getUnitHeading()
    useEffect(() => {
        meta.current.isMounted = true
        const subs: any = filterOn('LAUNCH-PAD:LOAD-COMPONENT').subscribe(
            (d: any) => {
                if (!getCurrentEntity()) {
                    return
                }
                if (d.data) {
                    setCurrentComponent(d.data)
                }
                meta.current.isMounted && setRefresh({})
            }
        )

        return () => {
            subs.unsubscribe()
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

    function Comp() {
        let ret = <div></div>
        const currentComponent = getCurrentComponent()
        if (!currentComponent) {
            return ret
        }
        let currentComponentName = currentComponent.componentName

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
