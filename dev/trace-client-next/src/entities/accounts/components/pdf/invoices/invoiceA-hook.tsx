import { useSharedElements } from '../../common/shared-elements-hook'
function useInvoiceA() {
    const {
        MDocument,
        MPage,
        MStyleSheet,
        toDecimalFormat,
        MText,
        MView,
    } = useSharedElements()

    function InvoicePdf({ invoiceData }: any) {
        // console.log(JSON.stringify(invoiceData))
        const gStyles = MStyleSheet.create({
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
            },
            footer: {
                // position: 'absolute',
                // bottom: 30,
                fontWeight: 'bold',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                // left: 30,
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
            <MDocument>
                <MPage size="A4" style={gStyles.page}>
                    <HeaderBlock invoiceData={invoiceData} />
                    <SubHeaderBlock invoiceData={invoiceData} />
                    <ItemsTable invoiceData={invoiceData} />
                    <SummaryBlock invoiceData={invoiceData} />
                    <Footer invoiceData={invoiceData} />
                    <PageNo />
                </MPage>
            </MDocument>
        )

        function HeaderBlock({ invoiceData }: any) {
            const styles = MStyleSheet.create({
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
                <MView style={styles.headerBlock} fixed={true}>
                    <HeaderCompany invoiceData={invoiceData} />
                    <HeaderInvoice invoiceData={invoiceData} />
                </MView>
            )

            function HeaderCompany({ invoiceData }: any) {
                const styles = MStyleSheet.create({
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
                    <MView style={styles.headerCompany} fixed={true}>
                        <MText style={styles.companyName}>{ci.name}</MText>
                        <MText style={styles.gstin}>GSTIN {ci.gstin}</MText>
                        <MText style={styles.address}>
                            {''.concat(
                                ci.address1 || '',
                                ' ',
                                ci.address2 || '',
                                ' PIN: ',
                                ci.pin || '',
                                ' Ph: ',
                                ci.phone || '',
                                ' email: ',
                                ci.email || '',
                                ' Web: ',
                                ci.web || ''
                            )}
                        </MText>
                        <MText style={styles.address}>
                            {''.concat(
                                ci.stateName || '',
                                ' ',
                                'State code: ',
                                ci.stateCode || ''
                            )}
                        </MText>
                    </MView>
                )
            }

            function HeaderInvoice({ invoiceData }: any) {
                const styles = MStyleSheet.create({
                    taxInvoice: {
                        fontWeight: 'bold',
                        fontSize: 12,
                        marginTop: 5,
                        textTransform: 'uppercase',
                    },
                    buyersCopy: {
                        fontSize: 8,
                        color: 'black',
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
                    <MView style={styles.headerInvoice}>
                        <MView
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <MText style={styles.taxInvoice}>
                                {invoiceData.invoiceInfo.title}
                            </MText>
                            <MText style={styles.buyersCopy}>
                                {invoiceData.invoiceInfo.titleRight}
                            </MText>
                        </MView>

                        <MText style={styles.invoiceNo}>
                            Invoice #: {ii.invoiceNo}
                        </MText>
                        <MText style={gStyles.normal}>
                            Date: {ii.invoiceDate}
                        </MText>
                        <MText style={gStyles.normal}>
                            {''.concat('Type: ', ii.type)}
                        </MText>
                    </MView>
                )
            }
        }

        function SubHeaderBlock({ invoiceData }: any) {
            const styles = MStyleSheet.create({
                SubHeaderBlock: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 7,
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
                <MView style={styles.SubHeaderBlock}>
                    <MView style={styles.customerDetailsCont}>
                        <MText style={{ fontSize: 10, fontWeight: 'bold' }}>
                            Customer Details
                        </MText>
                        <MText style={styles.bold}>
                            {ib.name || ''}
                        </MText>
                        <MText style={styles.bold}>
                            {''.concat('GSTIN ', ib.gstin || '')}
                        </MText>
                        <MText style={gStyles.normal}>
                            {''.concat(
                                ib.address1 || '',
                                ' ',
                                ib.address2 || '',
                                ' Pin: ',
                                ib.pin || '',
                                ' Ph: ',
                                ib.phone || '',
                                ' email:',
                                ib.email || ''
                            )}
                        </MText>
                        <MText style={gStyles.bold}>
                            {''.concat(
                                'Place of supply:',
                                ib?.stateName || '',
                                ' State Code: ',
                                ib?.stateCode || ''
                            )}
                        </MText>
                    </MView>
                    <MView style={styles.shippingAddressCont}>
                        <MText style={{ fontSize: 10, fontWeight: 'bold' }}> Shipping Address</MText>
                        <MText style={gStyles.normal}>
                            {''.concat(
                                is.name ? is.name + ', ' : '',
                                is.address1 ? ' ' + is.address1 : '',
                                is.address2 ? ' ' + is.address2 : '',
                                is.pin ? ' Pin:' + is.pin : '',
                                is.phone ? ' Ph:' + is.phone : '',
                                is.email ? ' email:' + is.email : '',
                                is.state ? ' State:' + is.state : '',
                                is.country ? ' Country: ' + is.country : ''
                            )}
                        </MText>
                    </MView>
                </MView>
            )
        }

        function ItemsTable({ invoiceData }: any) {
            return (
                <MView>
                    <TableHeader />
                    <TableItems />
                    <TableFooter />
                </MView>
            )

            function TableHeader() {
                const styles = MStyleSheet.create({
                    header: {
                        paddingTop: 3,
                        flexDirection: 'row',
                        paddingBottom: 5,
                        marginBottom: 5,
                    },
                })
                return (
                    <MView style={[styles.header, { borderBottom: 1 }]} fixed>
                        <MText style={[gStyles.bold, { width: 20 }]}>#</MText>
                        <MText style={[gStyles.bold, { width: 200 }]}>
                            Items
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 30, textAlign: 'right' },
                            ]}>
                            Qty
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 60, textAlign: 'right' },
                            ]}>
                            Rate
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 40, textAlign: 'right' },
                            ]}>
                            Disc
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 80, textAlign: 'right' },
                            ]}>
                            Aggregate
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 60, textAlign: 'right' },
                            ]}>
                            Tax amount &nbsp;
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 6, textAlign: 'right' },
                            ]}>
                            (%)
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 90, textAlign: 'right' },
                            ]}>
                            Amount
                        </MText>
                    </MView>
                )
            }

            function TableItems() {
                const ii: any[] = invoiceData.items
                let counter = 0
                const rows = ii.map((x: any, index: number) => {
                    return (
                        <MView
                            style={{
                                flexDirection: 'row',
                                paddingBottom: 5,                               
                            }}
                            key={keyGen()}>
                            <MText style={[gStyles.normal, { width: 20 }]}>
                                {index + 1}
                            </MText>
                            <MText style={[gStyles.normal, { width: 200 }]}>
                                {x.desc}
                            </MText>
                            <MText
                                style={[
                                    gStyles.normal,
                                    { width: 30, textAlign: 'right' },
                                ]}>
                                {x.qty}
                            </MText>
                            <MText
                                style={[
                                    gStyles.normal,
                                    { width: 60, textAlign: 'right' },
                                ]}>
                                {x.price}
                            </MText>
                            <MText
                                style={[
                                    gStyles.normal,
                                    { width: 40, textAlign: 'right' },
                                ]}>
                                {x.discount}
                            </MText>
                            <MText
                                style={[
                                    gStyles.normal,
                                    { width: 80, textAlign: 'right' },
                                ]}>
                                {x.aggr}
                            </MText>
                            <MText
                                style={[
                                    gStyles.normal,
                                    { width: 60, textAlign: 'right' },
                                ]}>
                                {x.gst} &nbsp;
                            </MText>
                            <MText
                                style={[
                                    gStyles.normal,
                                    { width: 6, textAlign: 'right' },
                                ]}>
                                {''.concat('(', x.gstRate, ')')}
                            </MText>
                            <MText
                                style={[
                                    gStyles.normal,
                                    { width: 90, textAlign: 'right' },
                                ]}>
                                {x.amount}
                            </MText>
                        </MView>
                    )
                })
                return <MView style={{ flexDirection: 'column',  borderBottom:1, }}>{rows}</MView>

                function keyGen() {
                    return ++counter
                }
            }

            function TableFooter() {
                const s = invoiceData.summary
                const styles = MStyleSheet.create({
                    footer: {
                        paddingTop: 2,
                        flexDirection: 'row',
                        paddingBottom: 2,
                        borderBottom:1,
                    },
                })
                return (
                    <MView style={[styles.footer]} fixed>
                        <MText style={[gStyles.bold, { width: 20 }]}></MText>
                        <MText style={[gStyles.bold, { width: 200 }]}>
                            Total
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 30, textAlign: 'right' },
                            ]}>
                            {s.qty}
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 60, textAlign: 'right' },
                            ]}>
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 40, textAlign: 'right' },
                            ]}>
                            {s.discount}
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 80, textAlign: 'right' },
                            ]}>
                            {s.aggr}
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 60, textAlign: 'right' },
                            ]}>
                            {s.taxAmount} &nbsp;
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 6, textAlign: 'right' },
                            ]}>
                        </MText>
                        <MText
                            style={[
                                gStyles.bold,
                                { width: 90, textAlign: 'right' },
                            ]}>
                            {s.amount}
                        </MText>
                    </MView>
                    // </View>
                )
            }
        }

        function SummaryBlock({ invoiceData }: any) {
            const s = invoiceData.summary
            const r = invoiceData.receipts

            function Summary() {
                const styles = MStyleSheet.create({
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
                    <MView style={styles.summary}>
                        <MView
                            style={{
                                fontWeight: 'bold',
                                flexDirection: 'row',
                            }}>
                            <MText style={styles.label}>Aggregate amount:</MText>
                            <MText style={styles.value}>{s.aggr}</MText>
                        </MView>
                        <MView style={{ flexDirection: 'row' }}>
                            <MText style={styles.label}>Cgst:</MText>
                            <MText style={styles.value}>{s.cgst}</MText>
                        </MView>
                        <MView style={{ flexDirection: 'row' }}>
                            <MText style={styles.label}>Sgst:</MText>
                            <MText style={styles.value}>{s.sgst}</MText>
                        </MView>
                        <MView style={{ flexDirection: 'row' }}>
                            <MText style={styles.label}>Igst:</MText>
                            <MText style={styles.value}>{s.igst}</MText>
                        </MView>
                        <MView
                            style={{
                                fontWeight: 'bold',
                                flexDirection: 'row',
                            }}>
                            <MText style={styles.label}>Total amount:</MText>
                            <MText style={styles.value}>{s.amount}</MText>
                        </MView>
                    </MView>
                )
            }

            function ReceiptsTable() {
                const styles = MStyleSheet.create({
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
                        <MView style={styles.header}>
                            <MText style={{ width: 10 }}>#</MText>
                            <MText style={{ width: 60 }}>Type</MText>
                            <MText style={{ width: 60 }}>Instrument</MText>
                            <MText style={{ width: 60 }}>Remarks</MText>
                            <MText style={{ width: 40, textAlign: 'right' }}>
                                Amount
                            </MText>
                        </MView>
                    )
                }

                function ReceiptItems() {
                    let counter = 0
                    const rows = r.map((x: any, index: number) => {
                        return (
                            <MView style={styles.receiptItems} key={keyGen()}>
                                <MText style={{ width: 10 }}>{index + 1}</MText>
                                <MText style={{ width: 60 }}>{x.type}</MText>
                                <MText style={{ width: 60 }}>
                                    {x.instrument}
                                </MText>
                                <MText style={{ width: 60 }}>{x.remarks}</MText>
                                <MText style={{ width: 40, textAlign: 'right' }}>
                                    {x.amount}
                                </MText>
                            </MView>
                        )
                    })
                    return (
                        <MView style={{ flexDirection: 'column' }}>{rows}</MView>
                    )
                    function keyGen() {
                        return ++counter
                    }
                }

                return (
                    <MView>
                        <MText style={{ fontSize: 10, fontWeight: 'bold' }}>
                            Receipts
                        </MText>
                        <Header />
                        <ReceiptItems />
                    </MView>
                )
            }

            function Signatory() {
                const styles = MStyleSheet.create({
                    signatoryItem: {
                        fontSize: 8,
                        fontWeight: 'bold',
                    },
                })
                return (
                    <MView
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}>
                        <MText></MText>
                        <MText></MText>
                        <MText style={styles.signatoryItem}>
                            Authorised signatory
                        </MText>
                        <MText style={[styles.signatoryItem, { fontSize: 7 }]}>
                            Computer generated invoice{' '}
                        </MText>
                        <MText style={[styles.signatoryItem, { fontSize: 7 }]}>
                            (No signature required)
                        </MText>
                    </MView>
                )
            }

            return (
                <MView style={gStyles.summaryBlock}>
                    <ReceiptsTable />
                    <Signatory />
                    <Summary />
                </MView>
            )
        }

        function Footer({ invoiceData }: any) {
            return (
                <MView style={[gStyles.footer]}>
                    <MText style={{ fontSize: 10, flexWrap:'wrap', width:'72%' }}>
                        {invoiceData?.summary?.amountInWords || ''}
                    </MText>
                    <MText
                        style={{
                            fontSize: 10,
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                        }}>
                        Amount payable:{' '}
                        {toDecimalFormat(invoiceData?.summary?.amount || 0)}
                    </MText>
                </MView>
            )
        }

        function PageNo() {
            return (
                <MText
                    style={gStyles.pageNumber}
                    render={({ pageNumber, totalPages }: any) =>
                        `${pageNumber} / ${totalPages}`
                    }
                    fixed></MText>
            )
        }
    }

    return { InvoicePdf }
}
export { useInvoiceA }
