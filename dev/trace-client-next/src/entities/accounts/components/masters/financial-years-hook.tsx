import {
    moment,
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

function useFinancialYears() {
    const [, setRefresh] = useState({})
    const FINANCIAL_YEARS_FETCH_DATA = 'FINANCIAL-YEARS-HOOK-FETCH-DATA'
    const isoDateFormat = 'YYYY-MM-DD'
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: '',
            formId: 'trace-financial-year-master',
            ibukiFetchDataMessage: FINANCIAL_YEARS_FETCH_DATA,
            tableName: 'FinYearM',
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
        getFromBag,
        manageFormsState,
        TraceFullWidthSubmitButton,
    } = useSharedElements()

    const { getFormData, resetAllValidators } = manageFormsState()
    const dateFormat = getFromBag('dateFormat')

    useEffect(() => {
        const subs1 = filterOn(FINANCIAL_YEARS_FETCH_DATA).subscribe(
            () => {
                emit(
                    getXXGridParams().gridActionMessages.fetchIbukiMessage,
                    null
                )
            }
        )

        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            //edit
            const pre = meta.current.dialogConfig
            const { id1, startDate, endDate } = d.data?.row
            meta.current.showDialog = true
            pre.isEditMode = true
            pre.title = 'Edit financial year'
            pre.id = id1
            pre.idInsert = undefined
            pre.codeBlock = undefined
            resetAllValidators(pre.formId)
            const jsonObj = JSON.parse(JSON.stringify(finYearMasterJson))
            jsonObj.items[0].value = id1
            jsonObj.items[1].value = moment(startDate, isoDateFormat).format(dateFormat)
            jsonObj.items[2].value = moment(endDate, isoDateFormat).format(dateFormat)
            pre.content = getReactFormContent(JSON.stringify(jsonObj))
            pre.actions = () => (
                <TraceFullWidthSubmitButton onClick={handlePreSubmit} />
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
            pre.title = 'New financial year'
            pre.idInsert = true
            pre.id = undefined
            resetAllValidators(pre.formId)
            pre.content = getReactFormContent(JSON.stringify(finYearMasterJson))
            pre.actions = () => (
                <TraceFullWidthSubmitButton onClick={handlePreSubmit} />
            )
            setRefresh({})
        })

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
            subs4.unsubscribe()
        }
    }, [dateFormat])

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
                headerName: 'Financial year',
                description: 'Financial year',
                field: 'id1',
                flex: 1,
            },
            {
                headerName: 'Start date',
                field: 'startDate',
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format(dateFormat),
                flex: 1,
            },
            {
                headerName: 'End date',
                field: 'endDate',
                type: 'date',
                valueFormatter: (params: any) =>
                    moment(params.value).format(dateFormat),
                flex: 1,
            },
        ]

        const queryId = 'get_finYears'
        const queryArgs = {}
        const summaryColNames: string[] = []
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-FINANCIAL-YEARS',
            editIbukiMessage: 'FINANCIAL-YEARS-HOOK-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'FINANCIAL-YEARS-HOOK-XX-GRID-DELETE-CLICKED',
            addIbukiMessage: 'FINANCIAL-YEARS-HOOK-XX-GRID-ADD-BUTTON-CLICKED',
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

    function handlePreSubmit() {
        const pre = meta.current.dialogConfig
        const formId = pre.formId
        const formData = getFormData(formId)
        formData['startDate'] = moment(formData['startDate'], dateFormat).format(
            isoDateFormat
        )
        formData['endDate'] = moment(formData['endDate'], dateFormat).format(isoDateFormat)
        handleSubmit(null, formData)
    }

    return { getXXGridParams, handleCloseDialog, meta }
}

export { useFinancialYears }

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

const finYearMasterJson: any = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'id',
            placeholder: 'Financial year',
            label: 'Financial year',
            validations: [
                {
                    name: 'required',
                    message: 'Financial year is required',
                },
                {
                    name: 'noWhiteSpaceOrSpecialChar',
                    message:
                        'White space or special characters are not allowed inside entity name',
                },
                {
                    name: 'yearOnly',
                    message: 'Only valid numeric years are allowed',
                },
            ],
        },
        {
            type: 'DateMask',
            name: 'startDate',
            placeholder: 'Start date',
            label: 'Start date',
            validations: [
                {
                    name: 'required',
                    message: 'Start date is required',
                },
            ],
        },
        {
            type: 'DateMask',
            name: 'endDate',
            placeholder: 'End date',
            label: 'End date',
            validations: [
                {
                    name: 'required',
                    message: 'End date is required',
                },
            ],
        },
    ],
}
