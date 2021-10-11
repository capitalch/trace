import {  useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function useBrandsMaster() {
    const meta:any = useRef({
        data: [],
        isMounted: false,
        isLoading: false,
        title: 'Brands',
        isExpandAll: false,
        showDialog: false,
        dialogConfig: {
            formId: '',
            title: '',
            content: () => { },
            actions: () => { }
        }
    })

    const {
        getFromBag,
        setInBag
    } = useSharedElements()

    function utilFunc() {
        function saveScrollPos() {
            const scrollPos = window.pageYOffset
            setInBag('categories', scrollPos)
        }

        function applyScrollPos() {
            const scrollPos = getFromBag('categories')
            window.scrollTo(0, scrollPos || 0)
        }
        return { saveScrollPos, applyScrollPos }
    }

    return { meta, utilFunc }
}

export { useBrandsMaster }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            '& .add-icon': {
                color: theme.palette.lightBlue.main,
                fontSize: '2.0rem'
            },
            '& .refresh-icon': {
                color: theme.palette.secondary.main,
                fontSize: '1.7rem'
            }
        },

        dialog: {

        },

    })
)

export { useStyles }