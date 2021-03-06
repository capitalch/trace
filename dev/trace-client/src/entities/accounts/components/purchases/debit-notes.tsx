import { useSharedElements } from '../common/shared-elements-hook'
import {
    useDebitCreditNotes,
    useStyles,
} from '../common/debit-credit-notes-hook'
import { DebitCreditNoteBody } from '../common/debit-credit-note-body'
import { DebitCreditNotesView } from '../common/debit-credit-notes-view'

function DebitNotes() {
    // const [, setRefresh] = useState({})
    const classes = useStyles()
    const { handleOnChange, meta } = useDebitCreditNotes()

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
