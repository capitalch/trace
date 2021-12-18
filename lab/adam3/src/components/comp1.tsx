import {
    Page,
    Document,
    View,
    Text,
    Image,
    StyleSheet,
    PDFViewer,
    PDFDownloadLink,
} from '@react-pdf/renderer'

const MyDocument = () => (
    // <PDFViewer>
    <Document>
        <Page size="A4">
            <View>
                <Text>Section #1</Text>
            </View>
            <View>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
    // </PDFViewer>
)

function Comp1() {
    return (
        <PDFDownloadLink document={<MyDocument />} fileName="somename.pdf">
            {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink>
    )
}

export { Comp1 }