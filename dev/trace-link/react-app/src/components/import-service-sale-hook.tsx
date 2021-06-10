import { useEffect, useRef, useState } from 'react'
import { useSharedElements } from '../shared-elements-hook'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useImportServiceSaleHelper } from './import-service-sale-helper-hook'

function useImportServiceSale() {
    const {
        _,
        axios,
        Button,
        CloseIcon,
        config,
        Column,
        Dialog,
        DialogTitle,
        DialogActions,
        DialogContent,
        DialogContentText,
        emit,
        filterOn,
        IconButton,
        isElectron,
        isValidMobile,
        messages,
        moment,
        toDecimalFormat,
        Typography,
        useIbuki,
        useSqlAnywhere,
    } = useSharedElements()
    const classes = useStyles()
    const { prepareData, processAndMoveData } = useImportServiceSaleHelper()

    const arbitraryData = useRef({
        startDate: undefined,
        endDate: undefined,
        finYear: undefined,
        // isOverwriteData: false,
        companyId: '',
    })

    function DialogBox({ arbitraryDataCurrent }: any) {
        const [, setRefresh] = useState({})

        const meta: any = useRef({
            closeButtonDisabled: true,
            openDialog: false,
            processedRows: 0,
            serviceData: [],
            setRefresh: setRefresh,
            status1: 'Getting data from Service+',
            status2: '',
            status3: '',
            isDisabledTansferButton: true,
        })

        useEffect(() => {
            const subs1 = filterOn(
                'IMPORT-SERVICE-SALE-HOOK-OPEN-DIALOG'
            ).subscribe(() => {
                meta.current.openDialog = true
                meta.current.processedRows = 0
                setRefresh({})
            })
            // meta.current.transferButtonDisabled =  (!meta.current.serviceData) ||
            // (meta.current.serviceData.length === 0)

            setRefresh({})

            return () => {
                subs1.unsubscribe()
            }
        }, [])

        return (
            <Dialog
                classes={{ paper: classes.dialogPaper }}
                className={classes.dialog}
                open={meta.current.openDialog}
                disableBackdropClick={true}
                fullWidth={true}
                onEntered={() => prepareData(meta, arbitraryDataCurrent)}
                onClose={handleOnClose}>
                <DialogTitle>
                    <div className="dialog-title">
                        <div> {messages.transferDataTitle}</div>
                        <IconButton size="small" onClick={handleOnClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent className="dialog-content">
                    <div>
                        <span>
                            Start date: <b>{arbitraryDataCurrent.startDate}</b>
                            {'  '}
                        </span>
                        <span>
                            End date: <b>{arbitraryDataCurrent.endDate}</b>
                        </span>
                    </div>
                    {meta.current.status2}
                    <Button
                        className="transfer-button"
                        // style={{ width: '15rem' }}
                        onClick={() =>
                            processAndMoveData(arbitraryDataCurrent, meta)
                        }
                        disabled={meta.current.isDisabledTansferButton}
                        variant="contained"
                        // size="small"
                        color="secondary">
                        Transfer data to Trace
                    </Button>
                    {/* <ProgressIndicator /> */} 
                    <Typography className="status3" variant="body1">
                        {meta.current.status3}
                    </Typography>
                    <Button
                        className="close-button"
                        disabled={meta.current.closeButtonDisabled}
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={handleOnClose}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        )
        function handleOnClose() {
            meta.current.openDialog = false
            setRefresh({})
        }

        function ProgressIndicator() {
            const [, setRefresh] = useState({})
            useEffect(() => {
                const subs1 = filterOn(
                    'IMPORT-SERVICE-SALE-HELPER-HOOK-COUNTER-TICK'
                ).subscribe((d:any) => {
                    meta.current.processedRows = d.data
                    setRefresh({})
                })
                return () => {
                    subs1.unsubscribe()
                }
            }, [])
            return (
                <Typography>
                    No of rows processed: {meta.current.processedRows}
                </Typography>
            )
        }
    }

    function TitleAndContinue({ arbitraryDataCurrent }: any) {
        const [, setRefresh] = useState({})

        const meta: any = useRef({
            isMounted: false,
            title: 'Import sale data from Service+ software to Trace',
        })

        useEffect(() => {
            meta.current.isMounted = true
            const subs1 = filterOn(
                'IMPORT-SERVICE-SALE-HOOK-REFRESH'
            ).subscribe(() => setRefresh({}))
            return () => {
                subs1 && subs1.unsubscribe()
                meta.current.isMounted = false
            }
        }, [])

        return (
            <div className="title-button">
                <Typography
                    variant="subtitle1"
                    component="div"
                    className="title">
                    {meta.current.title}
                </Typography>
                {/* <Button
                    onClick={(e) => {
                        console.log(arbitraryDataCurrent)
                    }}
                    color="secondary">
                    Test
                </Button> */}
                <Button
                    disabled={
                        !(
                            arbitraryDataCurrent.startDate &&
                            arbitraryDataCurrent.endDate
                        )
                    }
                    onClick={handleButtonClick}
                    variant="contained"
                    color="secondary"
                    title="Continue with import">
                    Continue
                </Button>
            </div>
        )

        async function handleButtonClick() {
            const finYear = +arbitraryDataCurrent.finYear
            const startDate = arbitraryDataCurrent.startDate
            const endDate = arbitraryDataCurrent.endDate
            const fStartDate = String(finYear).concat('-', '04', '-', '01')
            const fEndDate = String(finYear + 1).concat('-', '03', '-', '31')
            if (startDate && endDate && moment(startDate) <= moment(endDate)) {
                if (
                    moment(startDate).isBetween(
                        fStartDate,
                        fEndDate,
                        undefined,
                        '[]'
                    ) &&
                    moment(endDate).isBetween(
                        fStartDate,
                        fEndDate,
                        undefined,
                        '[]'
                    )
                ) {
                    // open dialog                    
                    emit('IMPORT-SERVICE-SALE-HOOK-OPEN-DIALOG', null)
                } else {
                    alert(messages.errInvalidDate)
                }
            }
        }
    }

    return { arbitraryData, DialogBox, TitleAndContinue }
}

export { useImportServiceSale }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .title-button': {
                display: 'flex',
                justifyContent: 'space-between',
                marginLeft: '2rem',
                '& .title': {
                    color: theme.palette.deepPurple.dark,
                    fontWeight: 'bold',
                },
            },
        },
        dialog: {
            '& .dialog-title': {
                color: 'blue',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: '5rem',
            },
            '& .dialog-content': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: '0.5rem',
            },
            '& .transfer-button': {
                width: '50%',
                // marginLeft: 'auto',
                marginTop: '2rem',
            },
            '& .status3': {
                marginTop: '2rem',
                color: 'dodgerBlue',
            },
            '& .close-button': {
                marginTop: 'auto',
                // marginLeft: 'auto',
                width: '7rem',
            },
        },
        dialogPaper: {
            height: '30rem',
        },
    })
)
export { useStyles }

/* <Button
    onClick={(e) => {
        console.log(arbitraryDataCurrent)
    }}
    color="secondary">
    Test
</Button> */
