import { useSharedElements } from '../common/shared-elements-hook'
import {
    useDebitCreditNotesView,
    useStyles,
} from './debit-credit-notes-view-hook'

function DebitCreditNotesView({ arbitraryData, tranType }: any) {
    const { getXXGridParams } = useDebitCreditNotesView(arbitraryData, tranType)
    const classes = useStyles()
    const { getGridReportSubTitle, XXGrid } = useSharedElements()
    const {
        columns,
        gridActionMessages,
        queryId,
        queryArgs,
        specialColumns,
        summaryColNames,
    } = getXXGridParams()
    
    return (
        <div className={classes.content}>
            <XXGrid
                gridActionMessages={gridActionMessages}
                columns={columns}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                subTitle={getGridReportSubTitle()}
                summaryColNames={summaryColNames}
                title={
                    tranType === 'dn' ? 'Debit notes view' : 'Credit notes view'
                }
                viewLimit="100"
            />
        </div>
    )
}

export { DebitCreditNotesView }
