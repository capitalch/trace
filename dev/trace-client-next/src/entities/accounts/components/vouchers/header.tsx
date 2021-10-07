import { useState, useEffect, useRef, useContext } from 'react'
// import { arbitraryData } from "./arbitrary-data"
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'
import { VoucherContext } from './voucher-context'

function Header({allowHeaderGst}: any) {
    const classes = useStyles()
    const [, setRefresh] = useState({})
    const arbitraryData:any = useContext(VoucherContext)
    const {
        // _,
        accountsMessages,
        Checkbox,
        emit,
        FormControlLabel,
        isInvalidDate,
        isInvalidGstin,
        // NumberFormat,
        Paper,
        TextField,
    } = useSharedElements()
    return (
        <Paper elevation={1} className={classes.contentHeader}>
            <TextField
                label="Ref no"
                placeholder="Auto ref no"
                disabled
                value={arbitraryData?.header?.autoRefNo || ''}
            />
            {/* date */}
            <div className="date-block">
                <label className="date-label">Date</label>
                <TextField
                    error={isInvalidDate(arbitraryData.header.tranDate)}
                    helperText={
                        isInvalidDate(arbitraryData.header.tranDate)
                            ? accountsMessages.dateRangeAuditLockMessage
                            : undefined
                    }
                    type="date"
                    onChange={(e: any) => {
                        arbitraryData.header.tranDate = e.target.value
                        emit('CROWN-REFRESH', '')
                        setRefresh({})
                    }}
                    onFocus={(e) => e.target.select()}
                    value={arbitraryData.header.tranDate || ''}
                />
            </div>
            {/* user ref no  */}
            <TextField
                label="User ref"
                className="user-ref"
                // error={getInvoiceError()}
                onChange={(e: any) => {
                    arbitraryData.header.userRefNo = e.target.value
                    setRefresh({})
                }}
                value={arbitraryData.header.userRefNo || ''}
            />
            {/* remarks */}
            <TextField
                label="Common remarks"
                className="common-remarks"
                onChange={(e: any) => {
                    arbitraryData.header.remarks = e.target.value
                    setRefresh({})
                }}
                value={arbitraryData.header.remarks || ''}
            />
            {/* isGst */}
            {allowHeaderGst && <FormControlLabel
                className="gst-invoice"
                control={
                    <Checkbox
                        onChange={(e: any) => {
                            arbitraryData.header.isGst = e.target.checked
                            if (!arbitraryData.header.isGst) {
                                arbitraryData.header.gstin = undefined
                                emit('ACTION-BLOCK-RESET-GST', '')
                            }
                            emit('CROWN-REFRESH', '') // for eval of error condition
                            emit('ACTION-BLOCK-REFRESH', '')
                            setRefresh({})
                        }}
                        value={!!arbitraryData.header.isGst}
                        checked={!!arbitraryData.header.isGst}
                    />
                }
                label="Gst"
            />}

            {/* gstin */}
            {arbitraryData.header.isGst && <TextField
                label="Gstin no"
                error={
                    !!getHeaderInvalidGstin()
                }
                helperText={
                    getHeaderInvalidGstin()
                }
                onChange={(e: any) => {
                    arbitraryData.header.gstin = e.target.value
                    emit('CROWN-REFRESH', '')
                    setRefresh({})
                }}
                value={arbitraryData.header.gstin || ''}
            />}
        </Paper>
    )

    function getHeaderInvalidGstin() {
        let m = ''
        if (arbitraryData.header.isGst) {
            if (!arbitraryData.header.gstin) {
                m = accountsMessages.gstinRequired
            } else {
                if (isInvalidGstin(arbitraryData.header.gstin)) {
                    m = accountsMessages.invalidGstin
                }
            }
        } else {
            m = accountsMessages.removeGstin
        }
        return (m)
    }

}

export { Header }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        contentHeader: {
            marginTop: theme.spacing(2),
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: theme.spacing(4),
            rowGap: theme.spacing(2),
            padding: theme.spacing(1),
            backgroundColor: '#F6F6F4',
            '& .date-block': {
                display: 'flex',
                flexDirection: 'column',
                '& .date-label': {
                    fontSize: '0.7rem',
                },
            },
            '& .user-ref': {
                maxWidth: '10rem',
            },
            '& .common-remarks': {
                maxWidth: '20rem',
                flexGrow: 2,
            },
        },
    })
)

export { useStyles }