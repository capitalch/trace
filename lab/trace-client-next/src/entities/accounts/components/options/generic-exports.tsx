import { moment, SplitButton, useEffect, useRef, useState } from '../../../../imports/regular-imports'
import {
    FormControl, Grid,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    FormControlLabel, Typography
} from '../../../../imports/gui-imports'

import { utilMethods } from '../../../../global-utils/misc-utils'
import { ajaxService } from '../../../../global-utils/ajax-service'
import { useSharedElements } from '../common/shared-elements-hook'

function GenericExports() {
    const { isControlDisabled } = utilMethods()
    const { downloadFile } = ajaxService()
    const {
        getFromBag,
    } = useSharedElements()
    const isoDateFormat = 'YYYY-MM-DD'
    const dateFormat = getFromBag('dateFormat')
    const finYearObject = getFromBag('finYearObject')
    const startDate1 = finYearObject.startDate
    const endDate1 = finYearObject.endDate
    const startDate = moment(startDate1, dateFormat)
    const endDate = moment(endDate1, dateFormat)
    const tranTypeMap: any = {
        payments: 2,
        receipts: 3,
        contras: 6,
        journals: 1,

    }
    const meta: any = useRef({
        isMounted: false,
        count: 1,
        gstReports: {
            selectionMode: 'date',
            startDate: moment(startDate).format(isoDateFormat),
            endDate: moment(endDate).format(isoDateFormat),
            quarter: '1',
        },
    })

    useEffect(() => {
        meta.current.isMounted = true
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const data = [
        { label: 'Accounts master', name: 'accountsMaster' },
        { label: 'Payments', name: 'payments' },
        { label: 'Receipts', name: 'receipts' },
        { label: 'Contra', name: 'contra' },
        { label: 'Journals', name: 'journals' },
        { label: 'All vouchers', name: 'allVouchers' },
        { label: 'Trial balance', name: 'trialBalance' },
        { label: 'Final accounts', name: 'finalAccounts' },
        { label: 'Gst reports', name: 'gstReports' },
    ]

    function getGstReportsRange() {
        const gstReports = meta.current.gstReports
        let ret: any = {}
        if (gstReports.selectionMode === 'date') {
            ret.startDate = gstReports.startDate
            ret.endDate = gstReports.endDate
        } else {
            const qtr = +gstReports.quarter
            ret = getQtrRange(qtr)
        }
        return ret

        function getQtrRange(qtr: number) {
            const size = 3
            const monthYear = getstartMonthYear(qtr, size)
            const endMonth = monthYear.month + (size - 1)

            const startEndDate: any = {
                startDate: moment([monthYear.year, monthYear.month - 1])
                    .startOf('month')
                    .format('YYYY-MM-DD'), // Moment month is zero based, so compensate
                endDate: moment([monthYear.year, endMonth - 1])
                    .endOf('month')
                    .format('YYYY-MM-DD'),
            }
            return startEndDate

            function getstartMonthYear(qtr: number, size: number) {
                const baseDate = getFromBag('finYearObject').isoStartDate
                const baseMonth = +moment(baseDate).format('MM')
                let tempYear = +moment(baseDate).format('YYYY')

                let tempMonth = baseMonth + size * (qtr - 1)
                if (tempMonth > 12) {
                    tempMonth = tempMonth - 12
                    tempYear++
                }
                return { month: tempMonth, year: tempYear }
            }
        }
    }

    function getItems(name: any) {
        return [
            {
                label: 'Json',
                icon: 'pi pi-compass',
                command: async () => {
                    const dateFormat = getFromBag('dateFormat')
                    let options = {
                        name: name,
                        fileFormat: 'json',
                        dateFormat: dateFormat,
                        tranTypeId: tranTypeMap[name] || null,
                        no: null
                    }
                    if (name === 'gstReports') {
                        const dateRange = getGstReportsRange()
                        options = { ...options, ...dateRange }
                    }

                    await downloadFile(options)
                },
            },
            {
                label: 'CSV',
                icon: 'pi pi-chart-line',
                command: async () => {
                    const dateFormat = getFromBag('dateFormat')
                    let options = {
                        name: name,
                        fileFormat: 'csv',
                        dateFormat: dateFormat,
                        tranTypeId: tranTypeMap[name] || null,
                        no: null
                    }
                    if (name === 'gstReports') {
                        const dateRange = getGstReportsRange()
                        options = { ...options, ...dateRange }
                    }
                    await downloadFile(options)
                },
            },
            {
                label: 'xlsx',
                icon: 'pi pi-file-excel',
                command: async () => {
                    const dateFormat = getFromBag('dateFormat')
                    let options = {
                        name: name,
                        fileFormat: 'xlsx',
                        dateFormat: dateFormat,
                        tranTypeId: tranTypeMap[name] || null,
                        no: null
                    }
                    if (name === 'gstReports') {
                        const dateRange = getGstReportsRange()
                        options = { ...options, ...dateRange }
                    }
                    await downloadFile(options)
                },
            },
            {
                label: 'pdf',
                icon: 'pi pi-file-pdf',
                command: async () => {
                    alert('Not yet implemented')
                },
            },
        ]
    }


    return (
        <Grid item xs={12} md={9}>
            <Typography color='secondary' component='div' variant='subtitle1'>All exports </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell >Index</TableCell>
                            <TableCell >Label</TableCell>
                            <TableCell >Arguments</TableCell>
                            <TableCell >Exports</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getRows()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )

    function getRows() {
        const rows: any[] = data.map((item: any, index: number) => {
            const row: any = <TableRow key={index}>
                <TableCell><Typography>{index + 1}</Typography></TableCell>
                <TableCell><Typography>{item.label}</Typography></TableCell>
                <TableCell>
                    {(item.name === 'gstReports') ? <RangeControl /> : null}
                </TableCell>
                <TableCell>
                    <SplitButton
                        onClick={() => { onDefaultExportClick(item.name) }}
                        style={{ padding: '0.5rem' }}
                        disabled={isControlDisabled('doExports')}
                        label="Export"
                        icon="pi pi-download"
                        model={getItems(
                            item.name
                        )}></SplitButton>
                </TableCell>
            </TableRow>
            return (row)
        })
        return (rows)
    }

    async function onDefaultExportClick(name: any) {
        const dateFormat = getFromBag('dateFormat')
        let options = {
            name: name,
            fileFormat: 'xlsx',
            dateFormat: dateFormat,
            tranTypeId: tranTypeMap[name] || null,
            no: null
        }
        if (name === 'gstReports') {
            const dateRange = getGstReportsRange()
            options = { ...options, ...dateRange }
        }
        await downloadFile(options)
    }

    function RangeControl() {
        const gstReports = meta.current.gstReports
        const [, setRefresh] = useState({})
        return (
            <FormControl component="fieldset" variant='standard'>
                <RadioGroup style={{ display: 'flex', flexDirection: 'column' }}>
                    <DateSelect />
                    <QuarterSelect />
                </RadioGroup>
            </FormControl>
        )

        function DateSelect() {
            const [, setRefresh] = useState({})
            return (
                <div style={{ padding: '1rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
                    <FormControlLabel
                        control={
                            <Radio
                                color="secondary"
                                value="date"
                                checked={gstReports.selectionMode === 'date'}
                                onChange={handleChange}
                            />
                        }
                        label="Date select"
                    />
                    <TextField
                        style={{ marginLeft: '1rem' }}
                        variant='standard'
                        type="date"
                        disabled={gstReports.selectionMode !== 'date'}
                        onChange={(e) => {
                            gstReports.startDate = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        onFocus={(e) => e.target.select()}
                        label="Start date"
                        value={gstReports.startDate || ''}
                    />
                    <TextField
                        variant='standard'
                        disabled={gstReports.selectionMode !== 'date'}
                        style={{ marginLeft: '1rem' }}
                        type="date"
                        onChange={(e) => {
                            gstReports.endDate = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        onFocus={(e) => e.target.select()}
                        label="End date"
                        value={gstReports.endDate || ''}
                        placeholder="To date"
                    />
                </div>
            )
        }

        function handleChange(e: any) {
            gstReports.selectionMode = e.target.value
            meta.current.isMounted && setRefresh({})
        }

        function QuarterSelect() {
            const [, setRefresh] = useState({})
            return (
                <div style={{ padding: '1rem' }}>
                    <FormControlLabel
                        control={
                            <Radio
                                color="secondary"
                                value="qtr"
                                checked={gstReports.selectionMode !== 'date'}
                                onChange={handleChange}
                            />
                        }
                        label="Quarter select"
                    />
                    <RadioGroup>
                        <FormControlLabel
                            style={{ marginLeft: '1rem' }}
                            control={
                                <Radio
                                    value="1"
                                    disabled={
                                        gstReports.selectionMode === 'date'
                                    }
                                    checked={gstReports.quarter === '1'}
                                    onChange={handleChangeQtr}
                                />
                            }
                            label="Quarter 1"
                        />
                        <FormControlLabel
                            style={{ marginLeft: '1rem' }}
                            control={
                                <Radio
                                    value="2"
                                    disabled={
                                        gstReports.selectionMode === 'date'
                                    }
                                    checked={gstReports.quarter === '2'}
                                    onChange={handleChangeQtr}
                                />
                            }
                            label="Quarter 2"
                        />
                        <FormControlLabel
                            style={{ marginLeft: '1rem' }}
                            control={
                                <Radio
                                    value="3"
                                    disabled={
                                        gstReports.selectionMode === 'date'
                                    }
                                    checked={gstReports.quarter === '3'}
                                    onChange={handleChangeQtr}
                                />
                            }
                            label="Quarter 3"
                        />
                        <FormControlLabel
                            style={{ marginLeft: '1rem' }}
                            control={
                                <Radio
                                    disabled={
                                        gstReports.selectionMode === 'date'
                                    }
                                    value="4"
                                    checked={gstReports.quarter === '4'}
                                    onChange={handleChangeQtr}
                                />
                            }
                            label="Quarter 4"
                        />
                    </RadioGroup>
                </div>
            )
            function handleChangeQtr(e: any) {
                gstReports.quarter = e.target.value
                meta.current.isMounted && setRefresh({})
            }
        }
    }
}

export { GenericExports }