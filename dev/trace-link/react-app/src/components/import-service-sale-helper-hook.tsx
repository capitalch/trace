import { useSharedElements } from '../shared-elements-hook'
import sampleServiceData from './sampleServiceData.json'

function useImportServiceSaleHelper() {
    const { axios, config, emit, messages, useSqlAnywhere } =
        useSharedElements()
    const { execSql } = useSqlAnywhere('service')
    
    async function prepareData(meta: any, arbitraryDataCurrent: any) {
        try {
            let result = await execSql('service-get-sale-receipts', [
                arbitraryDataCurrent.startDate,
                arbitraryDataCurrent.endDate,
            ])
            result = result || sampleServiceData
            if (result && Array.isArray(result)) {
                meta.current.status1 = 'Data successfully fetched from Service+'
                meta.current.serviceData = result
                meta.current.status2 = String(result.length).concat(
                    ' ',
                    'rows fetched from Service+'
                )
                if (result.length > 0) {
                    meta.current.isDisabledTansferButton = false
                    meta.current.setRefresh({})
                } else {
                    alert(messages.errNoDatafetched)
                }
            } else {
                meta.current.status1 = 'Error in fetching data from Service+'
            }
            meta.current.status3 = ''
            meta.current.closeButtonDisabled = true
            meta.current.setRefresh({})
        } catch (e) {
            alert(e.message || messages.errTransferData)
        }
    }

    async function processAndMoveData(arbitraryDataCurrent: any, meta: any) {
        try {
            meta.current.isDisabledTansferButton = true
            meta.current.setRefresh({})
            const currentEnv = config.env
            const baseUrl = config[currentEnv]?.url
            const serviceUrlForIds = baseUrl.concat(
                '/',
                config['service']['urlForCashSaleIds']
            )
            const companyId = arbitraryDataCurrent.companyId || 'nav'
            const pre = config.service.mapping[companyId]

            if (pre) {
                const { saleAccountId, cashAccountId }: any =
                    await getAccountIds(pre, serviceUrlForIds)
                if (saleAccountId && cashAccountId) {
                    const temp = reShape(
                        meta.current.serviceData,
                        saleAccountId,
                        cashAccountId,
                        companyId
                    )

                    let payload: any = {
                        meta: {
                            dbName: pre.database,
                            buCode: pre.name,
                            branchId: 1,
                            finYearId: arbitraryDataCurrent.finYear,
                            pointId: meta.current.pointId,
                        },
                        data: temp,
                    }
                    payload = escape(JSON.stringify(payload))

                    const serviceUrl = baseUrl.concat(
                        '/',
                        config['service']['urlForImportServiceSale']
                    )
                    const out = await axios({
                        url: serviceUrl,
                        data: payload,
                        method: 'post',
                        headers: {
                            'Content-Type': 'text/html',
                        },
                    })
                    meta.current.status3 =
                        messages.infoDataSuccessfullyTransferred
                    meta.current.closeButtonDisabled = false
                    meta.current.setRefresh({})
                    // console.log(out)
                }
            } else {
                alert(messages.errCompanyNotFound)
            }
        } catch (e) {
            alert(e.message)
        } finally {
            // emit('SHOW-LOADING-INDICATOR', false)
        }

        async function getAccountIds(pre: any, serviceUrlForIds: string) {
            const database = pre.database
            const schema = pre.name
            const cashAccountCode = pre.cashAccountCode
            const saleAccountCode = pre.saleAccountCode
            const args = {
                database,
                schema,
                cashAccountCode,
                saleAccountCode,
            }
            const result: any = await axios({
                method: 'post',
                data: args,
                url: serviceUrlForIds,
            })
            return result.data
        }

        function reShape(
            data: any[],
            saleId: number,
            cashId: number,
            companyId: string
        ) {
            const data1 = data.map((source: any) => {
                source.finYear = arbitraryDataCurrent.finYear
                source.headerRemarks = 'Service+ job no: '
                source.saleId = saleId
                source.cashId = cashId
                source.gstRate = config.service.mapping[companyId].gstRate
                source.hsn = config.service.mapping[companyId].hsn
                const amount = source.rec_amt
                const gstRate = source.gstRate
                const gst = (amount * (gstRate / 100)) / (1 + gstRate / 100)
                source.cgst = (gst / 2).toFixed(2)
                source.sgst = source.cgst
                source.igst = 0
                source.productId = config.service.mapping[companyId].productId
                const newData: any = getReShapedData(source)
                const j = JSON.parse(newData)
                return j
            })
            return data1
        }
    }
    return { prepareData, processAndMoveData }

    function getReShapedData(obj: any) {
        return `{
            "tableName": "TranH",
            "data": [{
                "tranDate": "${obj.rec_date}",
                "jData": null,
                "finYearId": ${obj.finYear},
                "remarks": "${obj.headerRemarks.concat(obj.job_no)}",
                "userRefNo": "${obj.rec_no}",
                "branchId": 1,
                "posId": "1",
                "tranTypeId": 4,
                "details": {
                    "tableName": "TranD",
                    "fkeyName": "tranHeaderId",
                    "data": [
                        {
                            "accId": ${obj.saleId},
                            "dc": "C",
                            "amount": ${obj.rec_amt},
                            "details": [
                                {
                                    "tableName": "ExtGstTranD",
                                    "fkeyName": "tranDetailsId",
                                    "data": [
                                        {
                                            "gstin": "${obj.other_info}",
                                            "cgst": ${obj.cgst},
                                            "sgst": ${obj.sgst},
                                            "igst": 0,
                                            "isInput": false
                                        }
                                    ]
                                },
                                {
                                    "tableName": "SalePurchaseDetails",
                                    "fkeyName": "tranDetailsId",
                                    "data": [
                                        {
                                            "productId": ${obj.productId},
                                            "qty": 1,
                                            "priceGst": ${obj.rec_amt},
                                            "discount": 0,
                                            "amount": ${obj.rec_amt},
                                            "gstRate": ${obj.gstRate},
                                            "cgst": ${obj.cgst},
                                            "sgst": ${obj.sgst},
                                            "igst": 0,
                                            "hsn": ${
                                                obj.hsn
                                                    ? ''.concat(obj.hsn)
                                                    : null
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        { "accId": ${obj.cashId}, "dc": "D", "amount": ${
            obj.rec_amt
        }, "remarks": "Service+ sale" }
                    ]
                }
            }]
        }`
    }
}

export { useImportServiceSaleHelper }
//
// const template = `
