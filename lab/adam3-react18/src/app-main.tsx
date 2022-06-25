import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
})

const MyDocument: any = Document
const MyPage: any = Page

function AppMain() {
    return (
        <PDFViewer>
            <PdfDocument />
        </PDFViewer>
    )
}
export { AppMain }

function PdfDocument() {
    return (
        <MyDocument>
            <MyPage size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </MyPage>
        </MyDocument>
    )
}
