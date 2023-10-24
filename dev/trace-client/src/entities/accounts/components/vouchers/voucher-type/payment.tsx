import { useEffect, useRef } from '../../../../../imports/regular-imports'
import { Header } from '../header'
import { ActionBlock } from '../action-block'
import { Crown, Crown1 } from '../crown'

function Payment({ hidden, meta }: any) {
    //hidden prop used for tab visibility
    return (<div hidden={hidden}>
        <Crown meta={meta} />
        <Header allowHeaderGst={true} />
        <ActionBlock actionType='credits' actionLabel='Credit' allowAddRemove={false} allowRowGst={false} ledgerAccounts='cashBank' allowInstrNo={true} allowFreeze={true} />
        <ActionBlock actionType='debits' actionLabel='Debit' allowAddRemove={true} allowRowGst={true} ledgerAccounts='paymentOther' notifyOnChange={true} />
        <Crown1 meta={meta} />
    </div>)
}

export { Payment }