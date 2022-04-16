import { getGridDefaultColumnTypes } from '@mui/x-data-grid-pro'
import {
    _, Big, Box, Button, DataGridPro, GridCellParams, GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer, MegaDataContext, NumberFormat, SearchBox, TextField, Typography, useContext, useEffect, useRef, useState, useTheme, useTraceMaterialComponents, utilMethods
} from '../redirect'

function ProductsSearch() {
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const theme = useTheme()
    const items = sales.items
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        setRefresh: setRefresh
    })
    const pre = meta.current
    useEffect(() => {
        pre.allRows = megaData.accounts.allProducts
        pre.filteredRows = pre.allRows.map((x: any) => ({ ...x }))
    }, [])
    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        {/* <Box sx={{display:'flex', }}></Box> */}
        <SearchBox parentMeta={meta} />
        <DataGridPro
            columns={getColumns()}
            rows={pre.filteredRows}
            showCellRightBorder={true}
            showColumnRightBorder={true}
            sx={getGridSx()}
        />
    </Box>)

    function getColumns() {
        return ([

        ])
    }

    function getGridSx() {
        return (
            {
                // border: '4px solid orange',
                mt: 1.5,
                p: 1, width: '100%',
                fontSize: theme.spacing(1.7),
                minHeight: theme.spacing(80),
                height: 'calc(100vh - 230px)',
                fontFamily: 'Helvetica',
                '& .footer-row-class': {
                    backgroundColor: theme.palette.grey[300]
                },
                '& .header-class': {
                    fontWeight: 'bold',
                    color: 'green',
                    fontSize: theme.spacing(1.8),
                },
                '& .grid-toolbar': {
                    width: '100%',
                    borderBottom: '1px solid lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                },
                '& .row-jakar': {
                    color: 'dodgerBlue'
                },
                '& .row-negative-clos': {
                    color: theme.palette.error.dark
                }
            }
        )
    }
}
export { ProductsSearch }