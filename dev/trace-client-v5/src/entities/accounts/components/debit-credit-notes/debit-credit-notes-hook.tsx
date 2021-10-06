import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@mui/material'
import { useSharedElements } from '../../../authentication/components/shared-elements-hook'

function useDebitCreditNotes(drillDownEditAttributes:any = {}) {
    const [, setRefresh] = useState({})
    const {_, emit} = useSharedElements()
    const meta: any = useRef({
        isMounted: false,
        setRefresh: setRefresh,
        value: 0,
    })
    useEffect(() => {
        meta.current.isMounted = true
        if (drillDownEditAttributes && (!_.isEmpty(drillDownEditAttributes))) {
            // showChildDialog is used to prevent firing of message when child dialog is being closed. Otherwise the message is fired and unnecessary loading is done
            drillDownEditAttributes.showChildDialog && emit('DEBIT-CREDIT-NOTES-VIEW-HOOK-LOAD-DATA', drillDownEditAttributes.tranHeaderId)
            meta.current.shouldCloseParentOnSave = true
        }    
        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    


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
