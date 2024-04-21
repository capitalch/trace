import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getFromBag, moment, useSharedElements } from "../inventory/redirect";

export function PurchaseInvoicePdf({ invoiceData }: any) {
    return (<Document>
        <Page size="A4" style={gStyles.page}>
            <HeaderBlock invoiceData={invoiceData} />
            <SubHeaderBlock />
            <ItemsTable invoiceData={invoiceData} />
            <FooterBlock invoiceData={invoiceData} />
        </Page>
    </Document>)
}

function HeaderBlock({ invoiceData }: any) {
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
        const contact: any = invoiceData?.businessContacts
        const address: any = contact?.jAddress[0]
        const styles = StyleSheet.create({
            headerCompany: {
                flexDirection: 'column',
                marginTop: 8,
                width: '60%',
                paddingRight: 8,
            },
            companyName: {
                fontSize: 12,
                fontWeight: 'bold',
            },
            gstin: {
                marginTop: 3,
                fontSize: 10,
                fontWeight: 'bold',
            },
            address: {
                fontSize: 8,
                flexWrap: 'wrap',
            },
        })
        return (<View style={styles.headerCompany}>
            <Text style={styles.companyName}>{contact?.contactName || ''}</Text>
            <Text style={styles.gstin}>GSTIN: {contact?.gstin || ''}</Text>
            <Text style={styles.address}>{''.concat(address?.address1 || ''
                , ' ', address?.address2 || ''
                , ' State: ', address?.state
                , ' PIN: ', address?.pin || ''
                , ' email: ', contact?.email || ''
                , ' PH: '
                , contact?.mobileNumber || contact?.landPhone || '')}</Text>
        </View>)
    }
    
    function HeaderInvoice({ invoiceData }: any) {
        const dateFormat = getFromBag('dateFormat')
        const tranH: any = invoiceData?.tranH
        const tranType: string = (tranH.tranTypeId=== 5) ? 'Purchase' : 'Purchase return'
        const invoiceDate = moment(tranH.tranDate).format(dateFormat)
        const styles = StyleSheet.create({
            headerInvoice: {
                flexDirection: 'column',
                marginTop: 8,
                width: '40%',
            },
            invoiceNumber: {
                fontSize: 10,
                fontWeight: 'bold',
            },
            invoiceDate: {
                fontSize: 10,
            },
        })
        return (<View style={styles.headerInvoice}>
            <Text style={styles.invoiceNumber}>Invoice #: {tranH?.userRefNo}</Text>
            <Text style={styles.invoiceDate}>Inv date: {invoiceDate}</Text>
            <Text style={gStyles.bold}>{''.concat('Type: ', tranType)}</Text>
            <Text style={{ fontSize: 8, marginTop: 3 }}>Auto ref #: {tranH?.autoRefNo}</Text>
        </View>)
    }
}

function SubHeaderBlock() {
    const unitInfo = getFromBag('unitInfo')
    const styles = StyleSheet.create({
        SubHeaderBlock: {
            flexDirection: 'column',
            paddingBottom: 7,
            // borderBottom: 1,
            // borderBottomColor: 'black',
        },
        unitName: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        bold: {
            fontSize: 10,
            fontWeight: 'bold',
            marginTop: 2,
        },
    })
    return (<View style={styles.SubHeaderBlock}>
        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Customer Details</Text>
        <Text style={styles.unitName}>{unitInfo?.unitName || ''}</Text>
        <Text style={styles.bold}>{''.concat('GSTIN: ', unitInfo?.gstin || '')}</Text>
        <Text style={styles.bold}>{'Address: '.concat(unitInfo?.address1 || '', ' ', unitInfo?.address2 || '', ' PIN: ', unitInfo?.pin || '', ' ', unitInfo?.email || '', ' State: ', unitInfo?.state)}</Text>
    </View>)
}

