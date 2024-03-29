import {
    Add, Box, Button, DataGridPro, DeleteForever, Edit, Grid, IconButton, IMegaData, Link, MegaDataContext, PrimeColumn,
    Switch, SyncSharp, TreeTable, Typography, useContext, useRef, useState, useSharedElements, useTheme, useTraceMaterialComponents,
} from './redirect'
import { makeStyles, Theme, createStyles} from '../../../../imports/gui-imports'
import { HsnLeafCategories } from './hsn-leaf-categories'
import { ManageTags } from './categories-manage-tags'

function useCategoriesMaster() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const category = megaData.accounts.inventory.category
    const theme = useTheme()
    const meta: any = useRef({
        isMounted: false,
        allKeys: [],
        data: [],
        globalFilter: '',
        showDialog: false,
        dialogConfig: {
            title: '',
            formId: '',
            content: () => <></>,
            actions: () => { },
            isSearchBox: false,
            searchBoxFilter: '',
        },
        headerConfig: {
            title: 'Item categories'
        },
    })
    const pre = meta.current
    const {
        getFromBag,
        setInBag
    } = useSharedElements()

    function handleHsnLeafCategories() {
        pre.showDialog = true
        pre.dialogConfig.title = 'Hsn for leaf categories'
        pre.dialogConfig.content = HsnLeafCategories
        pre.dialogConfig.isSearchBox = false
        setRefresh({})
    }

    function handleManageTags() {
        pre.showDialog = true
        pre.dialogConfig.title = 'Manage tags'
        pre.dialogConfig.content = ManageTags
        pre.dialogConfig.isSearchBox = false
        setRefresh({})
    }

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

    return { handleHsnLeafCategories, handleManageTags, meta, utilFunc }
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