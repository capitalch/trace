import {
    Box, Button, genericUpdateMasterDetails, getFromBag, IMegaData, manageEntitiesState, MegaDataContext, setInBag, stockJournalMegaData, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods, XXGrid
} from '../redirect'

function useStockJournalCrown() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData.accounts.stockJournal
    const { emit } = useIbuki()

    function handleReset() {
        megaData.accounts.stockJournal = stockJournalMegaData()
        emit('TRACE-MAIN:JUST-REFRESH', null)
    }

    async function handleSubmit() {
        const headerWithDetails = extractHeaderWithDetails()

        console.log(headerWithDetails)
        const ret = await genericUpdateMasterDetails([headerWithDetails])
        if(ret.error){
            console.log(ret.error)
        } else {
            const id = ret?.data?.accounts?.genericUpdateMasterDetails
            console.log('id for TranH:',id)
            handleReset()
        }

        function extractHeaderWithDetails() {
            const finYearId = getFromBag('finYearObject')?.finYearId
            const branchId = getFromBag('branchObject')?.branchId || 1
            const obj: any = {
                tableName: 'TranH',
                data: [],
            }
            const item: any = {
                id: stockJournal.id || undefined,
                tranDate: stockJournal.tranDate,
                userRefNo: stockJournal.userRefNo,
                remarks: stockJournal.remarks,
                tags: undefined,
                jData: undefined,
                finYearId: finYearId,
                branchId: branchId,
                posId: '1',
                autoRefNo: stockJournal.autoRefNo,
                tranTypeId: 11,
                details: [],
            }
            
            item.details.push(extractDetails())
            obj.data.push(item)
            return obj

            function extractDetails() {
                const obj: any = {
                    tableName: 'StockJournal',
                    fkeyName: 'tranHeaderId',
                    //deletedIds:[],
                    // data:[]
                }
                const data: any[] = []
                for (const item of stockJournal['inputSection'].items) {
                    data.push({
                        productId: item.productId,
                        qty: item.qty,
                        lineRemarks: item.remarks,
                        lineRefNo: item.refNo,
                        dc: 'C'
                    })
                }
                for (const item of stockJournal['outputSection'].items) {
                    data.push({
                        productId: item.productId,
                        qty: item.qty,
                        lineRemarks: item.remarks,
                        lineRefNo: item.refNo,
                        dc: 'D'
                    })
                }
                obj.data = [...data]
                return (obj)
            }
        }

    }

    return { handleReset, handleSubmit }
}

export { useStockJournalCrown }