import { useSharedElements } from '../../common/shared-elements-hook'
import { moment } from '../../../../../imports/regular-imports'
function PdfLedger({ ledgerData, accName }: any) {
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
    const ld = ledgerData
    const unitInfo = getFromBag('unitInfo')
    const finObject = getFromBag('finYearObject')
    const dateFormat = getFromBag('dateFormat')
    const startDate = moment(finObject.startDate, dateFormat).format(dateFormat)
    const endDate = moment(finObject.endDate, dateFormat).format(dateFormat)

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
    return (<Document>
        <Page size='A4' style={gStyles.page}>
            <HeaderBlock />
            <ItemsTable />
        </Page>
    </Document>)

    function HeaderBlock() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 3, borderBottom: 1, marginBottom: 3 }}>
                <HeaderCompany />
                <HeaderAccount />
            </View>
        )
        function HeaderCompany() {
            return (<View style={{ width: '65%', flexDirection: 'column' }} fixed>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{unitInfo.unitName}</Text>
                <Text style={gStyles.normal}>
                    {''.concat(
                        'GSTIN:', unitInfo.gstin,
                        unitInfo.address1 || '', ' ', unitInfo.address2 || '',
                        ' ', 'pin:', unitInfo.pin || '',
                        ', ph:', unitInfo.landPhone || '',
                        ' ', unitInfo.mobileNumber || '',
                        ' email:', unitInfo.email || '', ' ', 'web:', unitInfo.webSite)}
                </Text>
            </View>)
        }

        function HeaderAccount() {
            return (<View style={{ width: '30%', flexDirection: 'column' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Ledger account</Text>
                <Text style={[gStyles.bold, { fontSize: 10 }]}>{accName}</Text>
                <Text style={gStyles.normal}>{'From: '.concat(startDate)}</Text>
                <Text style={gStyles.normal}>{'To: '.concat(endDate)}</Text>
            </View>)
        }
    }

    function ItemsTable() {
        return (<View>
            <TableHeader />
        </View>)

        function TableHeader() {
            const styles = StyleSheet.create({
                header: {
                    paddingTop: 3,
                    flexDirection: 'row',
                    paddingBottom: 5,
                    marginBottom: 5,
                },
            })
            return (<View style={[styles.header, { borderBottom: 1 }]} fixed>
                <Text style={[gStyles.bold, { width: 20 }]}>#</Text>
                <Text style={[gStyles.bold, { width: 30 }]}>Date</Text>
                <Text style={[gStyles.bold, { width: 35 }]}>Ref</Text>
                <Text style={[gStyles.bold, { width: 60 }]}>Account</Text>
                <Text style={[gStyles.bold, { width: 60, textAlign: 'right' }]}>Debits</Text>
                <Text style={[gStyles.bold, { width: 60, textAlign: 'right' }]}>Credits</Text>
                <Text style={[gStyles.bold, { width: 70, textAlign: 'right' }]}>Balance</Text>
                {/* <Text style={{ width: 5 }}></Text> */}
                <Text style={[gStyles.bold, { width: 80, textAlign: 'left', marginLeft:5 }]}>Info</Text>
            </View>)
        }
    }

    function prepareData() {

    }
}

export { PdfLedger }