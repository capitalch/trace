import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useRef } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { useAdminManageBusUsers } from './admin-manage-bus-users-hook'

function AdminManageBusUsers() {

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
    } = useAdminManageBusUsers()

    return (
        <Box sx={{ height: 'calc(100vh - 180px)' }}>
            <Typography
                variant="subtitle1"
                component="div"
                color="cyan">{meta.current.title}</Typography>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                // className="xx-grid"
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

export { AdminManageBusUsers }
