import {
    useRef,
    useState,
    useEffect,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { useCrudUtils } from '../common/crud-utils-hook'

function useBrands() {
    const [, setRefresh] = useState({})
    const FETCH_DATA_MESSAGE = 'BRANDS-HOOK-FETCH-DATA'
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: '',
            tableName: 'BrandM',
            formId: 'trace-brand-master',
            ibukiFetchDataMessage: FETCH_DATA_MESSAGE,
            actions: () => { },
            content: () => <></>,
        },
        setRefresh: setRefresh,
    })
    const {
        getReactFormContent,
        handleCloseDialog,
        handleDelete,
        handleSubmit,
    } = useCrudUtils(meta)

    const {
        emit,
        filterOn,
        manageFormsState,
        TraceFullWidthSubmitButton,
    } = useSharedElements()
    const { resetAllValidators, } =
        manageFormsState()

    useEffect(() => {
        const subs1 = filterOn(FETCH_DATA_MESSAGE).subscribe(() => {
            emit(getXXGridParams().gridActionMessages.fetchIbukiMessage, null)
        })

        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            //edit
            const pre = meta.current.dialogConfig
            const { id1, brandName, remarks } = d.data?.row
            meta.current.showDialog = true
            pre.isEditMode = true
            pre.title = 'Edit brand'
            pre.id = id1
            pre.idInsert = undefined
            pre.codeBlock = undefined
            resetAllValidators(pre.formId)
            const jsonObj = JSON.parse(JSON.stringify(brandMasterJson))
            jsonObj.items[0].value = brandName
            jsonObj.items[1].value = remarks
            pre.content = getReactFormContent(JSON.stringify(jsonObj))
            pre.actions = () => (
                <TraceFullWidthSubmitButton onClick={handleSubmit} />
            )
            setRefresh({})
        })

        const subs3 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            //delete
            const { id1 } = d.data?.row
            handleDelete(id1)
        })

        const subs4 = filterOn(
            getXXGridParams().gridActionMessages.addIbukiMessage
        ).subscribe((d: any) => {
            //Add
            const pre = meta.current.dialogConfig
            meta.current.showDialog = true
            pre.isEditMode = false
            pre.title = 'New brand'
            pre.id = undefined
            resetAllValidators(pre.formId)
            pre.content = getReactFormContent(JSON.stringify(brandMasterJson))
            pre.actions = () => (
                <TraceFullWidthSubmitButton onClick={handleSubmit} />
            )
            setRefresh({})
        })

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [TraceFullWidthSubmitButton, emit, filterOn, getReactFormContent, handleDelete, handleSubmit, resetAllValidators])

    function getXXGridParams() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 80,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                width: 90,
            },
            {
                headerName: 'Brand name',
                field: 'brandName',
                flex: 1, // to occupy whole space
            },
            {
                headerName: 'Remarks',
                field: 'remarks',
                flex: 1, // to occupy whole space
            },
        ]

        const queryId = 'get_brands'
        const queryArgs = {}
        const summaryColNames: string[] = []
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-BRANDS',
            editIbukiMessage: 'BRANDS-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'BRANDS-HOOK-XX-GRID-DELETE-CLICKED',
            addIbukiMessage: 'BRANDS-HOOK-XX-GRID-ADD-BUTTON-CLICKED',
        }

        return {
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }

    return { getXXGridParams, handleCloseDialog, meta }
}

export { useBrands }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 245px)',
            width: '100%',
            marginTop: '5px',
            '& .xx-grid': {
                marginTop: theme.spacing(1),
            },
        },
    })
)
export { useStyles }

const brandMasterJson: any = {
    "class": "generic-dialog",
    "style": { width: '100%' },
    "items": [
        {
            "type": "Text",
            "name": "brandName",
            "label": "Brand name",
            "validations": [{
                "name": "required",
                "message": "Brand name is required"
            }]
        },
        {
            "type": "Text",
            "name": "remarks",
            "label": "Remarks",
        },
    ]
}