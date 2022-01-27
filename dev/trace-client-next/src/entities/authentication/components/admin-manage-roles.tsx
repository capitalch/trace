import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useSharedElements } from './shared-elements-hook'
import { useAdminManageRoles } from './admin-manage-roles-hook'

function AdminManageRoles() {
    const { TraceDialog } = useSharedElements()
    const {
        columns,
        gridActionMessages,
        handleCloseDialog,
        meta,
        queryArgs,
        queryId,
        specialColumns,
        summaryColNames,
    } = useAdminManageRoles()
    return (
        <Box sx={{ height: 'calc(100vh - 180px)' }}>
            <Typography variant="subtitle1" component="div" color="cyan">
                {meta.current.title}
            </Typography>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                jsonFieldPath="jsonResult.entitiesBu"
                sharedData={meta.current.sharedData} // to get entities from original fetched data
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                sx={{ mt: 2 }}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                toShowAddButton={true}
                viewLimit="100"
            />
            <TraceDialog meta={meta} onClose={handleCloseDialog} />
        </Box>
    )
}

export { AdminManageRoles }
