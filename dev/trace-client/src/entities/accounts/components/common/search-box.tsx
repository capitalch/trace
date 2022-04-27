import {
    Box,
    Checkbox,
    CloseSharp, IconButton, Search, TextField, Typography, useEffect, useIbuki, useTheme
} from '../inventory/redirect'

function SearchBox({ parentMeta, sx }: any) {
    const pre = parentMeta.current
    // sx = sx || {}
    sx = { ...sx, ...{ mt: 1 } }
    const theme = useTheme()
    pre.debounceMessage = 'SEARCH-BOX-DEBOUNCE'
    const { debounceEmit, debounceFilterOn } = useIbuki()

    useEffect(() => {
        const subs1 = debounceFilterOn(pre.debounceMessage).subscribe((d: any) => {
            const requestSearch = d.data[0]
            const searchText = d.data[1]
            requestSearch(searchText)
        })
        return (() => {
            subs1.unsubscribe()
        })
    }, [])

    return (<TextField
        autoFocus={true}
        inputRef={pre.searchTextRef}
        variant="standard"
        autoComplete='off'
        // sx={{mt:1}}
        sx={{ ...sx }}
        value={pre.searchText || ''}
        onChange={handleOnChange}
        placeholder="Search…"
        InputProps={{
            startAdornment: <>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='caption' sx={{ mt: -1, ml: 1.55, color: theme.palette.cyan.light }}>Or</Typography>
                    <Checkbox sx={{ mt: -2 }} checked={pre.isSearchTextOr} onClick={handleOnClickCheckbox} size='small' />
                </Box>
                <Search fontSize="small" />
            </>,
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
        pre.isSearchTextEdited = true
        pre.setRefresh({})
        debounceEmit(pre.debounceMessage, [requestSearch, e.target.value])
    }

    function handleClear(e: any) {
        pre.searchText = ''
        pre.isSearchTextOr = false
        requestSearch('')
    }

    function handleOnClickCheckbox(e: any) {
        pre.isSearchTextOr = e.target.checked
        requestSearch(pre.searchText)
    }

    function requestSearch(searchValue: string) {
        if (searchValue) {
            const arr = searchValue.toLowerCase().split(/\W/).filter(x => x) // filter used to remove empty elements
            // row values are concatenated and checked against each item in the arr (split of searchText on any char which is not alphanumeric)
            // if pre.isSearchTextOr then do logical OR for searchText arr else do logical end
            pre.filteredRows = pre.isSearchTextOr ?
                pre.allRows.filter((row: any) => arr.some((x: string) => Object.values(row).toString().toLowerCase().includes(x.toLowerCase())))
                : pre.allRows.filter((row: any) => arr.every((x: string) => Object.values(row).toString().toLowerCase().includes(x.toLowerCase())))
        } else {
            pre.filteredRows = pre.allRows.map((x: any) => ({
                ...x,
            }))
        }
        if (pre.getTotals) {
            pre.totals = pre.getTotals()
            pre.filteredRows.push(pre.totals)
        }
        pre.setRefresh({})
    }
}
export { SearchBox }