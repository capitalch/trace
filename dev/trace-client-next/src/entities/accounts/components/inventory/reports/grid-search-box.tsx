import {
    Checkbox,
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
            startAdornment: <>
                <Checkbox checked={pre.isSearchTextOr} onClick={handleOnClickCheckbox} size='small' />
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

    function handleOnClickCheckbox(e:any){
        pre.isSearchTextOr = e.target.checked
        requestSearch(pre.searchText)
    }

    function requestSearch(searchValue: string) {
        if (searchValue) {
            const arr = searchValue.toLowerCase().split(/\W/).filter(x => x) // filter used to remove emty elements
            // row values are concatenated and checked against each item in the arr (split of searchText on any char which is not alphanumeric)
            // if pre.isSearchTextOr then do logical OR for searchText arr else do logical end
            pre.filteredRows = pre.isSearchTextOr ?
                pre.allRows.filter((row: any) => arr.some((x: string) => Object.values(row).toString().toLowerCase().includes(x.toLowerCase())))
                : pre.allRows.filter((row: any) => arr.every((x: string) => Object.values(row).toString().toLowerCase().includes(x.toLowerCase())))


            // Object.values(row).some((value: any) =>
            //     arr.every((x: string) => String(value).toLowerCase().includes(x.toLowerCase()))))

            // arr.some((x: string) => String(value).toLowerCase().includes(x.toLowerCase()))))
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