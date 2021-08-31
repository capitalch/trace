import { useState, useEffect, useRef, useContext } from 'react'
import { Header } from '../header'
import { ActionBlock } from '../action-block'
import { Crown, Crown1 } from '../crown'
import { useSharedElements } from '../../common/shared-elements-hook'
import { VoucherContext } from '../voucher-context'
// import { arbitraryData } from '../arbitrary-data'

function Journal({ hidden}: any) {
        const [, setRefresh] = useState({})
        const {
                filterOn,
        } = useSharedElements()

        const meta: any = useRef({
                isMounted: false,
                errorMessage: '',
        })
        const arbitraryData: any = useContext(VoucherContext)
        // arbitraryData.header.tranTypeId = tranTypeId
        useEffect(() => {
                meta.current.isMounted = true
                // const subs1 = filterOn('JOURNAL-MAIN-REFRESH').subscribe(() =>
                //         setRefresh({})
                // )
                return () => {
                        meta.current.isMounted = false
                        // subs1.unsubscribe()
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