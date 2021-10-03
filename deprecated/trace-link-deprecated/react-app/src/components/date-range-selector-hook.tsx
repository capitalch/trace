import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../shared-elements-hook'
import { useSqlAnywhere } from '../utils/sql-anywhere-hook'
import { ContactSupportOutlined } from '@material-ui/icons'

function useDateRangeSelector(arbitraryDataCurrent: any) {
    const [, setRefresh] = useState({})
    const isoDateFormat = 'YYYY-MM-DD'
    const {
        _,
        Checkbox,
        CloseIcon,
        config,
        confirm,
        DataTable,
        emit,
        filterOn,
        FormControlLabel,
        IconButton,
        InputAdornment,
        messages,
        moment,
        Paper,
        Radio,
        RadioGroup,
        SearchIcon,
        TextField,
        toDecimalFormat,
        Typography,
    } = useSharedElements()

    const { execSql } = useSqlAnywhere('service')

    useEffect(() => {
        meta.current.isMounted = true
        arbitraryDataCurrent.finYear = getFinYearOnCurrentDate()
        setStartEndDateAsCurrentDate()
        fetchTargetCompanyId()
        setRefresh({})
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        selectedFinYear: moment().year(),
        selectionMode: 'date',
        quarter: '1',
        targetDatabase: '',
    })

    async function fetchTargetCompanyId() {
        try {
            const result:any = await execSql('service-get-company-id', [])
            if (Array.isArray(result) && result.length > 0) {
                const companyId = result[0].company_id
                if (companyId) {
                    arbitraryDataCurrent.companyId = companyId
                    meta.current.targetDatabase =
                        config.service.mapping[companyId]['name']
                    
                    meta.current.isMounted && setRefresh({})
                }
            }
        } catch (e) {
            alert(e.message)
        }
    }

    function getFinYearOnCurrentDate() {
        const currMonth = moment().month()
        const currYear = moment().year()
        let finYear = 0
        if (currMonth > 3 && currMonth <= 12) {
            finYear = currYear
        } else {
            finYear = currYear - 1
        }
        return finYear
    }

    function handleChange(e: any) {
        meta.current.selectionMode = e.target.value
        meta.current.isMounted && setRefresh({})
    }
    function setStartEndDateAsCurrentDate() {
        arbitraryDataCurrent.startDate = moment().format(isoDateFormat)
        arbitraryDataCurrent.endDate = moment().format(isoDateFormat)
        emit('IMPORT-SERVICE-SALE-HOOK-REFRESH', null)
    }

    function SelectDate() {
        const [,setRefresh] = useState({})
        function reset() {
            arbitraryDataCurrent.startDate = moment().format(isoDateFormat)
            arbitraryDataCurrent.endDate = moment().format(isoDateFormat)
            emit('IMPORT-SERVICE-SALE-HOOK-REFRESH', null)
        }
        return (
            <span className="date-select" style={{ fontSize: '0.8rem' }}>
                <FormControlLabel
                    control={
                        <Radio
                            color="secondary"
                            value="date"
                            checked={meta.current.selectionMode === 'date'}
                            onClick={reset}
                            onChange={handleChange}
                        />
                    }
                    label="Select date"
                />
                <TextField
                    className="date-control"
                    type="date"
                    disabled={meta.current.selectionMode !== 'date'}
                    onChange={(e) => {
                        arbitraryDataCurrent.startDate = e.target.value
                        meta.current.isMounted && setRefresh({})
                        emit('IMPORT-SERVICE-SALE-HOOK-REFRESH', null)
                    }}
                    // onFocus={(e) => e.target.select()}
                    label='Start date' // {arbitraryDataCurrent.startDate ? 'Start date' : ''}
                    value={arbitraryDataCurrent.startDate || ''}
                />
                <TextField
                    className="date-control"
                    disabled={meta.current.selectionMode !== 'date'}
                    type="date"
                    onChange={(e) => {
                        arbitraryDataCurrent.endDate = e.target.value
                        meta.current.isMounted && setRefresh({})
                        emit('IMPORT-SERVICE-SALE-HOOK-REFRESH', null)
                    }}
                    onFocus={(e) => e.target.select()}
                    label= 'End date' // {arbitraryDataCurrent.endDate ? 'End date' : ''}
                    value={arbitraryDataCurrent.endDate || ''}
                />
            </span>
        )
    }

    function getFinYearOptions() {
        let index = 0
        function getIndex() {
            return index++
        }
        const arr = Object.entries(finYears).map(([key, value]: any) => {
            return (
                <option key={getIndex()} value={key}>
                    {value}
                </option>
            )
        })
        return arr
    }

    function SelectQuarter() {
        function reset() {
            const finYear = arbitraryDataCurrent.finYear
            arbitraryDataCurrent.startDate = `${finYear}-04-01`
            arbitraryDataCurrent.endDate = `${finYear}-06-30`
            meta.current.quarter = '1'
            setRefresh({})
        }

        return (
            <span className="quarter-select">
                <FormControlLabel
                    control={
                        <Radio
                            color="secondary"
                            value="qtr"
                            checked={meta.current.selectionMode === 'qtr'}
                            onClick={reset}
                            onChange={handleChange}
                        />
                    }
                    label="Select quarter"
                />
                <RadioGroup>
                    <FormControlLabel
                        style={{ marginLeft: '1rem' }}
                        control={
                            <Radio
                                value="1"
                                disabled={meta.current.selectionMode !== 'qtr'}
                                checked={meta.current.quarter === '1'}
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
                                disabled={meta.current.selectionMode !== 'qtr'}
                                checked={meta.current.quarter === '2'}
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
                                disabled={meta.current.selectionMode !== 'qtr'}
                                checked={meta.current.quarter === '3'}
                                onChange={handleChangeQtr}
                            />
                        }
                        label="Quarter 3"
                    />
                    <FormControlLabel
                        style={{ marginLeft: '1rem' }}
                        control={
                            <Radio
                                disabled={meta.current.selectionMode !== 'qtr'}
                                value="4"
                                checked={meta.current.quarter === '4'}
                                onChange={handleChangeQtr}
                            />
                        }
                        label="Quarter 4"
                    />
                </RadioGroup>
            </span>
        )
        function handleChangeQtr(e: any) {
            meta.current.quarter = e.target.value
            setStartEndDateOnQtr()
            meta.current.isMounted && setRefresh({})
            emit('IMPORT-SERVICE-SALE-HOOK-REFRESH', null)
        }
        function setStartEndDateOnQtr() {
            const finYear = arbitraryDataCurrent.finYear
            if (meta.current.quarter === '1') {
                arbitraryDataCurrent.startDate = `${finYear}-04-01`
                arbitraryDataCurrent.endDate = `${finYear}-06-30`
            } else if (meta.current.quarter === '2') {
                arbitraryDataCurrent.startDate = `${finYear}-07-01`
                arbitraryDataCurrent.endDate = `${finYear}-09-30`
            } else if (meta.current.quarter === '3') {
                arbitraryDataCurrent.startDate = `${finYear}-10-01`
                arbitraryDataCurrent.endDate = `${finYear}-12-31`
            } else if (meta.current.quarter === '4') {
                arbitraryDataCurrent.startDate = `${(+finYear) + 1}-01-01`
                arbitraryDataCurrent.endDate = `${(+finYear) + 1}-03-31`
            }
        }
    }

    function SelectYear() {
        return (
            <FormControlLabel
                className="year-select"
                control={
                    <Radio
                        color="secondary"
                        value="year"
                        checked={meta.current.selectionMode === 'year'}
                        onChange={(e) => {
                            setStartEndDateOnFinYear()
                            handleChange(e)
                        }}
                    />
                }
                label="Select whole year"
            />
        )        
    }
    // Outside the above block because it is shared
    function setStartEndDateOnFinYear() {
        const finYear = +arbitraryDataCurrent.finYear
        arbitraryDataCurrent.startDate = `${finYear}-04-01`
        arbitraryDataCurrent.endDate = `${finYear + 1}-03-31`
        emit('IMPORT-SERVICE-SALE-HOOK-REFRESH', null)
    }

    return {
        getFinYearOptions,
        meta,
        SelectDate,
        SelectQuarter,
        SelectYear,
        setRefresh,
        setStartEndDateOnFinYear,
    }
}

