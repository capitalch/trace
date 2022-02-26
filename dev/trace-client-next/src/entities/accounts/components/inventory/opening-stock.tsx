import { useSharedElements } from "../common/shared-elements-hook"
import {
    Box,
    Card,
    Theme,
    Typography,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'
import { useOpeningStock } from "./opening-stock-hook"
import { OpeningStockWorkBench } from "./opening-stock-work-bench"

function OpeningStock() {
    const { XXGrid } = useSharedElements()
    const { getXXGriArtifacts, meta } = useOpeningStock()
    const { actionMessages, columns, sqlQueryArgs, sqlQueryId, specialColumns, summaryColNames, title } = getXXGriArtifacts()
    return (<Box>
        {/* <Typography
            color="primary"
            variant='subtitle1'
            component="span">
            {meta.current.title}
        </Typography> */}
        <Box sx={{ display: 'flex', columnGap: 2 }}>
            <OpeningStockWorkBench />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1">
                    Opening stock view
                </Typography>
                <XXGrid
                    sx={{ border: '4px solid blue', p: 2 }}
                    columns={columns}
                    gridActionMessages={actionMessages}
                    hideFiltersButton={true}
                    hideColumnsButton={true}
                    // hideFilteredButton={true}
                    hideExportButton={true}
                    hideViewLimit={true}
                    // subTitle='Year'
                    specialColumns={specialColumns}
                    sqlQueryArgs={sqlQueryArgs}
                    sqlQueryId={sqlQueryId}
                    summaryColNames={summaryColNames}
                    title={title}
                />
            </Box>
        </Box>
    </Box>)
}

export { OpeningStock }