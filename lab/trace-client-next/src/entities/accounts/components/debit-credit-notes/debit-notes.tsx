import { Box, Button, Typography, Tabs, Tab } from '../../../../imports/gui-imports'
import { useDebitCreditNotes, useStyles } from './debit-credit-notes-hook'
import { DebitCreditNotesBody } from './debit-credit-notes-body'
import { DebitCreditNotesView } from './debit-credit-notes-view'
import { useSharedElements } from '../common/shared-elements-hook'

function DebitNotes({ drillDownEditAttributes }: any = {}) {
    const classes = useStyles()
    const { handleOnTabChange, meta, multiData } = useDebitCreditNotes(
        drillDownEditAttributes
    )
    const { emit } = useSharedElements()

    return (
        <Box className={classes.content}>
            <Typography color='secondary' variant='subtitle1' component='div'>Debit notes</Typography>
            <Tabs
                className='tabs'
                indicatorColor="primary"
                onChange={handleOnTabChange}
                value={multiData.debitCreditNotes.tabValue}>
                <Tab label="Main" />
                <Tab label="View" />
                <Button className='reset' variant='contained' onClick={() => emit('LAUNCH-PAD:LOAD-COMPONENT', null)}>Reset</Button>
            </Tabs>
            <div hidden={multiData.debitCreditNotes.tabValue !== 0}>
                <DebitCreditNotesBody
                    arbitraryData={multiData.debitCreditNotes}
                    tranType="dn"
                />
            </div>
            <div hidden={multiData.debitCreditNotes.tabValue !== 1}>
                <DebitCreditNotesView
                    arbitraryData={multiData.debitCreditNotes}
                    tranType="dn"
                />
            </div>
        </Box>
    )
}

export { DebitNotes }
