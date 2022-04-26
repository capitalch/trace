import { Box, Button, IMegaData, manageEntitiesState, MegaDataContext, salesMegaData, useContext, useEffect, useIbuki, useRef, useState, useTheme, utils, utilMethods, XXGrid } from '../redirect'
import { useSalesViewContent } from './sales-view-content-hook'

function SalesViewContent() {
    const { getXXGridParams } = useSalesViewContent()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const { getGridReportSubTitle } = utils()
    const { columns, gridActionMessages, queryId, queryArgs, specialColumns, summaryColNames } = getXXGridParams()
    return (<Box>
        <XXGrid
            // autoFetchData={true}
            gridActionMessages={gridActionMessages}
            columns={columns}
            sqlQueryId={queryId}
            sqlQueryArgs={queryArgs}
            specialColumns={specialColumns}
            subTitle={getGridReportSubTitle()}
            summaryColNames={summaryColNames}
            title={
                sales.saleType === 'sal'
                    ? 'Sales view'
                    : 'Sales return view'
            }
            viewLimit="100"
        />
    </Box>)
}
export { SalesViewContent }