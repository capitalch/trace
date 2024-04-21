import { PDFViewer } from "@react-pdf/renderer";
import { PurchaseInvoicePdf } from "./purchase-invoice-pdf";

export function PurchasePreview({invoiceData}: any) {
    return (<div>
        <PDFViewer showToolbar={true} width={840} height={600}>
            <PurchaseInvoicePdf invoiceData={invoiceData} />
        </PDFViewer>
    </div>)
}