export { useDateRangeSelector }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            display: 'flex',
            flexDirection: 'column',

            '& .fin-year-container': {
                display: 'flex',
                marginTop: '1.5rem',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: '2rem',
                border: '1px solid grey',
                padding: '1rem',
                justifyContent: 'space-between',
                '& .fin-year-select': {
                    height: '2.0rem',
                    fontSize: '0.9rem',
                    width: '12rem',
                },
                '& .overwrite-existing-data': {
                    marginLeft: '1rem',
                },
            },
            '& .select-container': {
                marginLeft: '2rem',
                border: '1px solid grey',
                padding: '1rem',
                marginTop: '1rem',
                '& .date-select': {
                    marginTop: '1.5rem',
                    display: 'flex',
                    columnGap: '1rem',
                    '& .date-control': {
                        marginBottom: '2.2rem',
                    },
                },
                '& .quarter-select': {
                    // marginTop: '0.5rem',
                },
                '& .year-select': {
                    marginTop: '1rem',
                },
            },
        },
    })
)

export { useStyles }

const finYears: any = {
    0: '---select---',
    2020: '01/04/2020 - 31/03/2021',
    2021: '01/04/2021 - 31/03/2022',
    2022: '01/04/2022 - 31/03/2023',
    2023: '01/04/2023 - 31/03/2024',
    2024: '01/04/2024 - 31/03/2025',
    2025: '01/04/2025 - 31/03/2026',
    2026: '01/04/2026 - 31/03/2027',
    2027: '01/04/2027 - 31/03/2028',
    2028: '01/04/2028 - 31/03/2029',
    2029: '01/04/2029 - 31/03/2030',
    2030: '01/04/2030 - 31/03/2031',
    2031: '01/04/2031 - 31/03/2032',
    2032: '01/04/2032 - 31/03/2033',
    2033: '01/04/2033 - 31/03/2034',
    2034: '01/04/2034 - 31/03/2035',
    2035: '01/04/2035 - 31/03/2036',
    2036: '01/04/2036 - 31/03/2037',
    2037: '01/04/2037 - 31/03/2038',
    2038: '01/04/2038 - 31/03/2039',
    2039: '01/04/2039 - 31/03/2040',
    2040: '01/04/2040 - 31/03/2041',
}
