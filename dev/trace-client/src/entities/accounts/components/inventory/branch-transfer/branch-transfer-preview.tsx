import { PDFViewer } from "@react-pdf/renderer";
import { BranchTransferPdf } from "./branch-transfer-pdf";

export function BranchTransferPreview({ branchTransferData }: any) {
    return (<div>
        <PDFViewer showToolbar={true} width={840} height={600}>
            <BranchTransferPdf branchTransferData={branchTransferData} />
        </PDFViewer>
    </div>)
}