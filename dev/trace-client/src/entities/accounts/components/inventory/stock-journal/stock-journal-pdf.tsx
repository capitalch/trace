import { width } from '@mui/system'
import {
    Box,
    IMegaData,
    manageEntitiesState,
    MegaDataContext,
    moment,
    useContext,
    useState,
} from '../redirect'

function StockJournalPdf({ mData }: any) {
    let megaData:IMegaData=useContext(MegaDataContext)
    if(mData){
        megaData = mData
    }

    // const megaData: IMegaData = useContext(MegaDataContext)
    const stockJournal = megaData?.accounts?.stockJournal
    const stockJournalRawData = stockJournal?.selectedStockJournalRawData || {}

    return (
        <div style={styles().verticalStyle}>
            <div style={styles().horSpreadStyle}>
                <CompanyInfo rawData={stockJournalRawData} />
                <Instrument rawData={stockJournalRawData} />
            </div>
            <Debits />
            <Credits />
            <Summary />
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
    const tranDate = tranH?.tranDate || moment().format(dateFormat)
    return (
        <div style={{ ...styles().verticalStyle, ...{ width: '15rem' } }}>
            <div style={styles().horSpreadStyle}>
                <span style={{ fontWeight: 'bold' }}>Stock journal</span>
                <span> {branchObject.branchName}</span>
            </div>
            <div style={styles().horSpreadStyle}>
                <span>{tranH.autoRefNo}</span>
                <span>{tranDate}</span>
            </div>
            <div>{tranH.userRefNo || ''}</div>
        </div>
    )
}

function Debits() {
    return <div></div>
}

function Credits() {
    return <div></div>
}

function Summary() {
    return <div></div>
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

    return { companyInfoStyle, horSpreadStyle, verticalStyle }
}

export { StockJournalPdf }

// const styles:React.CSSProperties = {

// }
