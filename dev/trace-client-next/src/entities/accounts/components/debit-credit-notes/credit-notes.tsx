import { useSharedElements } from '../common/shared-elements-hook'
import { Box, Tabs, Tab, Typography } from '../../../../imports/gui-imports'
import { useDebitCreditNotes, useStyles } from './debit-credit-notes-hook'
import { DebitCreditNotesBody } from './debit-credit-notes-body'
import { DebitCreditNotesView } from './debit-credit-notes-view'

function CreditNotes({ drillDownEditAttributes }: any = {}) {
    const classes = useStyles()
    const { handleOnChange, meta } = useDebitCreditNotes(
        drillDownEditAttributes
    )

    return (
        <Box className={classes.content}>
            <Typography color="secondary" variant="subtitle1" component="div">
                Credit notes
            </Typography>
            <Tabs
                className="tabs"
                indicatorColor="primary"
                onChange={handleOnChange}
                value={meta.current.value}>
                <Tab label="Main" />
                <Tab label="View" />
            </Tabs>
            <div hidden={meta.current.value !== 0}>
                <DebitCreditNotesBody
                    arbitraryData={meta.current}
                    tranType="cn"
                />
            </div>
            <div hidden={meta.current.value !== 1}>
                <DebitCreditNotesView
                    arbitraryData={meta.current}
                    tranType="cn"
                />
            </div>
        </Box>
    )
}

export { CreditNotes }
