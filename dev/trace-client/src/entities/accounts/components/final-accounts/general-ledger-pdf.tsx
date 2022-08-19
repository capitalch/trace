// 19-08-2022 This file not used at present. Using react-pdf/renderer for pdf generation and not puppeteer

import { manageEntitiesState } from '../../../../imports/trace-imports'
import { moment } from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function GeneralLedgerPdf({ ledgerData, accName }: any) {
    const ld = ledgerData.map((x: any) => ({ ...x }))
    prepareData(ld)
    let closingBalance = ld[ld.length - 1]?.ledgerBal
    return (
        <div style={styles().verticalStyle}>
            <div style={styles().horSpreadStyle}>
                <CompanyInfo />
                <Instrument accName={accName} />
            </div>
            {/* <hr style={styles().lineStyle}></hr> */}
            <Transactions ld={ld} />
            {/* <Footer arbitraryData={arbitraryData} /> */}
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

    function Instrument({ accName }: any) {
        const { getFromBag } = manageEntitiesState()
        const branchObject = getFromBag('branchObject')
        const finObject = getFromBag('finYearObject')
        const dateFormat = getFromBag('dateFormat')
        const startDate = moment(finObject.startDate, dateFormat).format(
            dateFormat
        )
        const endDate = moment(finObject.endDate, dateFormat).format(dateFormat)
        return (
            <div style={{ ...styles().verticalStyle, ...{ width: '15rem' } }}>
                <div style={styles().horSpreadStyle}>
                    <span style={{ fontWeight: 'bold' }}>
                        {'Ledger account'}
                    </span>
                    <span>{branchObject.branchName}</span>
                </div>
                <span>{accName}</span>
                <span>{''.concat('From: ', startDate, ' To: ', endDate)}</span>
            </div>
        )
    }

    function Transactions({ ld }: any) {
        return (
            <table
                style={{
                    border: '1px solid lightGrey',
                    padding: '1rem',
                    marginTop: '.5rem',
                    fontSize: '12px',
                    borderCollapse: 'collapse',
                }}>
                <thead>
                    <tr
                        style={{
                            borderTop: '1px solid grey',
                            borderBottom: '1px solid grey',
                            marginTop: '.5rem',
                        }}>
                        <th
                            style={{
                                borderLeft: 'none',
                                width: '3rem',
                                textAlign: 'left',
                                paddingTop: '.5rem',
                                paddingBottom: '.5rem',
                            }}>
                            #
                        </th>
                        <th style={{ width: '4rem', textAlign: 'left' }}>
                            Date
                        </th>
                        <th style={{ width: '6rem', textAlign: 'left' }}>
                            Ref
                        </th>
                        <th style={{ width: '12rem', textAlign: 'left' }}>
                            Account
                        </th>
                        <th style={{ width: '7rem', textAlign: 'right' }}>
                            Debits
                        </th>
                        <th style={{ width: '7rem', textAlign: 'right' }}>
                            Credits
                        </th>
                        {/* <th style={{ width: '10rem', textAlign: 'right' }}>
                            Balance
                        </th> */}
                        <th style={{width:'0.5rem'}}></th>
                        <th style={{ width: '10rem', textAlign: 'left' }}>
                            Info
                        </th>
                    </tr>
                </thead>
                <tbody style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                    <Rows ld={ld} />
                </tbody>
            </table>
        )
    }

    function Rows({ ld }: any) {
        const { getFromBag } = manageEntitiesState()
        const dateFormat = getFromBag('dateFormat')
        const { toDecimalFormat } = useSharedElements()
        return ld.map((item: any, index: number) => {
            const debit =
                item.dc === 'D' ? toDecimalFormat(item.debit || 0) : ''
            const credit =
                item.dc === 'C' ? toDecimalFormat(item.credit || 0) : ''
            const info = ''.concat(
                item.userRefNo || '',
                ' ',
                item.instrNo || '',
                ' ',
                item.remarks || '',
                ' ',
                item.lineRefNo || '',
                ' ',
                item.lineRemarks || ''
            )
            return (
                <tr key={index}>
                    <td>{index}</td>
                    <td>{moment(item.tranDate).format(dateFormat)}</td>
                    <td>{item.autoRefNo || ''}</td>
                    <td>{item.otherAccounts}</td>
                    <td style={{ textAlign: 'right' }}>{debit}</td>
                    <td style={{ textAlign: 'right' }}>{credit}</td>
                    <td style={{width:'.5rem'}}></td>
                    {/* <td style={{ textAlign: 'right' }}>{item.ledgerBal}</td> */}
                    <td>{info}</td>
                </tr>
            )
        })
    }

    function prepareData(ld: any[]) {
        ld.reduce(
            (prev: any, curr: any) => {
                curr.ledgerBal = prev.ledgerBal + curr.debit - curr.credit
                return curr
            },
            { ledgerBal: 0 }
        )
        // closingBalance = ld[ld.length - 1]?.ledgerBal
    }
}

export { GeneralLedgerPdf }

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
    const thBottom: React.CSSProperties = {
        paddingBottom: '0.5rem',
        borderBottom: '1px solid grey',
    }
    const thTop: React.CSSProperties = {
        borderTop: '1px solid grey',
        paddingTop: '1rem',
        marginTop: '1rem',
    }

    return {
        companyInfoStyle,
        horSpreadStyle,
        lineStyle,
        thBottom,
        thTop,
        verticalStyle,
    }
}
