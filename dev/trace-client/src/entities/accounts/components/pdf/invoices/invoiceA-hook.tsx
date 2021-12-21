import { useSharedElements, } from '../../common/shared-elements-hook'
function useInvoiceA() {
    const { Document, Line, Page, StyleSheet, Svg, Text, View, } = useSharedElements()

    const styles = StyleSheet.create({
        page: {
            fontSize: 12,
            flexDirection: 'column',
            padding: 10
        }
    })
    function Main() {
        return (
            <Document>
                <Page size='A4' style={styles.page}>
                    <InvoiceHeading heading='TAX INVOICE' />
                </Page>
            </Document>
        )
    }

    function InvoiceHeading({ heading }: { heading: string }) {
        return (
            <View>
                <Text style={{ fontSize: 18, textTransform: 'uppercase', fontWeight: 'bold' }}>{heading}</Text>
            </View>
        )
    }

    return ({ Main })
}
export { useInvoiceA }

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
export { invoice }