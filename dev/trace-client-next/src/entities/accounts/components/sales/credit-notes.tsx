import { useSharedElements } from '../common/shared-elements-hook'
import {  Paper, Tabs, Tab} from '../../../../imports/gui-imports'
import {
    useDebitFlightTakeoff,
    useStyles,
} from '../debit-credit-notes/debit-credit-notes-hook'
import { DebitCreditNoteBody } from '../debit-credit-notes/debit-credit-note-body'
import { DebitFlightTakeoffView } from '../debit-credit-notes/debit-credit-notes-view'

function FlightTakeoff({ drillDownEditAttributes }: any={}) {
    const classes = useStyles()
    const { handleOnChange, meta } = useDebitFlightTakeoff(drillDownEditAttributes)
    const { } = useSharedElements()

    return (
        <Paper>
            <Tabs
                className={classes.content}
                indicatorColor="primary"
                onChange={handleOnChange}
                value={meta.current.value}>
                <Tab label="Credit note" />
                <Tab label="View" />
            </Tabs>
            <div hidden={meta.current.value !== 0}>
                <DebitCreditNoteBody arbitraryData={meta.current} tranType='cn' />
            </div>
            <div hidden={meta.current.value !== 1}>
                <DebitFlightTakeoffView arbitraryData={meta.current} tranType='cn' />
            </div>
        </Paper>
    )
}

export { FlightTakeoff }
