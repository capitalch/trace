// import { useSharedElements } from '../../common/shared-elements-hook'
import { useJournalMain, useStyles } from './journal-main-hook'

function JournalMain({ arbitraryData, hidden }: any) {
        const classes = useStyles()
        const { ActionBlock, Crown, Crown1, Header, meta } = useJournalMain(arbitraryData)

        //hidden prop used for tab visibility
        return (<div hidden={hidden}>
                <Crown arbitraryData={arbitraryData} meta={meta}/>
                <Header arbitraryData={arbitraryData} />
                <ActionBlock arbitraryData={arbitraryData} actionType='debits' actionLabel='Debit' isAddRemove={true} />
                <ActionBlock arbitraryData={arbitraryData} actionType='credits' actionLabel='Credit' isAddRemove={true} />
                {/* <Crown arbitraryData={arbitraryData} meta={meta} /> */}
                <Crown1 arbitraryData={arbitraryData} meta = {meta}/>
        </div>)
}

export { JournalMain }