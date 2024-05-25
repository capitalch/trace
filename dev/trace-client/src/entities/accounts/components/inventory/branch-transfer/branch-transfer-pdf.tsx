import { Box } from "@mui/material";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getFromBag, manageEntitiesState, moment, useSharedElements } from "../../inventory/redirect";

export function BranchTransferPdf({ branchTransferData }: any) {
    return (<Document>
        <Page size="A4" style={gStyles.page}>
            <HeaderBlock branchTransferData={branchTransferData} />
            <SubHeaderBlock branchTransferData={branchTransferData} />
            <ItemsTable branchTransferData={branchTransferData} />
            <FooterBlock branchTransferData={branchTransferData} />
        </Page>
    </Document>)
}

function HeaderBlock({ branchTransferData }: any) {
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
            <HeaderCompany />
            <HeaderInstrument branchTransferData={branchTransferData} />
        </View>
    )

    function HeaderCompany() {
        const { getFromBag } = manageEntitiesState()
        const unitInfo = getFromBag('unitInfo')

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
            <Text style={styles.companyName}>{unitInfo?.unitName || ''}</Text>
            <Text style={styles.gstin}>GSTIN: {unitInfo?.gstin || ''}</Text>
            <Text style={styles.address}>{''.concat(unitInfo?.address1 || ''
                , ' ', unitInfo?.address2 || ''
                , ' State: ', unitInfo?.stateName
                , ' stateCode: ', unitInfo.state || ''
                , ' PIN: ', unitInfo?.pin || ''
                , ' email: ', unitInfo?.email || ''
            )}</Text>
        </View>)
    }

    function HeaderInstrument({ branchTransferData }: any) {
        const dateFormat = getFromBag('dateFormat')
        const tranH: any = branchTransferData?.tranH
        const btDate = moment(tranH.tranDate).format(dateFormat)

        const styles = StyleSheet.create({
            headerInstrument: {
                flexDirection: 'column',
                marginTop: 8,
                width: '40%',
                paddingRight: 8,
            },
            instrument: {
                fontSize: 12,
                fontWeight: 'bold',
            },
            instrumentNo: {
                marginTop: 3,
                fontSize: 10,
                fontWeight: 'bold',
            },
            date: {
                fontSize: 8,
                flexWrap: 'wrap',
            },
            remarks: {
                fontSize: 8,
                flexWrap: 'wrap',
            }
        })
        return (<View style={styles.headerInstrument}>
            <Text style={styles.instrument}>Branch Transfer</Text>
            <Text style={styles.instrumentNo}>Ref no: {tranH?.autoRefNo || ''}</Text>
            <Text style={styles.instrumentNo}>User ref no: {tranH?.userRefNo || ''}</Text>
            <Text style={styles.date}>{'Date: '.concat(btDate)}</Text>
            <Text style={styles.remarks}>{'Remarks: '.concat(tranH?.remarks)}</Text>
        </View>)
    }
}

function SubHeaderBlock({ branchTransferData }: any) {
    const branchTransfer: any = branchTransferData?.branchTransfer
    const allBranches = getFromBag('branches')
    const destBranchId = branchTransfer[0]?.destBranchId
    const destBranchName = allBranches.find((x: any) => x.branchId === destBranchId)?.branchName
    const branchObject = getFromBag('branchObject')
    const styles = StyleSheet.create({
        SubHeaderBlock: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottom: 1,
            paddingBottom: 5,
            borderBottomColor: 'grey',
        },
        branchBlock: {
            flexDirection: 'column',
        },
        branch: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        bold: {
            fontSize: 10,
            fontWeight: 'bold',
            marginTop: 5,
        },
    })

    return (<View style={styles.SubHeaderBlock} >
        <View style={styles.branchBlock}>
            <Text style={styles.branch}>Source branch</Text>
            <Text style={styles.bold}>{branchObject.branchName}</Text>
        </View>
        <View style={styles.branchBlock}>
            <Text style={styles.branch}>Destination branch</Text>
            <Text style={styles.bold}>{destBranchName}</Text>
        </View>
    </View>)
}

function ItemsTable({ branchTransferData }: any) {
    const { toDecimalFormat } = useSharedElements()
    const branchTransfer: any[] = branchTransferData?.branchTransfer
    return (<View style={{ borderBottom: 1, paddingBottom: 5, paddingTop: 5, borderBottomColor: 'grey', }}>
        <View style={{ flexDirection: 'row', borderBottom: 1, paddingBottom: 5, paddingTop: 5, borderBottomColor: 'grey', marginBottom: 5 }}>
            <Text style={{ width: '5%', fontSize: 10, fontWeight: 'bold' }}>#</Text>
            <Text style={{ width: '10%', fontSize: 10, fontWeight: 'bold' }}>Pr code</Text>
            <Text style={{ width: '20%', fontSize: 10, fontWeight: 'bold' }}>Product</Text>
            <Text style={{ width: '10%', fontSize: 10, fontWeight: 'bold' }}>Qty</Text>
            <Text style={{ width: '15%', fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>Price</Text>
            <Text style={{ width: '15%', fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>Amount</Text>
            <Text style={{ width: '15%', fontSize: 10, fontWeight: 'bold', marginLeft: 4 }}>Serial no</Text>
            <Text style={{ width: '10%', fontSize: 10, fontWeight: 'bold' }}>Remarks</Text>
        </View>
        {branchTransfer.map((item: any, index: number) => {
            return (<View key={index} style={{ flexDirection: 'row', paddingBottom: 5 }}>
                <Text style={{ width: '5%', fontSize: 10 }}>{index + 1}</Text>
                <Text style={{ width: '10%', fontSize: 10 }}>{item.productCode}</Text>
                <Text style={{ width: '20%', fontSize: 10, flexWrap: 'wrap' }}>{''.concat(
                    (item?.catName || '')
                    , ', ', (item?.brandName || '')
                    , ', ', (item?.label || '')
                )}</Text>
                <Text style={{ width: '10%', fontSize: 10 }}>{item.qty}</Text>
                <Text style={{ width: '15%', fontSize: 10, textAlign: 'right' }}>{toDecimalFormat(item.price)}</Text>
                <Text style={{ width: '15%', fontSize: 10, textAlign: 'right' }}>{toDecimalFormat(item.qty * item.price)}</Text>
                <Text style={{ width: '15%', fontSize: 10, flexWrap: 'wrap', marginLeft: 4 }}>{item.serialNumbers}</Text>
                <Text style={{ width: '10%', fontSize: 10, flexWrap: 'wrap' }}>{item.lineRemarks}</Text>
            </View>)
        })}
    </View>)
}

function FooterBlock({ branchTransferData }: any) {
    const { toDecimalFormat } = useSharedElements()
    const branchTransfer: any[] = branchTransferData?.branchTransfer
    const qty = branchTransfer.reduce((acc: number, item: any) => acc + item.qty, 0)
    const amount = branchTransfer.reduce((acc: number, item: any) => acc + item.qty * item.price, 0)
    const count = branchTransfer.length
    return (<View style={{ marginTop: 7 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{'Total    '.concat('Count:  ', count + '', '   Qty: ', qty, '   Amount: ', toDecimalFormat(amount))}</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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