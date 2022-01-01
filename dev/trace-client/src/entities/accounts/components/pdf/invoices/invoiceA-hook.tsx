import { useSharedElements } from '../../common/shared-elements-hook'
function useInvoiceA() {
    const {
        Document,
        Line,
        Page,
        StyleSheet,
        toDecimalFormat,
        Svg,
        Text,
        View,
    } = useSharedElements()

    function InvoicePdf({ invoiceData }: any) {
        const gStyles = StyleSheet.create({
            page: {
                flexDirection: 'column',
                paddingLeft: 30,
                paddingRight: 30,
                paddingTop: 20,
                paddingBottom: 30,
                fontFamily: 'Helvetica',
            },
            pageNumber: {
                position: 'absolute',
                fontSize: 8,
                bottom: 8,
                left: 0,
                right: 0,
                textAlign: 'center',
                color: 'grey',
            },
            summaryBlock: {
                paddingTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
                paddingBottom: 5,
                borderBottom: 1,
                borderTop: 1,
            },
            footer: {
                position: 'absolute',
                bottom: 30,
                fontWeight: 'bold',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                left: 30,
            },
            normal: {
                fontSize: 8,
                marginTop: 2,
            },
            bold: {
                fontSize: 8,
                marginTop: 2,
            },
        })

        return (
            <Document>
                <Page size="A4" style={gStyles.page}>
                    <HeaderBlock invoiceData={invoiceData} />
                    <SubHeaderBlock invoiceData={invoiceData} />
                    <ItemsTable invoiceData={invoiceData} />
                    <SummaryBlock invoiceData={invoiceData} />
                    <Footer invoiceData={invoiceData} />
                    <PageNo />
                </Page>
            </Document>
        )

        function HeaderBlock({ invoiceData }: any) {
            const ii = invoiceData.invoiceInfo
            const styles = StyleSheet.create({
                headerBlock: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    paddingBottom: 5,
                    borderBottomColor: 'grey',
                    marginBottom: 5,
                },
            })
            return (
                <View style={styles.headerBlock} fixed={true}>
                    <HeaderCompany invoiceData={invoiceData} />
                    <HeaderInvoice invoiceData={invoiceData} />
                </View>
            )

            function HeaderCompany({ invoiceData }: any) {
                const styles = StyleSheet.create({
                    headerCompany: {
                        flexDirection: 'column',
                        marginTop: 8,
                        width: '60%',
                    },
                    companyName: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                    gstin: {
                        marginTop: 3,
                        fontSize: 10,
                        fontWeight: 'bold',
                    },
                    address: {
                        fontSize: 8,
                    },
                })
                const ci = invoiceData.companyInfo
                return (
                    <View style={styles.headerCompany} fixed={true}>
                        <Text style={styles.companyName}>{ci.name}</Text>
                        <Text style={styles.gstin}>GSTIN {ci.gstin}</Text>
                        <Text style={styles.address}>
                            {''.concat(
                                ci.address1,
                                ' ',
                                ci.address2,
                                ' PIN: ',
                                ci.pin,
                                ' Ph: ',
                                ci.phone,
                                ' email: ',
                                ci.email,
                                ' Web: ',
                                ci.web
                            )}
                        </Text>
                        <Text style={styles.address}>
                            {''.concat(
                                ci.stateName,
                                ' ',
                                'State code: ',
                                ci.stateCode
                            )}
                        </Text>
                    </View>
                )
            }

            function HeaderInvoice({ invoiceData }: any) {
                const styles = StyleSheet.create({
                    taxInvoice: {
                        fontWeight: 'bold',
                        fontSize: 12,
                        marginTop: 5,
                        textTransform: 'uppercase',
                    },
                    buyersCopy: {
                        fontSize: 8,
                        color: 'gray',
                        marginTop: 3,
                    },
                    headerInvoice: {
                        flexDirection: 'column',
                        marginTop: 3,
                        width: '33%',
                    },
                    invoiceNo: {
                        fontSize: 10,
                        fontWeight: 'bold',
                        marginTop: 3,
                    },
                })
                const ii = invoiceData.invoiceInfo
                return (
                    <View style={styles.headerInvoice}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text style={styles.taxInvoice}>
                                {invoiceData.invoiceInfo.title}
                            </Text>
                            <Text style={styles.buyersCopy}>
                                {invoiceData.invoiceInfo.titleRight}
                            </Text>
                        </View>

                        <Text style={styles.invoiceNo}>
                            Invoice #: {ii.invoiceNo}
                        </Text>
                        <Text style={gStyles.normal}>
                            Date: {ii.invoiceDate}
                        </Text>
                        <Text style={gStyles.normal}>
                            {''.concat('Type: ', ii.type)}
                        </Text>
                    </View>
                )
            }
        }

        function SubHeaderBlock({ invoiceData }: any) {
            const styles = StyleSheet.create({
                SubHeaderBlock: {
                    // marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 7,
                    // borderBottom: 1,
                },
                customerDetailsCont: {
                    flexDirection: 'column',
                    width: '60%',
                },
                shippingAddressCont: {
                    flexDirection: 'column',
                    width: '33%',
                },
                bold: {
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginTop: 2,
                },
            })
            const ib = invoiceData.billTo
            const is = invoiceData.shipTo
            return (
                <View style={styles.SubHeaderBlock}>
                    <View style={styles.customerDetailsCont}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                            Customer Details
                        </Text>
                        <Text style={styles.bold}>
                            {''.concat('GSTIN ', ib.gstin || '')}
                        </Text>
                        <Text style={gStyles.normal}>
                            {''.concat(
                                ib.address1,
                                ' ',
                                ib.address2 || '',
                                ' Pin: ',
                                ib.pin || '',
                                ' Ph: ',
                                ib.phone || '',
                                ' email:',
                                ib.email || ''
                            )}
                        </Text>
                        <Text style={gStyles.bold}>
                            {''.concat(
                                'Place of supply:',
                                ib.stateName || '',
                                ' State Code: ',
                                ib.stateCode || ''
                            )}
                        </Text>
                    </View>
                    <View style={styles.shippingAddressCont}>
                        <Text style={styles.bold}> Shipping Address</Text>
                        <Text style={gStyles.normal}>
                            {''.concat(
                                is.name ? is.name : '',
                                is.address1 ? ' ' + is.address1 : '',
                                is.address2 ? ' ' + is.address2 : '',
                                is.pin ? ' Pin:' + is.pin : '',
                                is.phone ? ' Ph:' + is.phone : '',
                                is.email ? ' email:' + is.email : '',
                                is.state ? ' State:' + is.state : '',
                                is.country ? ' Country: ' + is.country : ''
                            )}
                        </Text>
                    </View>
                </View>
            )
        }

        function ItemsTable({ invoiceData }: any) {
            return (
                <View>
                    <TableHeader />
                    <TableItems />
                </View>
            )

            function TableHeader() {
                const styles = StyleSheet.create({
                    header: {
                        paddingTop: 5,
                        flexDirection: 'row',
                        paddingBottom: 5,
                        marginBottom: 5,
                    },
                })
                return (
                    <View style={[styles.header, { borderBottom: 1 }]} fixed>
                        <Text style={[gStyles.bold, { width: 20 }]}>#</Text>
                        <Text style={[gStyles.bold, { width: 200 }]}>
                            Items
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 30, textAlign: 'right' },
                            ]}>
                            Qty
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 60, textAlign: 'right' },
                            ]}>
                            Rate
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 40, textAlign: 'right' },
                            ]}>
                            Disc
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 80, textAlign: 'right' },
                            ]}>
                            Aggregate
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 60, textAlign: 'right' },
                            ]}>
                            Tax amount &nbsp;
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 6, textAlign: 'right' },
                            ]}>
                            (%)
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 90, textAlign: 'right' },
                            ]}>
                            Amount
                        </Text>
                    </View>
                    // </View>
                )
            }

            function TableItems() {
                const ii: any[] = invoiceData.items
                let counter = 0
                const rows = ii.map((x: any, index: number) => {
                    return (
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingBottom: 5,
                            }}
                            key={keyGen()}>
                            <Text style={[gStyles.normal, { width: 20 }]}>
                                {index + 1}
                            </Text>
                            <Text style={[gStyles.normal, { width: 200 }]}>
                                {x.desc}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 30, textAlign: 'right' },
                                ]}>
                                {x.qty}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 60, textAlign: 'right' },
                                ]}>
                                {x.price}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 40, textAlign: 'right' },
                                ]}>
                                {x.discount}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 80, textAlign: 'right' },
                                ]}>
                                {x.aggr}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 60, textAlign: 'right' },
                                ]}>
                                {x.gst} &nbsp;
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 6, textAlign: 'right' },
                                ]}>
                                {''.concat(' (', x.gstRate, ')')}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 90, textAlign: 'right' },
                                ]}>
                                {x.amount}
                            </Text>
                        </View>
                    )
                })
                return <View style={{ flexDirection: 'column' }}>{rows}</View>

                function keyGen() {
                    return ++counter
                }
            }
        }

        function SummaryBlock({ invoiceData }: any) {
            const s = invoiceData.summary
            const r = invoiceData.receipts

            function Summary() {
                const styles = StyleSheet.create({
                    summary: {
                        flexDirection: 'column',
                        fontSize: 9,
                        textAlign: 'right',
                        marginTop: 5,
                    },
                    label: {
                        width: 100,
                        marginBottom: 3,
                    },
                    value: {
                        width: 70,
                        marginBottom: 3,
                    },
                })
                return (
                    <View style={styles.summary}>
                        <View
                            style={{
                                fontWeight: 'bold',
                                flexDirection: 'row',
                            }}>
                            <Text style={styles.label}>Aggregate amount:</Text>
                            <Text style={styles.value}>{s.aggr}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Cgst:</Text>
                            <Text style={styles.value}>{s.cgst}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Sgst:</Text>
                            <Text style={styles.value}>{s.sgst}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Igst:</Text>
                            <Text style={styles.value}>{s.igst}</Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 'bold',
                                flexDirection: 'row',
                            }}>
                            <Text style={styles.label}>Total:</Text>
                            <Text style={styles.value}>{s.amount}</Text>
                        </View>
                    </View>
                )
            }

            function ReceiptsTable() {
                const styles = StyleSheet.create({
                    header: {
                        flexDirection: 'row',
                        fontWeight: 'bold',
                        fontSize: 8,
                        textDecoration: 'underline',
                        marginBottom: 2,
                    },
                    receiptItems: {
                        flexDirection: 'row',
                        fontSize: 8,
                        marginBottom: 2,
                    },
                })
                function Header() {
                    return (
                        <View style={styles.header}>
                            <Text style={{ width: 10 }}>#</Text>
                            <Text style={{ width: 60 }}>Type</Text>
                            <Text style={{ width: 60 }}>Instrument</Text>
                            <Text style={{ width: 60 }}>Remarks</Text>
                            <Text style={{ width: 40, textAlign: 'right' }}>
                                Amount
                            </Text>
                        </View>
                    )
                }

                function ReceiptItems() {
                    let counter = 0
                    const rows = r.map((x: any, index: number) => {
                        return (
                            <View style={styles.receiptItems} key={keyGen()}>
                                <Text style={{ width: 10 }}>{index + 1}</Text>
                                <Text style={{ width: 60 }}>{x.type}</Text>
                                <Text style={{ width: 60 }}>
                                    {x.instrument}
                                </Text>
                                <Text style={{ width: 60 }}>{x.remarks}</Text>
                                <Text style={{ width: 40, textAlign: 'right' }}>
                                    {x.amount}
                                </Text>
                            </View>
                        )
                    })
                    return (
                        <View style={{ flexDirection: 'column' }}>{rows}</View>
                    )
                    function keyGen() {
                        return ++counter
                    }
                }

                return (
                    <View>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                            Receipts
                        </Text>
                        <Header />
                        <ReceiptItems />
                    </View>
                )
            }

            function Signatory() {
                const styles = StyleSheet.create({
                    signatoryItem: {
                        fontSize: 8,
                        fontWeight: 'bold',
                        // width: 130
                    },
                })
                return (
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}>
                        <Text></Text>
                        <Text></Text>
                        <Text style={styles.signatoryItem}>
                            Authorised signatory
                        </Text>
                        <Text style={[styles.signatoryItem, { fontSize: 7 }]}>
                            Computer generated invoice{' '}
                        </Text>
                        <Text style={[styles.signatoryItem, { fontSize: 7 }]}>
                            (No signature required)
                        </Text>
                    </View>
                )
            }

            return (
                <View style={gStyles.summaryBlock}>
                    <ReceiptsTable />
                    <Signatory />
                    <Summary />
                </View>
            )
        }

        function Footer({ invoiceData }: any) {
            return (
                <View style={[gStyles.footer]}>
                    <Text style={{ fontSize: 10 }}>
                        One lac twenty thousand only
                    </Text>
                    <Text
                        style={{
                            fontSize: 10,
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                        }}>
                        Amount payable:{' '}
                        {toDecimalFormat(invoiceData?.summary?.amount || 0)}
                    </Text>
                </View>
            )
        }

        function PageNo() {
            return (
                <Text
                    style={gStyles.pageNumber}
                    render={({ pageNumber, totalPages }: any) =>
                        `${pageNumber} / ${totalPages}`
                    }
                    fixed></Text>
            )
        }
    }

    return { InvoicePdf }
}
export { useInvoiceA }
