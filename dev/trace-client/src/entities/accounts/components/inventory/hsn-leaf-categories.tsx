import { Box, Button, DataGridPro, IconButton, SyncSharp, useGridApiRef, useTheme } from './redirect'
import { useHsnLeafCategories } from './hsn-leaf-categories-hook'

function HsnLeafCategories() {
    const apiRef: any = useGridApiRef()
    const { fetchData, getColumns, getGridSx, handleCellClick, handleCellFocusOut, handleSubmit, meta, processRowUpdate } = useHsnLeafCategories({ apiRef })
    const pre = meta.current
    const theme = useTheme()

    return (<Box display='flex' flexDirection='column' rowGap={2}>
        <Box sx={{ display: 'flex', ml: 'auto', columnGap: 2, alignItems:'center' }}>
            <IconButton
                sx={{ color: 'green' }}
                size="medium"
                color="secondary"
                onClick={fetchData}>
                <SyncSharp />
            </IconButton>
            <Button variant='contained' size='small'
                color='secondary'
                disabled={!pre.isDataChanged}
                onClick={handleSubmit}
                sx={{ height: theme.spacing(3) }}>Submit</Button>
        </Box>
        <DataGridPro
            experimentalFeatures={{ newEditingApi: true }}
            apiRef={apiRef}
            onCellClick={handleCellClick}
            onCellFocusOut={handleCellFocusOut}
            processRowUpdate={processRowUpdate}
            columns={getColumns()}
            disableColumnMenu={true}

            // rowHeight={35}
            rows={pre.allRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    </Box>
    )
}
export { HsnLeafCategories }