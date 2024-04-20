import {
    _, Box, ButtonGroup, CloseSharp, Dialog, DialogContent, DialogTitle, EmailIcon, IconButton, IMegaData,
    manageEntitiesState, MegaDataContext, PDFViewer, Preview, SmsIcon, Tooltip, Typography, useContext, useEffect, useTraceMaterialComponents,
    useState, useTheme, utilMethods
} from '../redirect'
import { useDebitsCreditsPreview } from './debits-credits-preview-hook'
import { InvoiceA } from '../../pdf/invoices/invoiceA'

function DebitsCreditsPreview() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const { getFromBag } = manageEntitiesState()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { handleBillPreview, handleClose, handleEmail, handleSms, meta } = useDebitsCreditsPreview()
    const unitInfo = getFromBag('unitInfo')

    useEffect(() => {
        megaData.registerKeyWithMethod('render:debitsCreditsPreview', setRefresh)
    }, [])

    return (<Box sx={{ display: 'flex', alignItems: 'center', rowGap: 1, flexWrap: 'wrap' }}>
        <Typography variant='body2' sx={{}}>Debits:&nbsp;{toDecimalFormat(sales.debits)}</Typography>
        <Typography variant='body2' sx={{ ml: 2 }}>Credits:&nbsp;{toDecimalFormat(sales.credits)}</Typography>
        <Typography variant='body2' sx={{ fontWeight: 'bold', ml: 2, color: (sales.credits - sales.debits) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
            Diff:&nbsp;{toDecimalFormat(sales.credits - sales.debits)}
        </Typography>

        <Tooltip
            title="Preview" >
            {/* preview button is only visible when global / getFromBag('rawSaleData') has value. not on meta.rawSaleData which is activated when preview icon is clicked in view grid */}
            <IconButton sx={{ ml: 1, display: _.isEmpty(getFromBag('rawSaleData')) ? 'none' : 'block' }}
                size="small"
                disabled={false}
                onClick={handleBillPreview}>
                <Preview className="preview-icon" />
            </IconButton>
        </Tooltip>
        <Dialog
            open={meta.current.showDialog}
            onClose={handleClose}
            fullWidth={true}
            maxWidth="md">
            <DialogTitle>
                <div>
                    <div>{meta.current.dialogConfig.title}</div>
                    <ButtonGroup sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Email">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleEmail}>
                                <EmailIcon sx={{ color: theme.palette.amber.dark }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="SMS">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleSms}>
                                <SmsIcon sx={{ color: theme.palette.indigo.light }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Close">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleClose}>
                                <CloseSharp />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                </div>
            </DialogTitle>
            <DialogContent>
                <PDFViewer showToolbar={true} width={840} height={600}>
                    <InvoiceA
                        unitInfo={unitInfo}
                        rawSaleData={getFromBag('rawSaleData') || meta.current.rawSaleData || { }}
                    />
                </PDFViewer>
            </DialogContent>
        </Dialog>
    </Box>)

}
export { DebitsCreditsPreview }