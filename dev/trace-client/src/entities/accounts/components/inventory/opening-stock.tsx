import { Box, Typography, useSharedElements, useTheme } from './redirect'
import { useOpeningStock } from "./opening-stock-hook"
import { OpeningStockWorkBench } from "./opening-stock-work-bench"

function OpeningStock() {
    const { XXGrid } = useSharedElements()
    const { getXXGriArtifacts, meta } = useOpeningStock()
    const { actionMessages, columns, sqlQueryArgs, sqlQueryId, specialColumns, summaryColNames, } = getXXGriArtifacts()
    const theme = useTheme()

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: theme.spacing(1), columnGap: theme.spacing(3), justifyContent: 'space-evenly' }}>
            {/* New / Edit entry */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography
                    color="primary"
                    variant='subtitle1'
                    component="span">
                    Opening stock (New / Edit)
                </Typography>
                <OpeningStockWorkBench />
            </Box>

            {/* View  */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
                <Typography
                    color="primary"
                    variant='subtitle1'
                    component="span">
                    Opening stock (View)
                </Typography>
                <XXGrid
                    sx={{ border: '4px solid orange', p: 2, width: '100%' }}
                    autoFetchData={true}
                    columns={columns}
                    gridActionMessages={actionMessages}
                    hideFiltersButton={true}
                    hideColumnsButton={true}
                    hideExportButton={true}
                    hideViewLimit={true}
                    specialColumns={specialColumns}
                    sqlQueryArgs={sqlQueryArgs}
                    sqlQueryId={sqlQueryId}
                    summaryColNames={summaryColNames}
                // title={title}
                />
            </Box>
        </Box>)
}

export { OpeningStock }