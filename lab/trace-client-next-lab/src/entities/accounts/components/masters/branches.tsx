import { useSharedElements } from '../common/shared-elements-hook'
import { Box, Typography } from '../../../../imports/gui-imports'
import { useBranches, useStyles } from './branches-hook'

function Branches() {
    const { getXXGridParams, handleCloseDialog, meta } = useBranches()
    const classes = useStyles()
    const { TraceDialog, XXGrid } = useSharedElements()

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
                Branches
            </Typography>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                className="xx-grid"
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                toShowAddButton={true}
                viewLimit="100"
            />
            <TraceDialog meta={meta} onClose={handleCloseDialog} />
        </Box>
    )
}
export { Branches }
