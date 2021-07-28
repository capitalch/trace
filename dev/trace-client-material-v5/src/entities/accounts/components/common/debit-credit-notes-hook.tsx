import { useState, useEffect, useRef } from 'react'
import {
// makeStyles, 
Theme
} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import { makeStyles } from '@material-ui/styles'
function useDebitCreditNotes() {
    const [, setRefresh] = useState({})
    useEffect(() => {
        meta.current.isMounted = true
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    const meta: any = useRef({
        isMounted: false,
        setRefresh: setRefresh,
        value: 0,
    })


    function handleOnChange(e: any, newValue: number) {
        meta.current.value = newValue
        meta.current.isMounted && setRefresh({})
    }

    return ({ handleOnChange, meta })
}

export { useDebitCreditNotes }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            color: theme.palette.common.white,
            backgroundColor: 'dodgerBlue',
        },

    })
)

export { useStyles }
