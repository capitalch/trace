import { createContext, useContext, useState, useEffect, useRef } from '../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    Typography,
    createStyles,
} from '../../imports/gui-imports'
import { useIbuki, manageEntitiesState, MegaContext } from '../../imports/trace-imports'
import { getArtifacts } from '../../react-form/common/react-form-hook'
import { AccountsLedgerDialog } from './components/final-accounts/accounts-ledger-dialog'
import { utils } from './utils'
import {
    // MegaContext,
    MultiDataContext,
    getPurchasesArbitraryData,
    getSalesArbitraryData,
    getDebitCreditNotesArbitraryData,
    getVouchersArbitraryData,
} from './components/common/multi-data-bridge'
import { useLinkClient } from '../../global-utils/link-client'
import { useServerSocketMessageHandler } from './components/common/server-socket-message-handler-hook'

function LaunchPad() {
    const { getUnitHeading } = utils()
    const {
        getFromBag,
        getLoginData,
        setCurrentComponent,
        getCurrentEntity,
        getCurrentComponent,
        setCurrentFormId,
    } = manageEntitiesState()
    const { filterOn } = useIbuki()
    const currentEntityName = getCurrentEntity()
    const artifacts = getArtifacts(currentEntityName)
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        isMounted: false,
        mainHeading: '',
    })
    const { connectToLinkServer, joinRoom, onReceiveData } = useLinkClient()
    const classes = useStyles()
    meta.current.mainHeading = getUnitHeading()
    // const MegaContext:any = createContext({})
    const mega = useContext(MegaContext)
    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        const subs: any = filterOn('LAUNCH-PAD:LOAD-COMPONENT').subscribe(
            (d: any) => {
                if (!getCurrentEntity()) {
                    return
                }
                if (d.data) {
                    setCurrentComponent(d.data)
                }
                curr.isMounted && setRefresh({})
            }
        )

        return () => {
            subs.unsubscribe()
            curr.isMounted = false
        }
    }, [])
    const { socketMessageHandler } = useServerSocketMessageHandler()
    useEffect(() => {
        const configuration = getFromBag('configuration')
        const { linkServerUrl, linkServerKey } = configuration
        let subs2: any = undefined
        const subs1 = connectToLinkServer(linkServerUrl, undefined, linkServerKey).subscribe(
            (d: any) => {
                if (d.connected) {
                    const room = getRoom()
                    joinRoom(room)
                    subs2 = onReceiveData().subscribe(socketMessageHandler)
                } else {
                    subs2 && (subs2.unsubscribe())
                }
            }
        )
        return (() => {
            subs1.unsubscribe()
            if (subs2) {
                subs2.unsubscribe()
            }
        })
    }, [])

    const salesData = getSalesArbitraryData()
    const purchasesData = getPurchasesArbitraryData()
    const debitCreditNotesData = getDebitCreditNotesArbitraryData()
    const vouchersArbitraryData = getVouchersArbitraryData()
    return (
        <>
            <Typography variant="h6" className={classes.title}>
                {meta.current.mainHeading}
            </Typography>
            {/* <MegaContext.Provider value={mega}> */}
                <MultiDataContext.Provider
                    value={{
                        sales: salesData,
                        purchases: purchasesData,
                        debitCreditNotes: debitCreditNotesData,
                        vouchers: vouchersArbitraryData,
                        generic: {}
                    }}>
                    <Comp></Comp>
                </MultiDataContext.Provider>
            {/* </MegaContext.Provider> */}
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

    function getRoom() {
        const clientId = getLoginData()?.clientId
        const buCode = getFromBag('buCode')
        const { finYearId } = getFromBag('finYearObject') || ''
        const { branchId } = getFromBag('branchObject') || ''
        const room = `${String(
            clientId
        )}:${buCode}:${finYearId}:${branchId}`
        return room
    }
}

export { LaunchPad }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            color: theme.palette.common.black,
            fontWeight: 'bold',
            // marginTop: theme.spacing(0.1),
            // marginBottom: theme.spacing(2),
        },
    })
)
