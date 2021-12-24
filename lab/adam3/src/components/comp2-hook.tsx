import {
    Page,
    Document,
    View,
    Svg,
    Line,
    Text,
    Image,
    StyleSheet,
    PDFViewer,
    PDFDownloadLink,
    BlobProvider,
    usePDF,
    pdf,
} from '@react-pdf/renderer'
function useComp2() {
    function InvoicePdf({ invoiceData }: any) {
        const styles = StyleSheet.create({
            page: {
                flexDirection: 'column',
                padding: 10,
            },
        })
        return (
            <Document>
                <Page size="A4" style={styles.page}></Page>
                {/* <InvoiceTitle invoiceData={invoiceData} /> */}
            </Document>
        )
        function InvoiceTitle(invoiceData: any) {
            const styles = StyleSheet.create({
                title: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
            })
            return (
                <View>
                    <Text style={styles.title}>
                        {invoiceData.invoiceInfo.title}
                    </Text>
                </View>
            )
        }
    }

    return { InvoicePdf }
}
export { useComp2 }
