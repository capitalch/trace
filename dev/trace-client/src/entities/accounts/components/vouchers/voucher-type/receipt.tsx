import { useEffect, useRef } from '../../../../../imports/regular-imports'
import { Header } from '../header'
import { ActionBlock } from '../action-block'
import { Crown, Crown1 } from '../crown'

function Receipt({ hidden, meta }: any) {
    // const meta: any = useRef({
    //     isMounted: false,
    //     errorMessage: '',
    // })

    // useEffect(() => {
    //     const curr = meta.current
    //     curr.isMounted = true
    //     return () => {
    //         curr.isMounted = false
    //     }
    // }, [])
    
    //hidden prop used for tab visibility
    return (<div hidden={hidden}>
        <Crown meta={meta} />
        <Header allowHeaderGst={true} />
        <ActionBlock actionType='debits' actionLabel='Debit' allowAddRemove={false} allowRowGst={false} ledgerAccounts='cashBank' allowFreeze={true} allowInstrNo={true} />
        <ActionBlock actionType='credits' actionLabel='Credit' allowAddRemove={true} allowRowGst={true} ledgerAccounts='receiptOther' notifyOnChange={true} />        
        <Crown1 meta={meta} />
    </div>)
}

export { Receipt }