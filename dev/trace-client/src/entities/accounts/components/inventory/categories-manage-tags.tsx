import {
    Add, Box, Button, DataGridPro, DeleteForever, Edit, Grid, IconButton, Link, PrimeColumn,
    Switch, SyncSharp, TreeTable, Typography, useState, useEffect, useSharedElements, useTraceMaterialComponents,
} from './redirect'
import { useManageTags } from './categories-manage-tags-hook'

function ManageTags() {
    const { getColumns, getGridSx, handleAddTag, meta } = useManageTags()
    const pre = meta.current
    const { BasicMaterialDialog } = useTraceMaterialComponents()

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, columnGap: 2 }}>
            <Button size='small' color='secondary' variant='contained' onClick={handleAddTag} sx={{ ml: 'auto' }}>Add</Button>
            <DataGridPro
                columns={getColumns()}
                disableColumnMenu={true}
                disableSelectionOnClick={true}
                rows={pre.filteredRows}
                showCellRightBorder={true}
                showColumnRightBorder={true}
                sx={getGridSx()}
            />
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}
export { ManageTags }