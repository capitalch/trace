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
    pdf
} from '@react-pdf/renderer'
// import { DataTableCell, Table, TableHeader, TableBody, TableCell } from '@david.kucsai/react-pdf-table'
import { useEffect, useState } from 'react';
import axios from 'axios'

const styles: any = StyleSheet.create({
    page: {
        // fontFamily:'Helvetica',
        fontSize: 12,
        flexDirection: 'column',
        // justifyContent: 'space-between',
        // margin:10,
        padding: 10,
        // backgroundColor: '#E4E4E4'
    },
});

const Main: any = () => (
    <Document>
        <Page size="A4" style={styles.page} >
            <InvoiceTitle title='Tax invoice' />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <CompanyInfo invoice={invoice} />
                <InvoiceInfo invoice={invoice} />
            </View>
            <Svg height={15}>
                <Line
                    x1="0"
                    y1="10"
                    x2='590'
                    y2="10"
                    strokeWidth={0.5}
                    stroke="rgb(0,0,0)"
                />
            </Svg>
            <CustomerDetails invoice={invoice} />
            <ItemsTable />
        </Page>
    </Document>
);

function Invoice() {
    const [, setRefresh] = useState({})

    useEffect(() => {
        getBlob()
    }, [])

    async function getBlob() {
        const blob = await pdf(<Main />).toBlob()
        const ret = await axios({
            url: 'http://localhost:5000/trace/pdf',
            method:'post',
            headers:{
                "content-type":"application/pdf"
            },
            data:blob
        })
        console.log(ret)
        setRefresh({})
    }

    const url = 'kkk'
    return (
        // <div>{url}</div>
            <PDFViewer showToolbar={true} width='800' height='900'>
                <Main />
            </PDFViewer>
        // // <PDFDownloadLink document={<MyDocument />} fileName="somename.pdf">
        // //     {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
        // // </PDFDownloadLink>
    )
}

export { Invoice }

function InvoiceTitle({ title }: any) {
    const styles = StyleSheet.create({
        invoiceTitle: {
            fontSize: 18,
            textTransform: 'uppercase',
            fontWeight: 'bold'
        }
    })
    return (
        <View>
            <Text style={styles.invoiceTitle}>{title}</Text>
        </View>
    )
}

function CompanyInfo({ invoice }: any) {
    const styles = StyleSheet.create({
        companyInfoContainer: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: 5,
            width: 350,
        },
        companyName: {
            fontFamily: 'Helvetica',
            fontSize: 16,
            fontWeight: 'bold'
        },
        address: {
            fontSize: 10,
            fontWeight: 'normal',
            marginTop: 2,
        },
        gstin: {
            flexDirection: 'row',
            fontWeight: 'heavy',
            fontSize: 12,
            marginTop: 2
        },
    })
    const info = invoice.companyInfo
    return (
        <View style={styles.companyInfoContainer}>
            <Text style={styles.companyName}>
                {info.name}
            </Text>
            <Text style={styles.gstin}>{'GSTIN: ' + info.gstin}</Text>

            <Text style={styles.address}>
                {info.address1.concat(', ', info.address2, ', Pin: ', info.pin, ', Email: ', info.email, ', Web: ', info.web, ', Phone: ', info.phone)}
            </Text>
        </View>
    )
}

function InvoiceInfo({ invoice }: any) {
    const styles = StyleSheet.create({
        invoiceInfoView: {
            flexDirection: 'row',
            fontSize: 12,
            fontWeight: 'bold',
            width: 160,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: 2
            // justifyContent:'',
        },
        column1: {
            width: 60
        }
    })
    const info = invoice.invoiceInfo
    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={styles.invoiceInfoView}>
                <Text style={styles.column1}>{'Invoice no: '}</Text>
                <Text>{info.invoiceNo}</Text>
            </View>
            <View style={styles.invoiceInfoView}>
                <Text style={styles.column1}>{'Inv date: '}</Text>
                <Text>{info.invoiceDate}</Text>
            </View>
            <View style={styles.invoiceInfoView}>
                <Text style={styles.column1}>{'Type: '}</Text>
                <Text>{info.type}</Text>
            </View>
            <View style={styles.invoiceInfoView}>
                <Text style={styles.column1}>{'Terms: '}</Text>
                <Text>{info.terms}</Text>
            </View>
        </View>
    )
}

