import { manageEntitiesState } from '../../../../imports/trace-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { _ } from '../../../../imports/regular-imports'

function VoucherPdf({ arbitraryData }: any) {
    return (
        <div style={styles().verticalStyle}>
            <div style={styles().horSpreadStyle}>
                <CompanyInfo />
                <Instrument arbitraryData={arbitraryData} />
            </div>
            <hr style={styles().lineStyle}></hr>
            <Transactions arbitraryData={arbitraryData} />
            <Footer arbitraryData={arbitraryData} />
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

    function Instrument({ arbitraryData }: any) {
        const { getFromBag } = manageEntitiesState()
        const branchObject = getFromBag('branchObject')
        const ad = arbitraryData
        const pdfVoucher = ad.pdfVoucher
        const header = ad.header
        return (
            <div style={{ ...styles().verticalStyle, ...{ width: '15rem' } }}>
                <div style={styles().horSpreadStyle}>
                    <span style={{ fontWeight: 'bold' }}>
                        {pdfVoucher?.heading || ''}
                    </span>
                    <span style={{ fontWeight: 'bold' }}>
                        {' '}
                        {branchObject.branchName}
                    </span>
                </div>
                <div style={styles().horSpreadStyle}>
                    <span>{header?.autoRefNo || ''}</span>
                    <span>{pdfVoucher?.tranDate || ''}</span>
                </div>
                <div>{header?.userRefNo || ''}</div>
                <span>{header?.remarks || ''}</span>
            </div>
        )
    }

    function Transactions({ arbitraryData }: any) {
        return (
            // <div></div>
            <table
                style={{
                    border: '1px solid lightGrey',
                    padding: '1rem',
                    marginTop: '.5rem',
                    fontSize: '14px',
                }}>
                <caption
                    style={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                    }}>
                    Transactions
                </caption>
                <thead>
                    <tr>
                        <th
                            style={{
                                width: '4rem',
                                textAlign: 'left',
                                ...styles().thBottom,
                            }}>
                            #
                        </th>
                        <th
                            style={{
                                width: '16rem',
                                textAlign: 'left',
                                ...styles().thBottom,
                            }}>
                            Account name
                        </th>
                        <th
                            style={{
                                width: '5rem',
                                textAlign: 'left',
                                ...styles().thBottom,
                            }}>
                            Instr no
                        </th>
                        <th
                            style={{
                                width: '8rem',
                                textAlign: 'left',
                                ...styles().thBottom,
                            }}>
                            Ref no
                        </th>
                        <th
                            style={{
                                width: '9rem',
                                textAlign: 'left',
                                ...styles().thBottom,
                            }}>
                            Remarks
                        </th>
                        <th
                            style={{
                                width: '9rem',
                                textAlign: 'right',
                                ...styles().thBottom,
                            }}>
                            Debits
                        </th>
                        <th
                            style={{
                                width: '9rem',
                                textAlign: 'right',
                                ...styles().thBottom,
                            }}>
                            Credits
                        </th>
                    </tr>
                </thead>
                {/* To provide blank vertical space */}
                <thead>
                    <tr>
                        <th></th>
                    </tr>
                </thead>
                <Rows />
                <TableSummary />
            </table>
        )

        function Rows(): any {
            const debits = arbitraryData?.pdfVoucher?.debits || []
            const credits = arbitraryData?.pdfVoucher?.credits || []
            const allItems = [...debits, ...credits]
            const { toDecimalFormat } = useSharedElements()
            return allItems.map((item: any, index: number) => {
                let gstStringDebit = ''
                let gstStringCredit = ''
                if (item?.dc === 'C') {
                    if (!_.isEmpty(item?.gst)) {
                        const sgst = item.gst.sgst
                            ? 'sgst:'.concat(toDecimalFormat(item.gst.sgst))
                            : ''
                        const cgst = item.gst.cgst
                            ? 'cgst:'.concat(toDecimalFormat(item.gst.cgst))
                            : ''
                        const igst = item.gst.igst
                            ? 'igst:'.concat(toDecimalFormat(item.gst.igst))
                            : ''
                        gstStringCredit = cgst.concat(' ', sgst, ' ', igst)
                    }
                } else {
                    if (!_.isEmpty(item?.gst)) {
                        const sgst = item.gst.sgst
                            ? 'sgst:'.concat(toDecimalFormat(item.gst.sgst))
                            : ''
                        const cgst = item.gst.cgst
                            ? 'cgst:'.concat(toDecimalFormat(item.gst.cgst))
                            : ''
                        const igst = item.gst.igst
                            ? 'igst:'.concat(toDecimalFormat(item.gst.igst))
                            : ''
                        gstStringDebit = cgst.concat(' ', sgst, ' ', igst)
                    }
                }
                return (
                    <tbody>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.accName || ''}</td>
                            <td>{item.instrNo || ''}</td>
                            <td>{item?.lineRefNo || ''}</td>
                            <td>{item?.remarks || ''}</td>
                            <td style={{ textAlign: 'right' }}>
                                {item?.dc === 'D'
                                    ? toDecimalFormat(item?.amount || 0)
                                    : ''}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {item?.dc === 'C'
                                    ? toDecimalFormat(item?.amount || 0)
                                    : ''}
                            </td>
                        </tr>
                        {!_.isEmpty(item.gst) && (
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style={{ fontSize: '12px' }}>
                                    {gstStringDebit}
                                </td>
                                <td style={{ fontSize: '12px' }}>
                                    {gstStringCredit}
                                </td>
                            </tr>
                        )}
                    </tbody>
                )
            })
        }

        function TableSummary() {
            const { toDecimalFormat } = useSharedElements()
            return (
                <tfoot>
                    <tr style={{ marginTop: '1rem' }}>
                        <th style={styles().thTop}></th>
                        <th style={{ textAlign: 'left', ...styles().thTop }}>
                            Total
                        </th>
                        <th style={styles().thTop}></th>
                        <th style={styles().thTop}></th>
                        <th style={styles().thTop}></th>
                        <th style={{ textAlign: 'right', ...styles().thTop }}>
                            {toDecimalFormat(
                                arbitraryData?.summary?.totalDebits || 0
                            )}
                        </th>
                        <th style={{ textAlign: 'right', ...styles().thTop }}>
                            {toDecimalFormat(
                                arbitraryData?.summary?.totalCredits || 0
                            )}
                        </th>
                    </tr>
                </tfoot>
            )
        }
    }

    function Footer({ arbitraryData }: any) {
        const { numberToWordsInRs } = useSharedElements()
        const debits = arbitraryData?.summary?.totalDebits  || 0
        const { getFromBag } = manageEntitiesState()
        const unitInfo = getFromBag('unitInfo')
        const tranTypeId = arbitraryData?.header?.tranTypeId || 1
        const comm =
            tranTypeId === 3
                ? 'Received with thanks '
                : 'Total transaction amounts to '

        return (
            <div
                style={{ display:'flex', justifyContent:'space-between', marginTop: '1rem'}}
                >
                <span style={{ maxWidth: '60%' }}>
                    {comm.concat(numberToWordsInRs(debits))}
                </span>
                <div style={styles().verticalStyle}>
                    <span>For {unitInfo?.unitName || ''}</span>
                    <span style={{ marginTop: '2rem' }}>
                        Authorised signatory
                    </span>
                </div>
            </div>
        )
    }
}

export { VoucherPdf }

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
