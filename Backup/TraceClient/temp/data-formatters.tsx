import { utilMethods } from '../../../../common-utils/util-methods'
const { toDecimalFormat } = utilMethods()
const dataFormatters:any = {
    payments: (raw:any[])=>{
        return raw.map((x:any) => {
            const formattedResult: any =
                { ...x, debits: toDecimalFormat(x.debits), credits: toDecimalFormat(x.credits) }
            return (formattedResult)
        })
    }
}

export {dataFormatters}