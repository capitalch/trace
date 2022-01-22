import { useSharedElements } from '../common/shared-elements-hook'
import {
    useDebitCreditNotesView,
    useStyles,
} from './debit-credit-notes-view-hook'

function DebitCreditNotesView({ arbitraryData, tranType }: any) {
    const { getXXGridParams, } = useDebitCreditNotesView(
        arbitraryData,
        tranType
    )
    const classes = useStyles()
    const {
        XXGrid,
    } = useSharedElements()
    const {
        columns,
        gridActionMessages,
        queryId,
        queryArgs,
        specialColumns,
        summaryColNames,
        title,
    } = getXXGridParams()
    return (
        <div className={classes.content}>
            <XXGrid
                gridActionMessages={gridActionMessages}
                columns={columns}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                title=""
                viewLimit="100"
            />
        </div>
    )
}

export { DebitCreditNotesView }