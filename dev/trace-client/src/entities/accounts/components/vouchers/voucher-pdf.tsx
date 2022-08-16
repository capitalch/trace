import { manageEntitiesState} from '../../../../imports/trace-imports'

function VoucherPdf({arbitraryData}:any){
    return(
        <div style={styles().verticalStyle}>
            <div style={styles().horSpreadStyle}>
                <CompanyInfo />
                <Instrument arbitraryData={arbitraryData} />
            </div>
            <hr style={styles().lineStyle}></hr>
        </div>
    )

    function CompanyInfo() {
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

    function Instrument({arbitraryData}:any){
        const { getFromBag } = manageEntitiesState()
        const branchObject = getFromBag('branchObject')
        const dateFormat = getFromBag('dateFormat')
        const ad = arbitraryData
        const pdfVoucher = ad.pdfVoucher
        const header = ad.header
        const summary = ad.summary
        return (
            <div style={{ ...styles().verticalStyle, ...{ width: '15rem' } }}>
                <div style={styles().horSpreadStyle}>
                    <span style={{ fontWeight: 'bold' }}>{pdfVoucher?.heading || ''}</span>
                    <span style={{ fontWeight: 'bold' }}>
                        {' '}
                        {branchObject.branchName}
                    </span>
                </div>
                <div style={styles().horSpreadStyle}>
                    <span>{header?.autoRefNo || ''}</span>
                    <span>{header?.tranDate || ''}</span>
                </div>
                <div>{header?.userRefNo || ''}</div>
                <span>{header?.remarks || ''}</span>
            </div>
        )
    }
}

export {VoucherPdf}

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
        width: '100%',
    }

    return { companyInfoStyle, horSpreadStyle, lineStyle, verticalStyle }
}