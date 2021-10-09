import { useRef } from '../../../../imports/regular-imports'
import { makeStyles, Theme, createStyles } from '../../../../imports/gui-imports'
import { useSharedElements } from '../shared/shared-elements-hook'

function useProductsMaster() {
    const meta:any = useRef({
        data: [],
        isMounted: false,
        no: 10,
        title: 'Products',
        showDialog: false,
        dialogConfig: {
            brands: null,
            categories: null,
            formId: '',
            title: '',
            content: () => { },
            actions: () => { },
            units: null
        }
    })

    const {
        getFromBag,
        setInBag
    } = useSharedElements()

    function utilFunc() {
        function saveScrollPos() {
            const scrollPos = window.pageYOffset
            setInBag('xxx', scrollPos)
        }

        function applyScrollPos() {
            const scrollPos = getFromBag('xxx')
            window.scrollTo(0, scrollPos || 0)
        }
        return { saveScrollPos, applyScrollPos }
    }

    return { meta, utilFunc }
}

export { useProductsMaster }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            minWidth: '64rem',
            '& .delete-button': {
                color: theme.palette.error.main
            },
            '& .add-button': {
                color: theme.palette.blue.main,
            },
            '& .refresh-button': {
                color: theme.palette.secondary.main
            }
        },

        dialog: {
            
        },

    })
)

export { useStyles }
