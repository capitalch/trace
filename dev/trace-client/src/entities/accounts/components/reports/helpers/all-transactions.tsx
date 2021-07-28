import { useSharedElements } from '../../common/shared-elements-hook'
import { utilMethods } from '../../../../../common-utils/util-methods'

function AllTransactions() {
    const { AddIcon, Box, emit, getFromBag, NativeSelect, setInBag, Typography, } = useSharedElements()
    const { execGenericView, toDecimalFormat } = utilMethods()
    const dateFormat = getFromBag('dateFormat')
    const columns = [
        { headerName: 'Index', field: 'index', width: 20 },
        { headerName: 'Id', field: 'id', width: 20 },
        { headerName: 'Date', field: 'tranDate' },
        { headerName: 'Ref no', field: 'autoRefNo' },
        { headerName: 'Account', field: 'accName' },
        {
            headerName: 'Debit',
            field: 'debit',
            type: 'number',
            // render: (rowData: any) => toDecimalFormat(rowData.debit),
        },
        {
            headerName: 'Credit',
            field: 'credit',
            type: 'number',
            // render: (rowData: any) => toDecimalFormat(rowData.credit),
        },

        { headerName: 'Instr no', field: 'instrNo' },
        { headerName: 'User ref no', field: 'userRefNo' },
        { headerName: 'Remarks', field: 'remarks' },
        { headerName: 'Line ref no', field: 'lineRefNo' },
        { headerName: 'Line remarks', field: 'lineRemarks' },
    ]

    async function getRows(){
        emit('SHOW-LOADING-INDICATOR', true)

            const ret = await execGenericView({
                isMultipleRows: true,
                sqlKey: 'get_allTransactions',
                args: {
                    dateFormat: dateFormat,
                    no: 10 //(getFromBag('allTrans') ?? meta.current.no) || null,
                },
                // entityName: entityName,
            })
            emit('SHOW-LOADING-INDICATOR', false)
    }

    return { columns }

}

export { AllTransactions }