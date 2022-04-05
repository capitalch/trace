import {
    CloseSharp, IconButton, Search, TextField, useIbuki,
} from '../redirect'

function GridSearchBox({ parentMeta }: any) {
    const pre = parentMeta.current
    const { debounceEmit, } = useIbuki()

    return (<TextField
        inputRef={pre.searchTextRef}
        variant="standard"
        autoComplete='off'
        value={pre.searchText || ''}
        onChange={handleOnChange}
        placeholder="Search…"
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
        pre.isSearchTextEdited = true
        pre.setRefresh({})
        debounceEmit(pre.debounceMessage, [requestSearch, e.target.value])
    }

    function handleClear(e: any) {
        pre.searchText = ''
        requestSearch('')
    }

    function requestSearch(searchValue: string) {
        if (searchValue) {
            pre.filteredRows = pre.allRows.filter(
                (row: any) => {
                    return Object.keys(row).some((field) => {
                        const temp: string = row[field]
                            ? row[field].toString()
                            : ''
                        return temp
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                    })
                }
            )
        } else {
            pre.filteredRows = pre.allRows.map((x: any) => ({
                ...x,
            }))
        }
        pre.totals = pre.getTotals()
        pre.filteredRows.push(pre.totals)
        pre.setRefresh({})
    }
}
export { GridSearchBox }