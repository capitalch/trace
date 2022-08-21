import { useSharedElements } from '../../common/shared-elements-hook'
import {
    _,
    moment, useContext
} from '../../../../../imports/regular-imports'
import { IMegaData, manageEntitiesState, MegaDataContext, } from '../../../../../imports/trace-imports'
import { Items } from '../../sales-new/items/items'

function PdfStockJournal({ mData }: any) {
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

    const gStyles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
            paddingBottom: 30,
            fontFamily: 'Helvetica',
            fontSize: 10,
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
        horSpread: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    })

    let megaData: IMegaData = useContext(MegaDataContext)
    if (mData) {
        megaData = mData
    }
    const stockJournal = megaData?.accounts?.stockJournal
    const stockJournalRawData = stockJournal?.selectedStockJournalRawData || {}

    return (
        <Document>
            <Page size='A4' style={gStyles.page}>
                <View style={[gStyles.horSpread, { paddingBottom: 4 }]}>
                    <CompanyInfo rawData={stockJournalRawData} />
                    <Instrument rawData={stockJournalRawData} />
                </View>
                <Credits rawData={stockJournalRawData} />
                <Debits rawData={stockJournalRawData} />
                <Summary rawData={stockJournalRawData} />
            </Page>
        </Document>
    )

    function CompanyInfo({ rawData }: any) {
        const { getFromBag } = manageEntitiesState()
        const unitInfo = getFromBag('unitInfo')
        const branchObject = getFromBag('branchObject')
        return (
            <View style={{ display: 'flex', flexDirection: 'column', maxWidth: '60%' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {unitInfo?.unitName || ''}
                    </Text>
                    <Text style={{ fontSize: 10 }}>{branchObject.branchName}</Text>
                </View>
                <Text style={gStyles.normal}>{''.concat(
                    unitInfo?.address1 || '',
                    ' ',
                    unitInfo?.address2 || '',
                    ' Pin: ',
                    unitInfo?.pin || '',
                    ' Ph: ',
                    ''.concat(
                        unitInfo?.landPhone || '',
                        ' ',
                        unitInfo?.mobilePhone || ''
                    ),
                    ' email: ',
                    unitInfo?.email || '',
                    ' Gstin: ',
                    unitInfo.gstin,
                    ' state: ',
                    unitInfo.stateName || '',
                    ' stateCode: ',
                    unitInfo.state || ''
                )}</Text>
            </View>
        )
    }

    function Instrument({ rawData }: any) {
        const { getFromBag } = manageEntitiesState()
        const dateFormat = getFromBag('dateFormat')
        const tranH = rawData?.tranH || {}
        const tranDate = tranH?.tranDate
            ? moment(tranH?.tranDate).format(dateFormat)
            : moment().format(dateFormat)

        return (<View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Stock journal</Text>

            <Text style={gStyles.normal}>{'Ref:'.concat(tranH.autoRefNo)}</Text>
            <Text style={gStyles.normal}>{'Date:'.concat(tranDate)}</Text>

            <Text style={gStyles.normal}>{tranH.userRefNo || ''}</Text>
            <Text style={gStyles.normal}>{tranH.remarks || ''}</Text>
        </View>)
    }

    function Credits({ rawData }: any) {
        const title = 'Source (Consumption / input / credits)'
        const stockJournalArray: [StockJournal] = rawData.stockJournal || []
        const credits: StockJournal[] = stockJournalArray.filter(
            (item: StockJournal) => item.dc === 'C'
        )
        return <TableLayout items={credits} title={title} />
    }

    function Debits({ rawData }: any) {
        const title = 'Destination (Production / output / debits)'
        const stockJournalArray: [StockJournal] = rawData.stockJournal || []
        const debits: StockJournal[] = stockJournalArray.filter(
            (item: StockJournal) => item.dc === 'D'
        )
        return <TableLayout items={debits} title={title} />
    }

    // Available space is width: 525, after giving effect to left and right margins
    function TableLayout({ items, title }: any) {
        return (
            <View style={{ border: '1px solid lightGrey', padding: 4, marginTop: 4, fontSize: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
                <View style={{ fontWeight: 'bold', flexDirection: 'row', marginTop: 4, borderBottom: '1px dashed grey', paddingBottom: 2 }}>
                    <Text style={{ width: 20, }}>#</Text>
                    <Text style={{ width: 40, }}>Pr code</Text>
                    <Text style={{ width: 100, }}>Details</Text>
                    <Text style={{ width: 40, textAlign: 'right', }}>Qty</Text>
                    <Text style={{ width: 4, }}></Text>
                    <Text style={{ width: 100, }}>Ref no</Text>
                    <Text style={{ width: 130, }}>Remarks</Text>
                    <Text style={{ width: 90, }}>Sr. num</Text>
                </View>
                <Rows />
            </View>
        )

        function Rows() {
            return items.map((item: StockJournal, index: number) => (
                <View key={index} style={{ flexDirection: 'row', marginTop: 4 }}>
                    <Text style={{ width: 20, }}>{index + 1}</Text>
                    <Text style={{ width: 40, }}>{item.productCode}</Text>
                    <Text style={{ width: 100, }}>{''.concat(
                        item.brandName,
                        ' ',
                        item.catName,
                        ' ',
                        item.label,
                        ' ',
                        item.info || ''
                    )}</Text>
                    <Text style={{ width: 40, textAlign: 'right' }}>{item.qty || 0}</Text>
                    <Text style={{ width: 4 }}></Text>
                    <Text style={{ width: 100, }}>{item.lineRefNo}</Text>
                    <Text style={{ width: 130, }}>{item.lineRemarks || ''}</Text>
                    <Text style={{ width: 90 }}>{item.serialNumbers || ''}</Text>
                </View>
            ))
        }
    }

    function Summary({ rawData }: any) {
        const stockJournalArray: StockJournal[] = rawData.stockJournal
        const debits =
            stockJournalArray?.filter((item: StockJournal) => (item.dc === 'D'))
        const debitsTotal = debits.reduce((prev: any, curr: any) => (prev.qty + curr.qty), { qty: 0 })
        const credits =
            stockJournalArray?.filter((item: StockJournal) => (item.dc === 'C'))
        const creditsTotal = credits.reduce((prev: any, curr: any) => (prev.qty + curr.qty), { qty: 0 })
        return (
            <Text
                style={{
                    marginTop: 4,
                    fontWeight: 'bold',
                    textAlign: 'right',
                }}>
                {''.concat(
                    'Input qty: ',
                    String(toDecimalFormat(creditsTotal || 0)),
                    ' Output qty: ',
                    String(toDecimalFormat(debitsTotal || 0))
                )}
            </Text>
        )
    }



}
export { PdfStockJournal }

interface StockJournal {
    productCode: string
    brandName: string
    catName: string
    info: string
    label: string
    lineRefNo: string
    lineRemarks: string
    qty: number
    serialNumbers: string
    dc: string
}