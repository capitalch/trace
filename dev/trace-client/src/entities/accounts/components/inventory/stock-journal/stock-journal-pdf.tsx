import {
    IMegaData,
    manageEntitiesState,
    MegaDataContext,
    moment,
    useContext,
} from '../redirect'

function StockJournalPdf({ mData }: any) {
    let megaData: IMegaData = useContext(MegaDataContext)
    if (mData) {
        megaData = mData
    }
    const stockJournal = megaData?.accounts?.stockJournal
    const stockJournalRawData = stockJournal?.selectedStockJournalRawData || {}

    return (
        <div style={styles().verticalStyle}>
            <div style={styles().horSpreadStyle}>
                <CompanyInfo rawData={stockJournalRawData} />
                <Instrument rawData={stockJournalRawData} />
            </div>
            <hr style={styles().lineStyle}></hr>
            <Credits rawData={stockJournalRawData} />
            <Debits rawData={stockJournalRawData} />
            <Summary rawData={stockJournalRawData} />
        </div>
    )
}

function CompanyInfo({ rawData }: any) {
    const { getFromBag } = manageEntitiesState()
    const unitInfo = getFromBag('unitInfo')
    return (
        <div style={styles().companyInfoStyle}>
            <span style={{ fontWeight: 'bold' }}>
                {unitInfo?.unitName || ''}
            </span>
            <span>
                {''.concat(
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
                )}
            </span>
        </div>
    )
}

function Instrument({ rawData }: any) {
    const { getFromBag } = manageEntitiesState()
    const branchObject = getFromBag('branchObject')
    const dateFormat = getFromBag('dateFormat')
    const tranH = rawData?.tranH || {}
    const tranDate = tranH?.tranDate ? moment(tranH?.tranDate).format(dateFormat) : moment().format(dateFormat)

    return (
        <div style={{ ...styles().verticalStyle, ...{ width: '15rem' } }}>
            <div style={styles().horSpreadStyle}>
                <span style={{ fontWeight: 'bold' }}>Stock journal</span>
                <span style={{ fontWeight: 'bold' }}> {branchObject.branchName}</span>
            </div>
            <div style={styles().horSpreadStyle}>
                <span>{tranH.autoRefNo}</span>
                <span>{tranDate}</span>
            </div>
            <div>{tranH.userRefNo || ''}</div>
            <span>{tranH.remarks || ''}</span>
        </div>
    )
}

function Debits({ rawData }: any) {
    const title = 'Destination (Production / output / debits)'
    const stockJournalArray: [StockJournal] = rawData.stockJournal || []
    const debits: StockJournal[] = stockJournalArray.filter((item: StockJournal) => (item.dc === 'D'))
    return (<TableLayout items={debits} title={title} />)
}

function TableLayout({ items, title }: any) {
    return <table style={{ border: '1px solid lightGrey', padding: '1rem', marginTop: '1rem', fontSize: '14px' }}>
        <caption style={{ textAlign: 'left', fontWeight: 'bold' }}>{title}</caption>
        <tr>
            <th style={{ width: '4rem', textAlign: 'left' }}>#</th>
            <th style={{ width: '4rem', textAlign: 'left' }}>Pr code</th>
            <th style={{ width: '15rem', textAlign: 'left' }}>Details</th>
            <th style={{ width: '10rem', textAlign: 'left' }}>Ref no</th>
            <th style={{ width: '10rem', textAlign: 'left' }}>Remarks</th>
        </tr>
        <Rows />
    </table>
    // </div>

    function Rows() {
        return (items.map((item: StockJournal, index: number) =>
            <tr key={index}>
                <td style={{ verticalAlign: 'top' }}>{index + 1}</td>
                <td style={{ verticalAlign: 'top' }}>{item.productCode}</td>
                <td style={{ verticalAlign: 'top' }}>{''.concat(item.brandName, ' ', item.catName, ' ', item.label, ' ', item.info || '')}</td>
                <td style={{ verticalAlign: 'top' }}>{item.lineRefNo}</td>
                <td style={{ verticalAlign: 'top' }}>{item.lineRemarks}</td>
            </tr>
        ))
    }
}

function Credits({ rawData }: any) {
    const title = 'Source (Consumption / input / credits)'
    const stockJournalArray: [StockJournal] = rawData.stockJournal || []
    const credits: StockJournal[] = stockJournalArray.filter((item: StockJournal) => (item.dc === 'C'))
    return (<TableLayout items={credits} title={title} />)
}

function Summary({ rawData }: any) {
    const stockJournalArray: StockJournal[] = rawData.stockJournal
    const debits = stockJournalArray?.filter((item: StockJournal) => item.dc === 'D').length || 0
    const credits = stockJournalArray?.filter((item: StockJournal) => item.dc === 'C').length || 0
    return <div style={{ marginTop: '2rem', fontWeight: 'bold', textAlign: 'right' }}>{''.concat('Input qty: ', String(credits), ' Output qty: ', String(debits))}</div>
}

function styles() {
    const companyInfoStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '60%',
    }
    const verticalStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    }
    const horSpreadStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
    }
    const lineStyle: React.CSSProperties = {
        borderBottom: '1px solid black',
        width: '100%'
    }

    return { companyInfoStyle, horSpreadStyle, lineStyle, verticalStyle }
}

interface StockJournal {
    productCode: string; brandName: string; catName: string; info: string; label: string; lineRefNo: string; lineRemarks: string; serialNumbers: string; dc: string
}

export { StockJournalPdf }
