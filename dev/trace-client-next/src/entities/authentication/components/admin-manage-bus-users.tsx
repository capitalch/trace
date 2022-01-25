import { XXGrid } from '../../../global-utils/xx-grid'
import { Box, Typography } from '../../../imports/gui-imports'
import { useRef } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { useAdminManageBusUsers } from './admin-manage-bus-users-hook'

function AdminManageBusUsers() {
    const meta: any = useRef({
        title: 'Admin manage business users',
    })
    const {} = useSharedElements()
    const {
        columns,
        gridActionMessages,
        queryArgs,
        queryId,
        specialColumns,
        summaryColNames,
    } = useAdminManageBusUsers()

    return (
        <Box>
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
                sx= {{mt:2}}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                toShowAddButton={true}
                viewLimit="100"
            />
        </Box>
    )
}

export { AdminManageBusUsers }
