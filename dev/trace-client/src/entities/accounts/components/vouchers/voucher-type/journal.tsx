import { useEffect, useRef, } from 'react'
import { Header } from '../header'
import { ActionBlock } from '../action-block'
import { Crown, Crown1 } from '../crown'
// import { useSharedElements } from '../../common/shared-elements-hook'
// import { VoucherContext } from '../voucher-context'
import { truncate } from 'lodash'
// import { arbitraryData } from '../arbitrary-data'

function Journal({ hidden}: any) {
        // const [, setRefresh] = useState({})
        // const {
        //         filterOn,
        // } = useSharedElements()

        const meta: any = useRef({
                isMounted: false,
                errorMessage: '',
        })
        // const arbitraryData: any = useContext(VoucherContext)
        useEffect(() => {
                meta.current.isMounted = truncate
                return () => {
                        meta.current.isMounted = false
                }
        }, [])

        //hidden prop used for tab visibility
        return (<div hidden={hidden}>
                <Crown meta={meta} />
                <Header allowHeaderGst={true} />
                <ActionBlock actionType='debits' actionLabel='Debit' allowAddRemove={true} allowRowGst={true} ledgerAccounts='journal' />
                <ActionBlock actionType='credits' actionLabel='Credit' allowAddRemove={true} allowRowGst={true} ledgerAccounts='journal' />
                <Crown1 meta={meta} />
        </div>)
}

export { Journal }