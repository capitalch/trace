import { useSharedElements } from '../../common/shared-elements-hook'
import {
    _,
    moment,
} from '../../../../../imports/regular-imports'

function PdfVoucher({ arbitraryData }: any) {
    const {
        accountsMessages,
        Document,
        numberToWordsInRs,
        Page,
        StyleSheet,
        Text,
        View,
        getAccountName,
        getFromBag,
        toDecimalFormat,
    } = useSharedElements()
    const ad = arbitraryData

    const gStyles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
            paddingBottom: 30,
            fontFamily: 'Helvetica',
        },
        normal: {
            fontSize: 8,
            marginTop: 2,
        },
        bold: {
            fontSize: 8,
            fontWeight: 'bold',
            marginTop: 2,
        },
    })

    preparePdfVoucherObject()
    return (
        <Document>
            <Page size="A4" style={gStyles.page}>
                <HeaderBlock vou={ad.pdfVoucher} />
                <TransactionBlock vou={ad.pdfVoucher} />
                <SummaryBlock vou={ad.pdfVoucher} />
            </Page>
        </Document>
    )

    function HeaderBlock({ vou }: any) {
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
                <HeaderCompany vou={vou} />
                <HeaderVoucher vou={vou} />
            </View>
        )

        function HeaderCompany({ vou }: any) {
            const branchObject = getFromBag('branchObject')
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
            })
            const vu = vou.unitInfo
            return (
                <View style={styles.headerCompany} fixed={true}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.companyName}>{vu.unitName}</Text>
                        <Text style={{ fontSize: 12 }}>{branchObject?.branchName || ''}</Text>
                    </View>
                    <Text style={styles.gstin}>Gstin: {vu.gstin}</Text>
                    <Text style={gStyles.normal}>
                        {''.concat(
                            vu.address1,
                            ' ',
                            vu.address2,
                            ' PIN: ',
                            vu.pin,
                            ' Ph: ',
                            vu.phone,
                            ' email: ',
                            vu.email,
                            ' Web: ',
                            vu.webSite || ''
                        )}
                    </Text>
                </View>
            )
        }

        function HeaderVoucher({ vou }: any) {
            const styles = StyleSheet.create({
                headerVoucher: {
                    flexDirection: 'column',
                    marginTop: 3,
                    width: '30%',
                },
                voucherType: {
                    fontWeight: 'bold',
                    fontSize: 10,
                    marginTop: 5,
                },
            })

            return (
                <View style={styles.headerVoucher}>
                    <Text style={styles.voucherType}>
                        Voucher type: {_.capitalize(vou.header.voucherType)}
                    </Text>
                    <Text style={gStyles.bold}>Date: {vou.tranDate}</Text>
                    <Text style={gStyles.bold}>
                        Ref no: {vou.header.autoRefNo}
                    </Text>
                    <Text style={gStyles.normal}>
                        User ref: {vou.header.userRefNo || ''}
                    </Text>
                    <Text style={gStyles.normal}>
                        Remarks: {vou.header.remarks || ''}
                    </Text>
                </View>
            )
        }
    }

    function TransactionBlock({ vou }: any) {
        const styles = StyleSheet.create({
            transactions: {
                flexDirection: 'column',
            },
        })

        return (
            <View style={styles.transactions}>
                <Text
                    style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        marginTop: 2,
                        textDecoration: 'underline',
                        marginBottom: 2,
                    }}>
                    Transactions
                </Text>
                <TranHeader vou={vou} />
                <TranDetails vou={vou} />
                <TranFooter vou={vou} />
            </View>
        )

        function TranHeader({ vou }: any) {
            const styles = StyleSheet.create({
                transactionHeader: {
                    flexDirection: 'row',
                    paddingBottom: 3,
                    borderBottom: 1,
                },
            })

            return (
                <View style={styles.transactionHeader}>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 20, textAlign: 'left' },
                        ]}>
                        #
                    </Text>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 130, textAlign: 'left' },
                        ]}>
                        Account name
                    </Text>
                    <Text style={[gStyles.bold, { width: 60 }]}>Instr no</Text>
                    <Text style={[gStyles.bold, { width: 60 }]}>Ref no</Text>
                    <Text style={[gStyles.bold, { width: 70 }]}>Remarks</Text>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 70, textAlign: 'right' },
                        ]}>
                        Debits
                    </Text>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 70, textAlign: 'right' },
                        ]}>
                        Credits
                    </Text>
                </View>
            )
        }

        function TranDetails({ vou }: any) {
            return <Details vou={vou} />

            function Details({ vou }: any) {
                let counter = 0
                const rows = vou.transactions.map((x: any, index: number) => {
                    let gstInfo = ''
                    if (!_.isEmpty(x?.gst)) {
                        const gst = x.gst
                        gstInfo = ''.concat(
                            'Gstin:', gst.gstin, ' '
                            , 'Hsn:', gst.hsn, ' '
                            , 'Rate:', gst.rate, ' '
                            , 'Cgst:', toDecimalFormat(gst.cgst), ' '
                            , 'Sgst:', toDecimalFormat(gst.sgst), ' '
                            , 'Igst:', toDecimalFormat(gst.igst))
                    }
                    const gstInfoDebit = (x.dc === 'D') ? gstInfo : ''
                    const gstInfoCredit = (x.dc === 'C') ? gstInfo : ''
                    return (
                        <View
                            style={{ flexDirection: 'row', paddingBottom: 3 }}
                            key={keyGen()}>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 20, textAlign: 'left' },
                                ]}>
                                {index + 1}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 130, textAlign: 'left' },
                                ]}>
                                {x.accName}
                            </Text>
                            <Text style={[gStyles.normal, { width: 60 }]}>
                                {x.instrNo || ''}
                            </Text>
                            <Text style={[gStyles.normal, { width: 60 }]}>
                                {x.lineRefNo || ''}
                            </Text>
                            <Text style={[gStyles.normal, { width: 70 }]}>
                                {x.remarks || ''}
                            </Text>
                            <View style={{width: 70, textAlign: 'right'}}>
                                <Text
                                    style={[
                                        gStyles.normal,
                                    
                                    ]}>
                                    {x.dc === 'D' ? x.decimal : ''}
                                </Text>
                                <Text style={{fontSize:8}}>{gstInfoDebit}</Text>
                            </View>
                            <View style={{width: 70,textAlign: 'right'}}>
                                <Text
                                    style={[
                                        gStyles.normal,
                                        
                                    ]}>
                                    {x.dc === 'C' ? x.decimal : ''}
                                </Text>
                                <Text style={{fontSize:8}}>{gstInfoCredit}</Text>
                            </View>
                        </View>
                    )
                })
                return <View style={{ flexDirection: 'column' }}>{rows}</View>
                function keyGen() {
                    return ++counter
                }
            }
        }

        function TranFooter({ vou }: any) {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        fontSize: 8,
                        borderTop: 1,
                        paddingTop: 5,
                        borderBottom: 1,
                        paddingBottom: 5,
                    }}>
                    <Text style={{ width: 20 }}></Text>
                    <Text style={{ width: 130 }}>Total</Text>
                    <Text style={{ width: 190 }}></Text>
                    <Text style={{ width: 70, textAlign: 'right' }}>
                        {toDecimalFormat(vou.summary.totalDebits)}
                    </Text>
                    <Text style={{ width: 70, textAlign: 'right' }}>
                        {toDecimalFormat(vou.summary.totalCredits)}
                    </Text>
                </View>
            )
        }
    }

    function SummaryBlock({ vou }: any) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    fontSize: 9,
                    top: 10,
                    width: '100%'
                }}>
                <Text style={{ width: '65%' }}>{vou.summary.comments}</Text>
                <View style={{ flexDirection: 'column', width: '30%' }}>
                    <Text>For {vou.unitInfo.unitName}</Text>
                    <Text style={{ marginTop: 20 }}>Authorised signatory</Text>
                </View>
            </View>
        )
    }

    function preparePdfVoucherObject() {
        const dateFormat = getFromBag('dateFormat')
        ad.pdfVoucher = {}
        const vou: any = ad.pdfVoucher
        vou.unitInfo = getFromBag('unitInfo')
        vou.unitInfo.phone = ''.concat(
            vou.unitInfo.landPhone || '',
            ' ',
            vou.unitInfo.mobileNumber
        )
        vou.tranDate = moment(ad.header.tranDate).format(dateFormat)

        const debits = ad.debits.map((item: any) => ({
            ...item,
            decimal: toDecimalFormat(item.amount),
            accName: getAccountName(item.accId),
        }))
        const credits = ad.credits.map((item: any) => ({
            ...item,
            decimal: toDecimalFormat(item.amount),
            accName: getAccountName(item.accId),
        }))
        vou.transactions = debits.concat(credits)
        vou.header = ad.header
        vou.header.voucherType = getVoucherType(vou.header.tranTypeId)
        vou.summary = ad.summary
        vou.summary.amountInWords = numberToWordsInRs(
            vou.summary.totalDebits || 0
        )
        if (vou.header.tranTypeId === 3) {
            vou.summary.comments = accountsMessages.receivedWithThanks
                .replace('$rs', vou.summary.amountInWords)
                .replace('$person', credits[0].accName)
        } else {
            vou.summary.comments = accountsMessages.totalTransactions.replace(
                '$rs',
                vou.summary.amountInWords
            )
        }

        function getVoucherType(typeId: number) {
            const logic: any = {
                1: 'Journal',
                2: 'Payment',
                3: 'Receipt',
                6: 'Contra',
            }
            return logic[typeId]
        }
    }
}

export { PdfVoucher }
