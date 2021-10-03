import { useSharedElements } from '../common/shared-elements-hook'
import {
    useDebitCreditNotes,
    useStyles,
} from '../debit-credit-notes/debit-credit-notes-hook'
import { DebitCreditNoteBody } from '../debit-credit-notes/debit-credit-note-body'
import { DebitCreditNotesView } from '../debit-credit-notes/debit-credit-notes-view'

function DebitNotes({ drillDownEditAttributes}:any={}) {
    const classes = useStyles()
    const { handleOnChange, meta } = useDebitCreditNotes( drillDownEditAttributes)

    const {
        Paper,
        Tabs,
        Tab,
    } = useSharedElements()

    return (
        <Paper>
            <Tabs
                className={classes.content}
                indicatorColor="primary"
                onChange={handleOnChange}
                value={meta.current.value}>
                <Tab label="Debit note" />
                <Tab label="View" />
            </Tabs>
            <div hidden={meta.current.value !== 0}>
                <DebitCreditNoteBody
                    arbitraryData={meta.current}
                    tranType="dn"
                />
            </div>
            <div hidden={meta.current.value !== 1}>
                <DebitCreditNotesView
                    arbitraryData={meta.current}
                    tranType="dn"
                />
            </div>
        </Paper>
    )
}

export { DebitNotes }
