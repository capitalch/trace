import { usingDataViewColumns } from './data-view-columns'
const { paymentColumns } = usingDataViewColumns()
const dataViewColumns:any = {
    payments: paymentColumns
}

export {dataViewColumns}