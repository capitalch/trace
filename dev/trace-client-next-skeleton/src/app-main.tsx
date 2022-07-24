import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import { Theme, useMediaQuery } from '@mui/material'
import { useTheme, } from '@mui/styles'
import { useTraceGlobal } from './trace-global-hook';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const MyDocument = () => (
    <Document>
        <Page size='A4' style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
);

function AppMain() {
    const { getCurrentMediaSize, isMediumSizeDown, isMediumSizeUp } = useTraceGlobal()
    const mediaSize = getCurrentMediaSize()
    console.log(mediaSize)
    return <PDFViewer>
        <MyDocument />
    </PDFViewer>


}

export { AppMain }