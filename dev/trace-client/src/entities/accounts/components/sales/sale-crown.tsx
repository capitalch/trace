import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleCrown, useStyles } from './sale-crown-hook'
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tooltip,
    Typography,
} from '../../../../imports/gui-imports'
import {
    Check,
    CloseSharp,
    EmailIcon,
    Error,
    Preview,
    PrintIcon,
    SmsIcon,
} from '../../../../imports/icons-import'
import { MultiDataContext } from '../common/multi-data-bridge'
import { useContext } from '../../../../imports/regular-imports'
import { InvoiceA } from '../pdf/invoices/invoiceA'
import { ContentCopy } from '@mui/icons-material'

function SaleCrown({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const multiData: any = useContext(MultiDataContext)
    const arbitraryData: any = multiData.sales
    const { getError, handleBillPreview, handleClose, handleEmail, handleSms, handleSubmit, meta, setRefresh } =
        useSaleCrown(arbitraryData, saleType, drillDownEditAttributes)

    const { PDFViewer, toDecimalFormat, TraceDialog } = useSharedElements()

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
                    {/* <ButtonGroup size="small" variant="contained"> */}
                    {/* <Tooltip title="Send SMS">
                            <IconButton size="small" disabled={false}>
                                <SmsIcon className="sms-icon" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Send mail">
                            <IconButton size="small" disabled={false}>
                                <EmailIcon className="mail-icon" />
                            </IconButton>
                        </Tooltip> */}
                    <Tooltip title="Preview">
                        <IconButton
                            size="small"
                            disabled={false}
                            onClick={handleBillPreview}>
                            <Preview className="preview-icon" />
                        </IconButton>
                    </Tooltip>
                    {/* </ButtonGroup> */}

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
            {/* <TraceDialog meta={meta} materialDialogProps={{maxWidth:'md', height:'800'}}  /> */}
            {/* <div>                 */}
            <Dialog open={meta.current.showDialog} onClose={handleClose} fullWidth={true} maxWidth='md'>
                <DialogTitle >
                    <div className={classes.previewTitle}>
                        <div>{meta.current.dialogConfig.title}</div>
                        <ButtonGroup>
                            <Tooltip title='Email'>
                                <IconButton
                                    size="small"
                                    disabled={false}
                                    onClick={handleEmail}>
                                    <EmailIcon className='email-icon' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='SMS'>
                                <IconButton
                                    size="small"
                                    disabled={false}
                                    onClick={handleSms}>
                                    <SmsIcon className='sms-icon' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Close'>
                                <IconButton
                                    size="small"
                                    disabled={false}
                                    onClick={handleClose} >
                                    <CloseSharp />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>


                    </div>
                </DialogTitle>
                <DialogContent>
                    <PDFViewer showToolbar={true} width={840} height={600}>
                        <InvoiceA />
                    </PDFViewer>
                </DialogContent>
            </Dialog>
            {/* </div> */}
        </div>
    )
}

export { SaleCrown }
