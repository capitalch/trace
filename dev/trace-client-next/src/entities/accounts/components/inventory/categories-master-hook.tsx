import  { useRef } from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { makeStyles, Theme, createStyles } from '../../../../imports/gui-imports'

function useCategoriesMaster() {
    const meta: any = useRef({
        isMounted: false,
        allKeys: [],
        data: [],
        globalFilter: '',
        showDialog: false,
        dialogConfig: {
            title: '',
            formId:'',
            content: () => { },
            actions: () => { },
            isSearchBox: false,
            searchBoxFilter: '',
        },
        headerConfig: {
            title: 'Item categories'
        },
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

export { useCategoriesMaster }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            minWidth: '45rem',
            '& .header': {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing(1),               
            },

            '& .add-category': {
                backgroundColor: theme.palette.indigo.main,
                color: theme.palette.common.white
            },

            '& .delete-category': {
                color: theme.palette.error.main
            },

            '& .change-parent': {
                backgroundColor: theme.palette.indigo.main,
                color: theme.palette.common.white
            },

            '& .MuiButtonBase-root': {
                marginBottom: theme.spacing(0.5)
            },

            '& .min-width-10rem': {
                minWidth: '10rem'
            }

        },

        dialog: {            

            '& .dialogTitle': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0px',
            },

            '& .MuiInputBase-root': {
                width: theme.spacing(50),
                marginBottom: theme.spacing(2)
            },

            '& .select-parent': {
                minWidth: '30rem',
                maxHeight: '60vh'
            }
        },
    })
)

export { useStyles }