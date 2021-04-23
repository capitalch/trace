import React, { useState, useEffect, useRef } from 'react'
import {
    Toolbar, Typography
    , Button, IconButton,
    Avatar, useTheme, makeStyles, createStyles, Theme
    , TextField, InputAdornment
    // , Dialog
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'

function useTraceMaterialComponents() {
    const theme = useTheme()
    const classes = useStyles()
    const [, setRefresh] = useState({})

    function TraceFullWidthSubmitButton({ onClick }: any) {
        const btn = <Button
            fullWidth
            variant='contained'
            startIcon={<SaveIcon></SaveIcon>}
            // className={classes.submitButtonStyle}
            color='primary'
            onClick={onClick}
        >Submit123</Button>
        return btn
    }

    function TraceCancelButton({ onClick }: any) {
        const btn = <Button
            variant='contained'
            className={classes.cancelButtonStyle}
            color='secondary'
            startIcon={<CancelIcon></CancelIcon>}
            onClick={onClick}
        >Cancel</Button>
        return btn
    }

    function traceGlobalSearch({ meta, isMediumSizeUp }: any) {
        return <TextField
            // className={classes.searchField}
            id="global-search-field"
            value={meta.current.globalFilter}
            placeholder='Global search'
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton size='small' onClick={(e: any) => {
                            meta.current.globalFilter = ''
                            meta.current.isMounted && setRefresh({})
                        }}>
                            {/* don't show icon when less than medium device */}
                            {(isMediumSizeUp) && <CloseIcon></CloseIcon>}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            onChange={(e: any) => {
                meta.current.globalFilter = e.target.value
                meta.current.isMounted && setRefresh({})
            }}
        ></TextField>
    }

    return {
        TraceFullWidthSubmitButton, TraceCancelButton, traceGlobalSearch
        // , TraceGlobalSearch 
    }

}

export { useTraceMaterialComponents }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        submitButtonStyle: {
            // backgroundColor: theme.palette.success.main,
            // marginLeft: theme.spacing(2),
            // marginTop: -theme.spacing(1),
            // marginRight: theme.spacing(2),
            // padding: theme.spacing(2),
        },
        cancelButtonStyle: {
            backgroundColor: theme.palette.warning.main,
            marginTop: -theme.spacing(1)
        },
        // searchField: {
        //     float: 'right'
        // }
    })
)

// e => {
//     value = e.target.value
//     meta.current.isMounted && setRefresh({})
// }