import logo from './logo.svg';
import './App.css';
import {
  Page,
  Document,
  View,
  Text,
  Image,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink

} from '@react-pdf/renderer'

function App() {
  const MyDocument = () => (
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
)
  return (
    <div>
        <PDFDownloadLink document={<MyDocument />} fileName="somename.pdf">
            {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink>
    </div>
  );
}

export default App;