function ItemsTable({ invoiceData }: any) {
    const { toDecimalFormat} = useSharedElements()
    return (
        <View>
            <TableHeader />
            <TableItems />
            <TableFooter />
        </View>
    )

    function TableHeader() {
        const styles = StyleSheet.create({
            header: {
                paddingTop: 3,
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
        )
    }

    function TableItems() {
        const ii: any[] = invoiceData.salePurchaseDetails.map((x: any) => ({
            desc: ''.concat(
                x.catName,
                ', ',
                x.brandName,
                ', ',
                x.label,
                x.serialNumbers ? ', Sl nos: '.concat(x.serialNumbers) : '',
                ', HSN ',
                x.hsn, ', ', x.remarks ? 'Remarks: ' + x.remarks : ''
            ),
            qty: x.qty,
            price: toDecimalFormat(x.price),
            discount: toDecimalFormat(x.discount),
            aggr: toDecimalFormat(x.qty * (x.price - x.discount)),
            cgst: toDecimalFormat(x.cgst),
            sgst: toDecimalFormat(x.sgst),
            igst: toDecimalFormat(x.igst),
            gst: toDecimalFormat(x.cgst + x.sgst + x.igst),
            gstRate: toDecimalFormat(x.gstRate),
            amount: toDecimalFormat(x.amount),
        }))
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
                        {''.concat('(', x.gstRate, ')')}
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
        return <View style={{ flexDirection: 'column', borderBottom: 1, }}>{rows}</View>

        function keyGen() {
            return ++counter
        }
    }

    function TableFooter() {
        const gstObj = invoiceData.extGstTranD
        const summary = { //summary
            cgst: toDecimalFormat(gstObj?.cgst || 0.0),
            sgst: toDecimalFormat(gstObj?.sgst || 0.0),
            igst: toDecimalFormat(gstObj?.igst || 0.0),
            amount: 0,
            aggr: 0,
            taxAmount: toDecimalFormat((gstObj?.cgst || 0.0) + (gstObj?.sgst || 0.0) + (gstObj?.igst || 0.0)),
            qty: 0,
            discount: 0,
        }
        const temp = invoiceData.salePurchaseDetails.reduce((prev: any, current: any) => {
            const obj = {
                qty: prev.qty + (current.qty || 0),
                discount: (prev.discount + current.discount || 0),
                aggr: (prev.aggr + ((current.qty * (current.price - current.discount)) || 0))
            }
            return (obj)
        }, { qty: 0, discount: 0, aggr: 0 })

        summary.qty = temp.qty
        summary.discount = toDecimalFormat(temp.discount)
        
        // summary.amountInWords = ti.amountInWords
        summary.aggr = toDecimalFormat(temp.aggr)
        summary.amount = toDecimalFormat(temp.aggr + (gstObj?.cgst || 0.0) + (gstObj?.sgst || 0.0) + (gstObj?.igst || 0.0))
        const s = summary
        const styles = StyleSheet.create({
            footer: {
                paddingTop: 2,
                flexDirection: 'row',
                paddingBottom: 2,
                borderBottom: 1,
            },
        })
        return (
            <View style={[styles.footer]} fixed>
                <Text style={[gStyles.bold, { width: 20 }]}></Text>
                <Text style={[gStyles.bold, { width: 200 }]}>
                    Total
                </Text>
                <Text
                    style={[
                        gStyles.bold,
                        { width: 30, textAlign: 'right' },
                    ]}>
                    {s.qty}
                </Text>
                <Text
                    style={[
                        gStyles.bold,
                        { width: 60, textAlign: 'right' },
                    ]}>
                </Text>
                <Text
                    style={[
                        gStyles.bold,
                        { width: 40, textAlign: 'right' },
                    ]}>
                    {s.discount}
                </Text>
                <Text
                    style={[
                        gStyles.bold,
                        { width: 80, textAlign: 'right' },
                    ]}>
                    {s.aggr}
                </Text>
                <Text
                    style={[
                        gStyles.bold,
                        { width: 60, textAlign: 'right' },
                    ]}>
                    {s.taxAmount} &nbsp;
                </Text>
                <Text
                    style={[
                        gStyles.bold,
                        { width: 6, textAlign: 'right' },
                    ]}>
                </Text>
                <Text
                    style={[
                        gStyles.bold,
                        { width: 90, textAlign: 'right' },
                    ]}>
                    {s.amount}
                </Text>
            </View>
        )
    }
}

function FooterBlock({invoiceData}: any) {
    const tranD = invoiceData.tranD
    const { toDecimalFormat, numberToWordsInRs} = useSharedElements()
    let invoiceAmount = 0.00
    
    for(const item of tranD) {
        if(item.accClass === 'purchase'){
            invoiceAmount = item.amount
            break
        }
    }
    return(<View style={gStyles.footer}>
        <Text style = {{fontSize: 8, flexWrap:'wrap', width: '65%'}}>
            {numberToWordsInRs(invoiceAmount)}
        </Text>
        <Text style={{fontSize: 12, fontWeight:'extrabold'}}>
            {'Invoice amount: '.concat(toDecimalFormat(invoiceAmount))}
        </Text>
    </View>)
}

const gStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
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
    footer: {
        marginTop: 10,
        // fontWeight: 'bold',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        width: '100%',
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