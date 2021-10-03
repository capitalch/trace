import { Checkbox, FormControlLabel } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import { useSharedElements } from '../shared-elements-hook'
import { useDateRangeSelector, useStyles } from './date-range-selector-hook'

function DateRangeSelector({ arbitraryDataCurrent }: any) {
    const classes = useStyles()
    const {
        getFinYearOptions,
        meta,  
        SelectDate,
        SelectQuarter,
        SelectYear,                     
        setRefresh,
        setStartEndDateOnFinYear,
    } = useDateRangeSelector(arbitraryDataCurrent)

    const {
        _,
        Button,
        CloseIcon,
        confirm,
        DataTable,
        emit,
        FormControl,
        FormControlLabel,
        IconButton,
        InputAdornment,
        messages,
        moment,
        Paper,
        RadioGroup,
        SearchIcon,
        TextField,
        toDecimalFormat,
        Typography,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <div className="fin-year-container">
                <div>
                    <Typography>Select financial year</Typography>
                    <select
                        className="fin-year-select"
                        onChange={(e: any) => {                            
                            arbitraryDataCurrent.finYear = e.target.value
                            meta.current.selectionMode = 'year'
                            setStartEndDateOnFinYear()
                            meta.current.isMounted && setRefresh({})
                        }}
                        value={arbitraryDataCurrent.finYear}>
                        {getFinYearOptions()}
                    </select>
                </div>
                <div>
                    <span>Data transfer to: {' '}</span>
                    <span><b>{meta.current.targetDatabase}</b></span>
                </div>
                <div></div>
                {/* <FormControlLabel
                    className="overwrite-existing-data"
                    control={
                        <Checkbox
                            checked={arbitraryDataCurrent.isOverwriteData}
                            onChange={(e: any) => {
                                arbitraryDataCurrent.isOverwriteData = e.target.checked
                                meta.current.isMounted && setRefresh({})
                            }}
                            value={arbitraryDataCurrent.isOverwriteData || false}
                        />
                    }
                    color="secondary"
                    label="Overwrite existing data"
                /> */}
            </div>
            <FormControl component="fieldset" className="select-container">
                <RadioGroup>
                    <SelectDate />
                    <SelectQuarter />
                    <SelectYear />
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export { DateRangeSelector }

{
    /* */
}
