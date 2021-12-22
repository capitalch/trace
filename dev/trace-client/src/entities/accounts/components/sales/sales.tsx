import { Button, Tabs, Tab } from '../../../../imports/gui-imports'
import { useSales, useStyles } from './sales-hook'
import { useSharedElements } from '../common/shared-elements-hook'
import { SaleCrown } from './sale-crown'
import { SaleHeader } from './sale-header'
import { SaleItems } from './sale-items'
import { SaleFooter } from './sale-footer'
import { SaleView } from './sale-view'
import { InvoiceA } from '../pdf/invoices/invoiceA'
// import { useReactToPrint } from 'react-to-print'
// import pspdfkit from 'pspdfkit'
import { useRef } from 'react'
// import axios from 'axios'

function Sales({ saleType, drillDownEditAttributes }: any) {
    const classes = useStyles()
    const { pdf, PDFViewer, emit } = useSharedElements()
    const { multiData, handleChangeTab, meta } = useSales(
        saleType,
        drillDownEditAttributes
    )
    // const pdfRef: any = useRef()
    // const handlePrint = useReactToPrint({
    //     content: () => pdfRef.current,
    // })
    return (
        <div className={classes.content}>
            <SaleCrown
                saleType={saleType}
                drillDownEditAttributes={drillDownEditAttributes}
            />
            <Tabs
                className="tabs"
                indicatorColor="primary"
                onChange={handleChangeTab}
                value={multiData.sales.tabValue}>
                <Tab label="Header" />
                <Tab label="Items" />
                <Tab label="Footer" />
                <Tab label="View" />
                <Button
                    className="reset"
                    variant="contained"
                    onClick={() => emit('LAUNCH-PAD:LOAD-COMPONENT', null)}>
                    Reset
                </Button>
                <Button
                    variant="contained"
                    onClick={handlePdfPrint}
                    color="primary">
                    Print
                </Button>
            </Tabs>
            <div hidden={multiData.sales.tabValue !== 0}>
                <SaleHeader />
            </div>

            <div hidden={multiData.sales.tabValue !== 1}>
                <SaleItems />
            </div>
            <div hidden={multiData.sales.tabValue !== 2}>
                <SaleFooter />
            </div>
            <div hidden={multiData.sales.tabValue !== 3}>
                <SaleView drillDownEditAttributes={drillDownEditAttributes} />
            </div>

            {/* <PDFViewer>
                <InvoiceA />
            </PDFViewer> */}
        </div>
    )

    async function handlePdfPrint() {        
        const blob = await pdf(<InvoiceA />).toBlob()
        const fileURL: any = URL.createObjectURL(blob)
        const w: any = window.open(fileURL, "_blank", "height=400,width=600,top=200, left=200")
        // w.print()
    }
}

export { Sales }

// const response = await axios.get('http://localhost:5002', {
//     responseType: 'blob',
//     headers: {
//         'Accept': 'application/pdf'
//     }
// })
// const blob:any = new Blob([response.data], { type: 'application/pdf' })
//     const fileURL = URL.createObjectURL(blob)
//     const w:any = window.open(fileURL, "_blank", "height=400,width=600,top=200, left=200")            
//     w.print()

// axios.get('http://localhost:5002', {
//     responseType: 'blob',
//     headers: {
//         'Accept': 'application/pdf'
//     }
// }).then((response) => {
//     const blob:any = new Blob([response.data], { type: 'application/pdf' })
//     const fileURL = URL.createObjectURL(blob)
//     const w:any = window.open(fileURL, "_blank", "height=400,width=600,top=200, left=200")            
//     w.print()
// })
