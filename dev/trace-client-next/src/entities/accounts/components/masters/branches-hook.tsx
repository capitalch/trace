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

function useBranches() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: '',
            tableName: 'BranchM',
            formId: 'trace-branch-master',
            ibukiFetchDataMessage:'BRANCHES-HOOK-FETCH-DATA',
            actions: () => {},
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
        const subs1 = filterOn('BRANCHES-HOOK-FETCH-DATA').subscribe(() => {
            emit(getXXGridParams().gridActionMessages.fetchIbukiMessage, null)
        })

        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            //edit
            const pre = meta.current.dialogConfig
            const { id, id1, branchName, branchCode } = d.data?.row
            meta.current.showDialog = true
            pre.isEditMode = true
            pre.title = 'Edit branch'
            // pre.formId = 'trace-branch-master'
            pre.id = id1
            pre.idInsert = undefined
            pre.codeBlock = undefined
            resetAllValidators(pre.formId)
            const jsonObj = JSON.parse(JSON.stringify(branchMasterJson))
            jsonObj.items[0].value = branchCode
            jsonObj.items[1].value = branchName
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
            pre.title = 'New branch'
            // pre.formId = 'trace-branch-master'
            pre.idInsert = true
            pre.codeBlock = 'create_branch'
            pre.id = undefined
            resetAllValidators(pre.formId)
            pre.content = getReactFormContent(JSON.stringify(branchMasterJson))
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
    }, [])

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
                headerName: 'Branch name',
                field: 'branchName',
                flex: 1, // to occupy whole space
            },
        ]

        const queryId = 'get_branches'
        const queryArgs = {}
        const summaryColNames: string[] = []
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-BRANCHES',
            editIbukiMessage: 'BRANCHES-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'BRANCHES-HOOK-XX-GRID-DELETE-CLICKED',
            addIbukiMessage: 'BRANCHES-HOOK-XX-GRID-ADD-BUTTON-CLICKED',
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

export { useBranches }

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

const branchMasterJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'branchCode',
            placeholder: 'Branch code',
            label: 'Branch code',
            validations: [
                {
                    name: 'required',
                    message: 'Branch code is required',
                },
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed inside branch code',
                },
            ],
        },
        {
            type: 'Text',
            name: 'branchName',
            placeholder: 'Branch name',
            label: 'Branch name',
            validations: [
                {
                    name: 'required',
                    message: 'Branch name is required',
                },
            ],
        },
    ],
}
