import { useSharedElements } from '../../common/shared-elements-hook'
import { moment } from '../../../../../imports/regular-imports'
function PdfLedger({ ledgerData, accName }: any) {
    const {
        Document,
        Page,
        StyleSheet,
        Text,
        View,
        getFromBag,
        toDecimalFormat,
    } = useSharedElements()

    const ld = ledgerData
    const unitInfo = getFromBag('unitInfo')
    const finObject = getFromBag('finYearObject')
    const dateFormat = getFromBag('dateFormat')
    const startDate = moment(finObject.startDate, dateFormat).format(dateFormat)
    const endDate = moment(finObject.endDate, dateFormat).format(dateFormat)
    let closingBalance = 0
    const gStyles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
            paddingBottom: 30,
            fontFamily: 'Helvetica',
            fontSize: 8,
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

    prepareData()
    return (
        <Document>
            <Page size="A4" style={gStyles.page}>
                <HeaderBlock />
                <ItemsTable />
                <PageNo />
            </Page>
        </Document>
    )

    function HeaderBlock() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 5,
                    borderBottom: 1,
                    marginBottom: 5,
                }}
                fixed>
                <HeaderCompany />
                <HeaderAccount />
            </View>
        )

        function HeaderCompany() {
            const branchObject = getFromBag('branchObject')
            return (
                <View style={{ width: '65%', flexDirection: 'column' }} fixed>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                            {unitInfo.unitName}
                        </Text>
                        <Text style={{fontWeight:'bold'}}>{branchObject.branchName}</Text>
                    </View>
                    <Text style={[gStyles.normal, { lineHeight: 1.6 }]}>
                        {''.concat(
                            'GSTIN:',
                            unitInfo.gstin,
                            unitInfo.address1 || '',
                            ' ',
                            unitInfo.address2 || '',
                            ' ',
                            'pin:',
                            unitInfo.pin || '',
                            ', ph:',
                            unitInfo.landPhone || '',
                            ' ',
                            unitInfo.mobileNumber || '',
                            ' email:',
                            unitInfo.email || '',
                            ' ',
                            'web:',
                            unitInfo.webSite
                        )}
                    </Text>
                </View>
            )
        }

        function HeaderAccount() {
            return (
                <View style={{ width: '30%', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        Ledger account
                    </Text>
                    <Text style={[gStyles.bold, { fontSize: 10 }]}>
                        {accName}
                    </Text>
                    <Text style={gStyles.normal}>
                        {''.concat('From: ', startDate, ' To: ', endDate)}
                    </Text>
                </View>
            )
        }
    }

    function ItemsTable() {
        return (
            <View>
                <TableHeader />
                <TableItems />
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
                    <Text style={[gStyles.bold, { width: 47 }]}>Date</Text>
                    <Text style={[gStyles.bold, { width: 80 }]}>Ref</Text>
                    <Text style={[gStyles.bold, { width: 90 }]}>Account</Text>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 65, textAlign: 'right' },
                        ]}>
                        Debits
                    </Text>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 65, textAlign: 'right' },
                        ]}>
                        Credits
                    </Text>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 70, textAlign: 'right' },
                        ]}>
                        Balance
                    </Text>
                    <Text
                        style={[
                            gStyles.bold,
                            { width: 80, textAlign: 'left', marginLeft: 5 },
                        ]}>
                        Info
                    </Text>
                </View>
            )
        }

        function TableItems() {
            const rows = ld
                .map((x: any, index: number) => {
                    return (
                        <View style={{ flexDirection: 'row' }} key={x.id}>
                            <Text style={[gStyles.normal, { width: 20 }]}>
                                {x.id}
                            </Text>
                            <Text style={[gStyles.normal, { width: 47 }]}>
                                {moment(x.tranDate).format(dateFormat)}
                            </Text>
                            <Text style={[gStyles.normal, { width: 80 }]}>
                                {x.autoRefNo}
                            </Text>
                            <Text style={[gStyles.normal, { width: 90 }]}>
                                {x.otherAccounts}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 65, textAlign: 'right' },
                                ]}>
                                {x.debit ? toDecimalFormat(x.debit) : ''}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 65, textAlign: 'right' },
                                ]}>
                                {x.credit ? toDecimalFormat(x.credit) : ''}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 70, textAlign: 'right' },
                                ]}>
                                {x.ledgerBal >= 0
                                    ? toDecimalFormat(x.ledgerBal) + ' Dr'
                                    : toDecimalFormat(Math.abs(x.ledgerBal)) +
                                      ' Cr'}
                            </Text>
                            <Text
                                style={[
                                    gStyles.normal,
                                    { width: 80, marginLeft: 5 },
                                ]}>
                                {''.concat(
                                    x.userRefNo || '',
                                    ' ',
                                    x.instrNo || '',
                                    ' ',
                                    x.remarks || '',
                                    ' ',
                                    x.lineRefNo || '',
                                    ' ',
                                    x.lineRemarks || ''
                                )}
                            </Text>
                        </View>
                    )
                })
                .concat(
                    <View style={{ flexDirection: 'row' }} key={-1}>
                        <Text style={[gStyles.normal, { width: 20 }]}> </Text>
                        <Text style={[gStyles.normal, { width: 47 }]}> </Text>
                        <Text style={[gStyles.normal, { width: 80 }]}> </Text>
                        <Text style={[gStyles.bold, { width: 90 }]}>
                            Closing balance
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 65, textAlign: 'right' },
                            ]}>
                            {closingBalance >= 0
                                ? toDecimalFormat(closingBalance) + ' Dr'
                                : ''}
                        </Text>
                        <Text
                            style={[
                                gStyles.bold,
                                { width: 65, textAlign: 'right' },
                            ]}>
                            {closingBalance < 0
                                ? toDecimalFormat(Math.abs(closingBalance)) +
                                  ' Cr'
                                : ''}
                        </Text>
                    </View>
                )

            return (
                <View
                    style={{
                        flexDirection: 'column',
                        paddingBottom: 3,
                        marginBottom: 3,
                        borderBottom: 1,
                    }}>
                    {rows}
                </View>
            )
        }
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

    function prepareData() {
        ld.reduce(
            (prev: any, curr: any) => {
                curr.ledgerBal = prev.ledgerBal + curr.debit - curr.credit
                return curr
            },
            { ledgerBal: 0 }
        )
        closingBalance = ld[ld.length - 1]?.ledgerBal
    }
}

export { PdfLedger }
