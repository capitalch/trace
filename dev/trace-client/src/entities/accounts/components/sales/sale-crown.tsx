import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleCrown, useStyles } from './sale-crown-hook'
import {
    Button,
    ButtonGroup,
    IconButton,
    Tooltip,
    Typography,
} from '../../../../imports/gui-imports'
import {
    Check,
    EmailIcon,
    Error,
    PrintIcon,
    SmsIcon,
} from '../../../../imports/icons-import'
import { MultiDataContext } from '../common/multi-data-bridge'
import { useContext } from '../../../../imports/regular-imports'

function SaleCrown({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.sales
    const { getError, handleBillPrint, handleSubmit, meta } = useSaleCrown(
        arbitraryData,
        saleType,
        drillDownEditAttributes
    )

    const { toDecimalFormat, TraceDialog } = useSharedElements()

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
                    <ButtonGroup size="small" variant="contained">
                        <Tooltip title="Send SMS">
                            <IconButton size="small" disabled={false}>
                                <SmsIcon className="sms-icon" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Send mail">
                            <IconButton size="small" disabled={false}>
                                <EmailIcon className="mail-icon" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleBillPrint}>
                                <PrintIcon className="print-icon" />
                            </IconButton>
                        </Tooltip>
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
            <TraceDialog meta={meta} />
        </div>
    )
}

export { SaleCrown }