function CustomerDetails({ invoice }: any) {
    const info = invoice.billTo
    const styles = StyleSheet.create({
        customerDetailsContainer: {
            flexDirection: 'column',
            marginTop: 5,
            width: 200,
        },
        customerName: {
            fontSize: 14,
            fontWeight: 'bold'
        },
        address: {
            fontSize: 10,
            fontWeight: 'normal',
            marginTop: 2
        },
        gstin: {
            flexDirection: 'row',
            fontWeight: 'bold',
            fontSize: 12,
            marginTop: 2,
        }
    })

    return (
        <View style={styles.customerDetailsContainer}>
            <Text>Customer details</Text>
            <Text>{info.name}</Text>
            <View style={styles.gstin}>
                <Text>Gstin: </Text>
                <Text>{info.gstin}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text>Ph: </Text>
                <Text>{info.phone}</Text>
            </View>
            <Text>{info.email}</Text>
        </View>

    )
}

function ItemsTable() {
    return (
        <View style={{ marginTop: 5 }}>
            {/* <Table
                data={[
                    { firstName: "John", lastName: "Smith", dob: new Date(2000, 1, 1), country: "Australia", phoneNumber: "xxx-0000-0000" }
                ]}
            >
                <TableHeader>
                    <TableCell textAlign='right' isHeader={true} includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false}>
                        First Name
                    </TableCell>
                    <TableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false}>
                        Last Name
                    </TableCell>
                    <TableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false}>
                        DOB
                    </TableCell>
                    <TableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false}>
                        Country
                    </TableCell>
                    <TableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false}>
                        Phone Number
                    </TableCell>
                </TableHeader>
                <TableBody includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false}>
                    <DataTableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false} getContent={(r) => r.firstName} />
                    <DataTableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false} getContent={(r) => r.lastName} />
                    <DataTableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false} getContent={(r) => r.dob.toLocaleString()} />
                    <DataTableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false} getContent={(r) => r.country} />
                    <DataTableCell includeRightBorder={false} includeLeftBorder={false} includeBottomBorder={false} includeTopBorder={false} getContent={(r) => r.phoneNumber} />
                </TableBody>
            </Table> */}
        </View>
    )
}

const invoice = {
    id: '5df3180a09ea16dc4b95f910',
    title: 'TAX INVOICE',
    invoiceInfo: {
        invoiceNo: '111223',
        invoiceDate: '2021-12-16',
        type: 'Sales',
        terms: 'On credit terms',
        countryOfOrigin: 'India',
        countryOfSupply: 'USA',
        placeOfSupply: 'outside India',
    },
    companyInfo: {
        name: 'Capital Chowringhee Pvt Ltd',
        address1: '12 J.L. Nehru Road',
        address2: 'Peerless hotel',
        pin: '700013',
        phone: '55523321',
        email: 'capitalch@gmail.com',
        web: 'www.capital-chowringhee.com',

        gstin: '123232123212545',
        state: 'West Bengal',
        stateCode: 19,
    },
    billTo: {
        name: 'ABC Pvt Ltd',
        address1: '13 Mahadev Para',
        address2: 'Gurudebpur',
        pin: '700087',
        phone: '559998721',
        email: 'capitalch@gmail.com',

        gstin: '1232321232128876',
        state: 'West Bengal',
        stateCode: 19,
    },
    shipTo: {
        name: 'ABC Pvt Ltd',
        address1: '13 Mahadev Para',
        address2: 'Gurudebpur',
        pin: '700087',
        state: 'West Bengal',
        stateCode: 19,
    },
    items: [
        {
            sno: 1,
            desc: 'ad sunt culpa occaecat qui',
            qty: 5,
            rate: 405.89,
            gstRate: 18,
            gst: 223.0,
            amount: 2223,
        },
        {
            sno: 2,
            desc: 'cillum quis sunt qui aute',
            qty: 5,
            rate: 373.11,
            gstRate: 18,
            gst: 226.0,
            amount: 455554,
        },
        {
            sno: 3,
            desc: 'ea commodo labore culpa irure',
            qty: 5,
            rate: 458.61,
            gstRate: 18,
            gst: 212.0,
            amount: 4425,
        },
        {
            sno: 4,
            desc: 'nisi consequat et adipisicing dolor',
            qty: 10,
            rate: 725.24,
            gstRate: 18,
            gst: 123.0,
            amount: 777854,
        },
        {
            sno: 5,
            desc: 'proident cillum anim elit esse',
            qty: 4,
            rate: 141.02,
            gstRate: 18,
            gst: 23.0,
            amount: 8887,
        },
    ],
}