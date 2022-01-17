import {
    useState,
    useEffect,
    useContext,
    useRef,
} from '../../../../imports/regular-imports'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
    Theme,
    Tooltip,
    createStyles,
    Paper,
    Typography,
} from '../../../../imports/gui-imports'
import { CloseSharp, PrintIcon } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useCrown } from './crown-hook'
import { MultiDataContext } from '../common/multi-data-bridge'
import {PdfVoucher} from '../pdf/vouchers/pdf-voucher'

// import { useReactToPrint } from 'react-to-print'

function Crown({ meta }: any) {
    const classes = useStyles()
    const ctx: any = useContext(MultiDataContext)
    const arbitraryData = ctx?.vouchers
    const componentRef: any = useRef()
    const ad = arbitraryData
    const {
        checkError,
        handleClose,
        handleOpen,
        ResetButton,
        SubmitButton,
        setRefresh,
        SummaryDebitsCredits,
        SummaryGst,
    } = useCrown(meta, componentRef)

    const { emit, filterOn, PDFViewer } = useSharedElements()

    const pageStyle = `
        @page {
            size: 80mm 50mm;
        }
    `

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     pageStyle:pageStyle
    // })

    useEffect(() => {
        const subs1 = filterOn('CROWN-REFRESH').subscribe(() => {
            meta.current.errorMessage = ''
            checkError(arbitraryData)
            setRefresh({})
            emit('CROWN2-REFRESH', meta.current.errorMessage)
        })
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    checkError(arbitraryData)
    return (
        <div>
            <Paper elevation={1} className={classes.contentCrown}>
                <SummaryDebitsCredits ad={arbitraryData} />
                <SummaryGst ad={arbitraryData} />
                <ResetButton />
                <Typography variant="subtitle2" className="error-message">
                    {meta.current.errorMessage}
                </Typography>
                <div>
                    <Tooltip
                        title="Print"
                        style={{
                            display: ad?.header?.autoRefNo
                                ? 'inline-block'
                                : 'none',
                        }}>
                        <IconButton
                            className="print-button"
                            size="small"
                            onClick={handleOpen}>
                            <PrintIcon className="print-icon" />
                        </IconButton>
                    </Tooltip>
                    <SubmitButton ad={arbitraryData} meta={meta} />
                </div>
            </Paper>
            <Dialog
                open={meta.current.showDialog}
                onClose={handleClose}
                fullWidth={true}
                maxWidth="md">
                <DialogTitle>
                    <div className={classes.previewTitle}>
                        <div>{meta.current.dialogConfig.title}</div>
                        <Tooltip title="Close">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleClose}>
                                <CloseSharp />
                            </IconButton>
                        </Tooltip>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <PDFViewer showToolbar={true} width={840} height={600}>
                        <PdfVoucher arbitraryData={arbitraryData} />
                        {/* <InvoiceA
                            unitInfo={unitInfo}
                            rawSaleData={getFromBag('rawSaleData') || {}}
                        /> */}
                    </PDFViewer>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function Crown1({ meta }: any) {
    const classes = useStyles()
    const ctx: any = useContext(MultiDataContext)
    const arbitraryData = ctx?.vouchers
    const componentRef: any = useRef()
    // const arbitraryData = useContext(VoucherContext)
    const [, setRefresh] = useState({})
    const { filterOn } = useSharedElements()
    const {
        // handlePrint,
        ResetButton,
        SubmitButton,
        SummaryDebitsCredits,
        SummaryGst,
    } = useCrown(meta, componentRef)
    useEffect(() => {
        const subs1 = filterOn('CROWN2-REFRESH').subscribe((d: any) => {
            setRefresh({})
        })
        return () => {
            subs1.unsubscribe()
        }
    }, [])

    return (
        <Paper elevation={1} className={classes.contentCrown}>
            <SummaryDebitsCredits ad={arbitraryData} />
            <SummaryGst ad={arbitraryData} />
            <ResetButton />
            <Typography variant="subtitle2" className="error-message">
                {meta.current.errorMessage}
            </Typography>
            <div>
                {/* <Tooltip title="Print">
                    <IconButton
                        className="print-button"
                        size="small"
                        disabled={false}
                        onClick={handlePrint}>
                        <PrintIcon className="print-icon" />
                    </IconButton>
                </Tooltip> */}
                <SubmitButton ad={arbitraryData} meta={meta} />
            </div>
        </Paper>
    )
}

export { Crown, Crown1 }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentCrown: {
            display: 'flex',
            columnGap: theme.spacing(4),
            rowGap: theme.spacing(2),
            flexWrap: 'wrap',
            marginTop: theme.spacing(2),
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(1),
            backgroundColor: '#E8E8E8',

            '& .summary-debits-credits': {
                color: theme.palette.indigo.main,
                fontWeight: 'bold',
            },

            '& .summary-gst': {
                color: theme.palette.lime.dark,
            },

            '& .error-message': {
                color: 'red',
                fontWeight: 'bold',
            },

            '& .reset-button': {
                backgroundColor: theme.palette.blue.main,
                color: theme.palette.getContrastText(theme.palette.blue.main),
            },

            '& .print-button': {
                marginRight: '1rem',
                '& .print-icon': {
                    color: theme.palette.indigo.dark,
                },
            },
        },

        previewTitle: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    })
)

//     <div style={{ display: 'none' }}>
//         <div ref={componentRef} className='myClass'>
//             <span>{ad?.pdfVoucher?.heading || ''}</span>
//             <span>{ad?.pdfVoucher?.tranDate}</span>
//         </div>
//     </div>
