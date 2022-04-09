import { Box, Button, CloseSharp, DataGridPro, GridToolbarContainer, GridToolbarFilterButton, IconButton, Search, SyncSharp, TextField, useGridApiRef, useIbuki, useRef, useState, useTheme, manageEntitiesState } from './redirect'
import { useHsnLeafCategories } from './hsn-leaf-categories-hook'

function HsnLeafCategories() {
    const apiRef: any = useGridApiRef()
    const { fetchData, getColumns, getGridSx, handleCellClick, handleCellFocusOut, handleSubmit, meta, processRowUpdate } = useHsnLeafCategories({ apiRef })
    const pre = meta.current
    const theme = useTheme()

    return (<Box display='flex' flexDirection='column' rowGap={2}>
        <Box sx={{ display: 'flex', ml: 'auto', columnGap: 2, alignItems: 'center' }}>
            <GridSearchBox ibukiMessage={pre.ibukiMessage} />
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
            columns={getColumns()}
            disableColumnMenu={true}
            onCellClick={handleCellClick}
            onCellFocusOut={handleCellFocusOut}
            processRowUpdate={processRowUpdate}
            // rowHeight={35}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    </Box>
    )
}
export { HsnLeafCategories }

function GridSearchBox({ ibukiMessage }: any) {
    const [, setRefresh] = useState({})
    const { emit } = useIbuki()
    const meta = useRef({
        searchText: ''
    })
    const pre = meta.current
    return (<TextField
        variant="standard"
        autoComplete='off'
        value={pre.searchText || ''}
        onChange={handleOnChange}
        placeholder="Search …"
        InputProps={{
            startAdornment: <Search fontSize="small" />,
            endAdornment: (
                <IconButton
                    title="Clear"
                    aria-label="Clear"
                    size="small"
                    sx={{
                        visibility: pre.searchText ? 'visible' : 'hidden'
                    }}
                    onClick={handleClear}>
                    <CloseSharp fontSize="small" />
                </IconButton>
            ),
        }}
    />)

    function handleOnChange(e: any) {
        pre.searchText = e.target.value
        emit(ibukiMessage, e.target.value)
        setRefresh({})
    }

    function handleClear() {
        pre.searchText = ''
        emit(ibukiMessage, '')
        setRefresh({})
    }
}