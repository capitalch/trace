import { useSharedElements } from '../common/shared-elements-hook'
import { Box, Typography } from '../../../../imports/gui-imports'
import { useBrands, useStyles } from './brands-hook'

function Brands() {
    const { getXXGridParams, handleCloseDialog, meta } = useBrands()
    const classes = useStyles()
    const { getGridReportSubTitle, TraceDialog, XXGrid } = useSharedElements()

    const {
        columns,
        gridActionMessages,
        queryId,
        queryArgs,
        summaryColNames,
        specialColumns,
    } = getXXGridParams()

    return (
        <Box className={classes.content}>
            <Typography variant="subtitle1" component="div" color="secondary">
                Brands
            </Typography>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                className="xx-grid"
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                subTitle={getGridReportSubTitle()}
                summaryColNames={summaryColNames}
                title="Brands report"
                toShowAddButton={true}
                viewLimit="100"
            />
            <TraceDialog meta={meta} onClose={handleCloseDialog} />
        </Box>
    )
}
export { Brands }
