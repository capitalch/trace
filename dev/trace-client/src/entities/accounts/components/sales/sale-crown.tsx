import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleCrown, useStyles } from './sale-crown-hook'
import { Button, ButtonGroup, IconButton, Typography } from '../../../../imports/gui-imports'
import { Check, EmailIcon, Error, PrintIcon, SmsIcon } from '../../../../imports/icons-import'
import { MultiDataContext } from '../common/multi-data-bridge'
import { useContext } from '../../../../imports/regular-imports'

function SaleCrown({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.sales
    const { getError, handleSubmit, meta } = useSaleCrown(
        arbitraryData,
        saleType,
        drillDownEditAttributes
    )

    const { toDecimalFormat } = useSharedElements()

    return (
        <div className={classes.content}>
            <div className="sales-crown">
                <Typography variant="subtitle1" className="crown-title">
                    {meta.current.title}
                </Typography>
                <div className="crown-content">
                    <Typography variant="subtitle1">
                        Total debits:{' '}
                        {toDecimalFormat(arbitraryData.footer.amount)}
                    </Typography>

                    <Typography variant="subtitle1">
                        Total credits:{' '}
                        {toDecimalFormat(arbitraryData.summary.amount)}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        style={{
                            color:
                                Math.abs(
                                    arbitraryData.footer.amount -
                                    arbitraryData.summary.amount
                                ) === 0
                                    ? 'dodgerBlue'
                                    : 'red',
                        }}>
                        Diff:{' '}
                        {toDecimalFormat(
                            Math.abs(
                                arbitraryData.footer.amount -
                                arbitraryData.summary.amount
                            )
                        )}
                    </Typography>

                    <ButtonGroup size='small' variant='contained'>
                        <IconButton size='small' disabled={false}>
                            <SmsIcon className='sms-icon' />
                        </IconButton>
                        <IconButton size='small' disabled={false}>
                            <EmailIcon className='mail-icon' />
                        </IconButton>
                        <IconButton size='small' disabled={false}>
                            <PrintIcon className='print-icon' />
                        </IconButton>
                    </ButtonGroup>

                    <Button
                        // className="submit"
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={handleSubmit}
                        startIcon={
                            getError() ? (
                                <Error color="error" />
                            ) : (
                                <Check style={{ color: 'white' }} />
                            )
                        }
                        disabled={getError()}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

export { SaleCrown }
