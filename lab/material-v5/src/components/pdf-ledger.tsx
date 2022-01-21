import { Document,BlobProvider, Line, Page,pdf,PDFViewer, StyleSheet, Svg, Text,usePDF, View, } from '@react-pdf/renderer'

function PdfLedger() {
    return(<Document>
        <Page size='A4'>
            <View>
                <Text style={{color:'red'}}>Pdf document1</Text>
            </View>
        </Page>
    </Document>)
}

export { PdfLedger }