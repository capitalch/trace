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
import { findRenderedComponentWithType } from 'react-dom/test-utils'
function useComp2() {
    function InvoicePdf({ invoiceData }: any) {
        const styles = StyleSheet.create({
            page: {
                flexDirection: 'column',
                padding: 20,
                fontFamily: 'Helvetica'
            },
        })

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Title invoiceData={invoiceData} />
                    <HorLine />
                    <Header invoiceData={invoiceData} />
                    <SubHeader invoiceData={invoiceData} />
                    <HorLine />
                    <ItemsTable invoiceData={invoiceData}/>
                </Page>
            </Document>
        )
        function Title({ invoiceData }: any) {
            const styles = StyleSheet.create({
                titleCont: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                title: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                titleRight: {
                    fontSize: 12,
                    textTransform: 'uppercase'
                }
            })
            return (
                <View style={styles.titleCont} fixed={true}>
                    <Text style={styles.title}>
                        {invoiceData.invoiceInfo.title}
                    </Text>
                    <Text style={styles.titleRight}>
                        {invoiceData.invoiceInfo.titleRight}
                    </Text>
                </View>
            )
        }

        function Header({ invoiceData }: any) {

            const ii = invoiceData.invoiceInfo
            const styles = StyleSheet.create({
                headerCont: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },
            })
            return (
                <View style={styles.headerCont} fixed={true}>
                    <HeaderCompany invoiceData={invoiceData} />
                    <HeaderInvoice invoiceData={invoiceData} />
                </View>
            )

            function HeaderCompany({ invoiceData }: any) {
                const styles = StyleSheet.create({
                    headerCompany: {
                        flexDirection: 'column',
                        marginTop: 8,
                        width: '65%'
                    },
                    companyName: {
                        fontSize: 26,
                        fontWeight: 'bold'
                    },
                    gstin: {
                        marginTop: 5,
                        fontSize: 16,
                        fontWeight: 'bold'
                    },
                    address: {
                        fontSize: 12,
                    }
                })
                const ci = invoiceData.companyInfo
                return (
                    <View style={styles.headerCompany} fixed={true}>
                        <Text style={styles.companyName}>{ci.name}</Text>
                        <Text style={styles.gstin}>GSTIN {ci.gstin}</Text>
                        <Text style={styles.address}>{''.concat(ci.address1,
                            ' ', ci.address2, ' PIN: ', ci.pin, ' Ph: ', ci.phone, ' email: ', ci.email, ' Web: ', ci.web)}</Text>
                        <Text style={styles.address}>
                            {''.concat(ci.stateName, ' ', 'State code: ', ci.stateCode)}
                        </Text>
                    </View>
                )
            }

            function HeaderInvoice({ invoiceData }: any) {
                const styles = StyleSheet.create({
                    headerInvoice: {
                        flexDirection: 'column',
                        marginTop: 14,
                        width: '30%',
                        fontSize: 12,
                    },
                    invoiceNo: {
                        fontSize: 14,
                        fontWeight: 'bold',

                        // marginLeft:'auto'
                    },
                    invoiceDate: {
                        marginTop: 5,
                        fontSize: 12,
                        // marginLeft: 'auto'
                    }
                })
                const ii = invoiceData.invoiceInfo
                return (
                    <View style={styles.headerInvoice}>
                        <Text style={styles.invoiceNo}>Invoice #: {ii.invoiceNo}</Text>
                        <Text style={styles.invoiceDate}>Date: {ii.invoiceDate}</Text>
                        <Text>{''.concat('Type: ', ii.type)}</Text>
                        <Text>{''.concat('Terms: ', ii.terms)}</Text>
                    </View>
                )
            }
        }

        function SubHeader({ invoiceData }: any) {
            const styles = StyleSheet.create({
                container: {
                    marginTop: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                },
                customerDetailsCont: {
                    flexDirection: 'column',
                    width: '32%'
                },
                billingAddressCont: {
                    flexDirection: 'column',
                    width: '32%'
                },
                shippingAddressCont: {
                    flexDirection: 'column',
                    width: '32%'
                },
                normal: {
                    marginTop: 2,
                    fontSize: 12,
                    fontWeight: 'normal'
                },
                bold: {
                    fontSize: 12,
                    fontWeight: 'bold'
                }

            })
            const ib = invoiceData.billTo
            return (
                <View style={styles.container}>
                    <View style={styles.customerDetailsCont}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Customer Details</Text>
                        <Text style={styles.normal}>{ib.name}</Text>
                        <Text style={styles.bold}>{''.concat('GSTIN: ', (ib.gstin || ''))}</Text>
                        <Text style={styles.normal}>{''.concat('Ph: ', (ib.phone || ''))}</Text>
                        <Text style={styles.normal}>{''.concat('Email: ', ib.email || '')}</Text>
                        <Text style={styles.bold}>{''.concat('Place of supply:', ib.stateName || '', ' State Code: ', ib.stateCode || '')}</Text>
                    </View>
                    <View style={styles.billingAddressCont}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>    Billing Address</Text>
                        <Text style={styles.normal}>{''.concat(ib.address1, ' ', ib.address2 || '', ' Pin: ', ib.pin)}</Text>
                    </View>
                    <View style={styles.shippingAddressCont}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}> Shipping Address</Text></View>
                </View>
            )
        }

        function HorLine() {
            return (
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
            )
        }

        function ItemsTable({ invoiceData }: any) {
            const styles = StyleSheet.create({
                container: {
                    flexDirection: 'row'
                },
                bold: {
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                normal: {
                    fontSize: 12,
                    fontWeight: 'normal'
                }
            })
            return (
                <View>
                    <Header />
                    <Items />
                </View>
            )

            function Header() {
                return (
                    <View>
                        <View style={styles.container}>
                            <Text style={{ ...styles.bold, width: 20 }}>#</Text>
                            <Text style={{ ...styles.bold, width: 200 }}>Items</Text>
                            <Text style={{ ...styles.bold, width: 60, textAlign: 'right' }}>Rate</Text>
                            <Text style={{ ...styles.bold, width: 30, textAlign: 'right' }}>Qty</Text>
                            <Text style={{ ...styles.bold, width: 60, textAlign: 'right' }}>Disc</Text>
                            <Text style={{ ...styles.bold, width: 80, textAlign: 'right' }}>Aggregate</Text>
                            <Text style={{ ...styles.bold, width: 60, textAlign: 'right' }}>Tax</Text>
                            <Text style={{ ...styles.bold, width: 80, textAlign: 'right' }}>Amount</Text>
                        </View>
                        <HorLine />
                    </View>
                )
            }

            function Items() {
                const ii: any[] = invoiceData.items
                const rows = ii.map((x: any, index: number) => {
                    return <View style={styles.container}>
                        <Text style={{ ...styles.normal, width: 20 }}>{index +1}</Text>
                        <Text style={{ ...styles.normal, width: 200 }}>{x.desc}</Text>
                        <Text style={{ ...styles.normal, width: 60, textAlign: 'right' }}>{x.price}</Text>
                        <Text style={{ ...styles.normal, width: 30, textAlign: 'right' }}>{x.qty}</Text>
                        <Text style={{ ...styles.normal, width: 60, textAlign: 'right' }}>{x.discount}</Text>
                        <Text style={{ ...styles.normal, width: 80, textAlign: 'right' }}>{x.aggr}</Text>
                        <Text style={{ ...styles.normal, width: 60, textAlign: 'right' }}>{x.gst}</Text>
                        <Text style={{ ...styles.normal, width: 80, textAlign: 'right' }}>{x.amount}</Text>
                    </View>
                })
                return <View style={{ flexDirection: 'column' }}>
                    {rows}
                </View>
            }
        }
    }

    return { InvoicePdf }
}
export { useComp2 }
