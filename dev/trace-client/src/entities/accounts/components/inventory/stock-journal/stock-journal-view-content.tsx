import {
    Box,
    genericUpdateMasterDetails, getFromBag, IMegaData, MegaDataContext, stockJournalMegaData, useContext, useIbuki, useRef, useState, utils, XXGrid
} from '../redirect'
import { useStockJournalViewContent } from './stock-journal-view-content-hook'

function StockJournalViewContent() {
    const { getXXGridParams } = useStockJournalViewContent()
    // const megaData: IMegaData = useContext(MegaDataContext)
    // const stockJournal = megaData.accounts.stockJournal
    const { getGridReportSubTitle } = utils()
    const { columns, gridActionMessages, queryId, queryArgs, specialColumns, summaryColNames } = getXXGridParams()

    return (<Box>
        <XXGrid
            gridActionMessages={gridActionMessages}
            columns={columns}
            sqlQueryId={queryId}
            sqlQueryArgs={queryArgs}
            specialColumns={specialColumns}
            subTitle={getGridReportSubTitle()}
            summaryColNames={summaryColNames}
            title={
                'Stock journal view'
            }
            viewLimit="100"
        />
    </Box>)
}

export { StockJournalViewContent }