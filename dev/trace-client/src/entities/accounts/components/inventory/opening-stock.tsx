import { Box, Button, Typography, useSharedElements, useTheme } from './redirect'
import { useOpeningStock } from "./opening-stock-hook"
import { OpeningStockWorkBench } from "./opening-stock-work-bench"

function OpeningStock() {
    const { XXGrid } = useSharedElements()
    const { getXXGriArtifacts, handleStockTransferToNextYear} = useOpeningStock()
    const { actionMessages, columns, jsonFieldPath, meta, sqlQueryArgs, sqlQueryId, specialColumns, summaryColNames, } = getXXGriArtifacts()
    const theme = useTheme()
    const pre = meta.current
    
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: theme.spacing(1), columnGap: theme.spacing(3), justifyContent: 'space-evenly' }}>
            {/* New / Edit entry */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography
                    color="primary"
                    variant='subtitle1'
                    component="span">
                    {pre.title}
                </Typography>
                <OpeningStockWorkBench />
            </Box>

            {/* View  */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
                <Box sx={{display:'flex', justifyContent:'space-between'}}>
                    <Typography
                        color="primary"
                        variant='subtitle1'
                        component="span">
                        Opening stock (View)
                    </Typography>
                    <Button size='small' color='info' variant='text' onClick={handleStockTransferToNextYear}>Stock transfer to next year</Button>
                </Box>

                <XXGrid
                    sx={{ border: '4px solid orange', p: 2, width: '100%' }}
                    autoFetchData={true}
                    columns={columns}
                    customFooterField1={{ label: 'Value', value: 233.44, path: 'jsonResult.value' }}
                    gridActionMessages={actionMessages}
                    hideColumnsButton={true}
                    hideExportButton={true}
                    hideViewLimit={true}
                    jsonFieldPath={jsonFieldPath}
                    specialColumns={specialColumns}
                    sqlQueryArgs={sqlQueryArgs}
                    sqlQueryId={sqlQueryId}
                    summaryColNames={summaryColNames}
                />
            </Box>
        </Box>)
}

export { OpeningStock }