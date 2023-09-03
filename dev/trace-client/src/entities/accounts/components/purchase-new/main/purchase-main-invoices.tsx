import { Box, Button, useTheme } from "@mui/material"
import { SearchBox } from "../../common/search-box"
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro"
import { useEffect, useRef } from "react"
import { GridComponent } from "@syncfusion/ej2-react-grids"

function PurchaseMainInvoices() {
    const theme = useTheme()
    const gridRef: any = useRef({})
    const meta: any = useRef({
        allRows: [],
        filteredRows: [],
        selectionModel: [],
    })
    const pre = meta.current

    useEffect(() => {
        fetchAllInvoices()
        // if (_.isEmpty(allProducts)) {
        //     fetchAllProducts()
        // } else {
        //     pre.allRows = allProducts
        //     pre.filteredRows = pre.allRows.map((x: any) => ({ ...x }))
        //     setRefresh({})
        // }
    }, [])

    return (<Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', columnGap: 2 }}>
            {/* <SearchBox
                parentMeta={meta} 
                sx={{ maxWidth: theme.spacing(120), width: theme.spacing(50) }} /> */}
            <Button variant='contained' color='secondary'
                onClick={fetchAllInvoices}>Refresh</Button>
        </Box>
        <GridComponent
            allowSelection={true}
            allowTextWrap={true}
            gridLines="Both"
            ref={gridRef}
            selectionSettings={{ enableToggle: true }}
            height= {200}
            
        ></GridComponent>
    </Box>)

    async function fetchAllInvoices() {

    }

    function getColumns() {
        return ([
            {
                headerName: '#',
                headerClassName: 'header-class',
                description: 'Ind',
                field: 'id',
                width: 60,
            },

        ])
    }
}
export { PurchaseMainInvoices }