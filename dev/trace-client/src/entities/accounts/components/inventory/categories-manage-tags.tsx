import {
    Add, Box, Button, DataGridPro, DeleteForever, Edit, Grid, IconButton, IMegaData, Link, MegaDataContext, PrimeColumn,
    Switch, SyncSharp, TreeTable, Typography, useContext, useState, useEffect, useSharedElements, useTraceMaterialComponents,
} from './redirect'
import { useManageTags } from './categories-manage-tags-hook'

function ManageTags() {
    const { getColumns, getGridSx, handleAddTag, meta } = useManageTags()
    const pre = meta.current
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const megaData: IMegaData = useContext(MegaDataContext)
    const allTags = megaData.accounts.inventory.category.allTags

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, columnGap: 2 }}>
            <Button size='small' color='secondary' variant='contained' onClick={handleAddTag} sx={{ ml: 'auto' }}>Add</Button>
            <DataGridPro
                columns={getColumns()}
                disableColumnMenu={true}
                disableSelectionOnClick={true}
                rows={allTags}
                showCellRightBorder={true}
                showColumnRightBorder={true}
                sx={getGridSx()}
            />
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}
export { ManageTags }