import { useEffect, useRef, useState } from 'react'
import { useSharedElements } from '../shared-elements-hook'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSqlAnywhere } from '../utils/sql-anywhere-hook'
// import odbc from 'odbc'
import { sqls } from '../utils/sqls'

function useTrackSaleSms() {
    const [, setRefresh] = useState({})
    let odbc: any

    const {
        Column,
        confirm,
        isElectron,
        isValidMobile,
        messages,
        moment,
        toDecimalFormat,
        useIbuki,
    } = useSharedElements()

    const { emit } = useIbuki()
    const meta: any = useRef({
        globalFilter: '',
        isMounted: false,
        saleData: mockSaleData,
        selectedDate: moment().format('YYYY-MM-DD'),
        selectedRows: [],
        tableHeader: 'Sale data',
        title: 'Send SMS to selected sale bills',
    })

    useEffect(() => {
        meta.current.isMounted = true
        loadSaleData()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    if (isElectron()) {
        odbc = window.require('odbc')
    }

    // const { execSql } = useSqlAnywhere()

    function handleRefresh() {        
        loadSaleData()
    }

    async function execSql(queryKey: string, params: string[]) {
        const connString = 'DSN=capi2021'
        try {
            const conn = await odbc.connect(connString)
            const data = await conn.query(sqls[queryKey], params)
            return data
        } catch (e) {
            console.log(e.message)
        }
    }

    async function handleSendSms() {
        emit('SHOW-LOADING-INDICATOR', true)
        const selectedRows = meta.current.selectedRows
        if (
            selectedRows &&
            Array.isArray(selectedRows) &&
            selectedRows.length > 0
        ) {
            if (areValidMobilesInRows(selectedRows)) {
                const jsonPayload = await getJsonPayload(selectedRows)
                console.log(jsonPayload)
                // call ajax to Flask and pass on the payload
            } else {
                alert(messages.errinvalidMobileNumber)
            }
        } else {
            alert(messages.errSelectSmsItem)
        }
        emit('SHOW-LOADING-INDICATOR', false)

        function areValidMobilesInRows(rows: any[]) {
            const ret = rows.every((x) => isValidMobile(x.mobile))
            return ret
        }

        async function getJsonPayload(rows: any[]) {
            const payload = rows.map((row: any) => {
                const ret: any[] = mockProductDetails // get inventory details rows from ajax against bill_memo_id
                row.products = ret
                return row
            })
            return payload
        }
    }

    async function loadSaleData() {
        if (isElectron()) {
            meta.current.saleData = await execSql('track-sale-sms', [
                meta.current.selectedDate,
            ])
        } else {
            meta.current.saleData = mockSaleData
        }
        meta.current.isMounted && setRefresh({})
    }

    function sumAmount() {
        const result = []
        // meta.current.saleData?.reduce(
        //     (prev: any, curr: any) => {
        //         const amt = prev.total_amt + curr.total_amt
        //         return { total_amt: amt }
        //     },
        //     { total_amt: 0 }
        // )
        // return toDecimalFormat(result.total_amt)
        return 0
    }

    function getColumns() {
        let numb = 0
        function incr() {
            return numb++
        }
        return [
            <Column
                key={incr()}
                selectionMode="multiple"
                headerStyle={{ width: '4em' }}
                className="data-table-footer"
            />,
            <Column
                key={incr()}
                style={{ width: '9rem', wordWrap: 'break-word' }}
                field="ref_no"
                header="Ref no"
                // footer={meta.current.saleData.length}
                footerClassName="data-table-footer"
            />,
            <Column
                key={incr()}
                style={{
                    width: '10rem',
                    wordWrap: 'break-word',
                }}
                field="name"
                header="Name"
                footer="Rows"
                footerClassName="data-table-footer"
            />,
            <Column
                key={incr()}
                style={{
                    width: '8rem',
                    wordWrap: 'break-word',
                    textAlign: 'right',
                }}
                field="mobile"
                header="Mobile"
            />,
            <Column
                key={incr()}
                style={{
                    width: '8rem',
                    wordWrap: 'break-word',
                    textAlign: 'right',
                }}
                body={(node) => toDecimalFormat(node.total_amt)}
                header="Amount"
                footer={sumAmount}
                footerClassName="data-table-footer"
            />,
            <Column
                key={incr()}
                style={{
                    width: '12rem',
                    wordWrap: 'break-word',
                }}
                field="address"
                header="Address"
            />,
            <Column
                key={incr()}
                style={{
                    width: '6rem',
                    textAlign: 'right',
                }}
                field="pin"
                header="Pin"
            />,
            <Column
                key={incr()}
                style={{
                    width: '8rem',
                    wordWrap: 'break-word',
                }}
                field="email"
                header="Email"
            />,
            <Column
                key={incr()}
                style={{
                    width: '8rem',
                    wordWrap: 'break-word',
                }}
                field="product"
                header="Product"
            />,
            <Column
                key={incr()}
                style={{
                    width: '8rem',
                    wordWrap: 'break-word',
                }}
                field="acc_name"
                header="Account"
            />,
            <Column
                key={incr()}
                style={{
                    width: '12rem',
                    wordWrap: 'break-word',
                }}
                field="gstin"
                header="Gstin"
            />,
            <Column
                key={incr()}
                style={{
                    width: '5rem',
                    wordWrap: 'break-word',
                }}
                field="bill_memo"
                header="Bill / Memo"
            />,
            <Column
                key={incr()}
                style={{
                    width: '6rem',
                    wordWrap: 'break-word',
                    textAlign: 'right',
                }}
                body={(node) => toDecimalFormat(node.cgst)}
                header="Cgst"
            />,
            <Column
                key={incr()}
                style={{
                    width: '6rem',
                    wordWrap: 'break-word',
                    textAlign: 'right',
                }}
                body={(node) => toDecimalFormat(node.sgst)}
                header="Sgst"
            />,
            <Column
                key={incr()}
                style={{
                    width: '6rem',
                    wordWrap: 'break-word',
                    textAlign: 'right',
                }}
                body={(node) => toDecimalFormat(node.igst)}
                header="Igst"
            />,
        ]
    }

    return {
        getColumns,
        handleSendSms,
        handleRefresh,
        meta,
        setRefresh,
        sumAmount,
    }
}

export { useTrackSaleSms }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .title': {
                color: theme.palette.deepPurple.dark,
                fontWeight: 'bold',
            },
            '& .header': {
                marginTop: theme.spacing(2),
                display: 'flex',
                alignItems: 'center',
                columnGap: theme.spacing(6),
            },
            '& .data-table': {
                marginTop: theme.spacing(2),
                // minWidth: '110rem', // based on individual column width
                fontSize: theme.spacing(1.6),
                fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
                // fontFamily:'lato',
                '& .data-table-footer': {
                    color: 'dodgerBlue',
                    // fontSize: theme.spacing(1.3)
                },
            },
        },
    })
)
export { useStyles }

const mockSaleData: any[] = [
    {
        id: 1,
        date: '2021-04-02',
        bill_memo_id: 2,
        name: 'SANJOY',
        address:
            '22 CR Avenue, 2nd floor, near tram dipo, flat no 22, Apartment A, back side portion',
        pin: null,
        phone: null,
        email: null,
        mobile: '9330303686',
        product: 'ADAPTOR CASIO LAD6A',
        acc_name: 'Cash a/c shop',
        ref_no: 'GKUS/2/21',
        total_amt: 350,
        type: 'S',
        bill_memo: 'M',
        roundoff: 0.01,
        gstin: '07AADCB2230M1ZV',
        cgst: 26.69,
        sgst: 26.69,
        igst: 0,
    },
    {
        id: 2,
        date: '2021-04-02',
        bill_memo_id: 3,
        name: 'mohuya mondal',
        address: '',
        pin: null,
        phone: null,
        email: null,
        mobile: '9051476752',
        product: 'BATTERY PANASONIC BK3HCC/4BN',
        acc_name: 'Credit Card HDFC Bank',
        ref_no: 'CardN/1/21',
        total_amt: 1100,
        type: 'S',
        bill_memo: 'B',
        roundoff: 0.02,
        gstin: '07AADCB2230M1ZV',
        cgst: 120.31,
        sgst: 120.31,
        igst: 0,
    },
    {
        id: 3,
        date: '2021-04-02',
        bill_memo_id: 4,
        name: 'KOUSIK BHATTACHARJEE',
        address: '',
        pin: '712258',
        phone: null,
        email: null,
        mobile: '9434726318',
        product: 'BAT/CHAG NIKON MH24',
        acc_name: 'KOUSIK BHATTACHARJEE',
        ref_no: 'CHW/1/21',
        total_amt: 2850,
        type: 'S',
        bill_memo: 'B',
        roundoff: 0.01,
        gstin: null,
        cgst: 217.37,
        sgst: 217.37,
        igst: 0,
    },
    {
        id: 4,
        date: '2021-04-02',
        bill_memo_id: 5,
        name: 'S DAS',
        address: '',
        pin: null,
        phone: null,
        email: null,
        mobile: '9433346014',
        product: 'LENSCAP NIKON LC55A',
        acc_name: 'Credit Card HDFC Bank',
        ref_no: 'CardN/2/21',
        total_amt: 220,
        type: 'S',
        bill_memo: 'B',
        roundoff: 0.35,
        gstin: null,
        cgst: 16.75,
        sgst: 16.75,
        igst: 0,
    },
    {
        id: 5,
        date: '2021-04-02',
        bill_memo_id: 6,
        name: 'ARSHAD KHAN',
        address: '',
        pin: null,
        phone: null,
        email: null,
        mobile: '9831648508',
        product: 'CALCULATOR CASIO DJ240DPLUS',
        acc_name: 'Cash a/c shop',
        ref_no: 'GKUS/3/21',
        total_amt: 950,
        type: 'S',
        bill_memo: 'M',
        roundoff: 0,
        gstin: null,
        cgst: 72.46,
        sgst: 72.46,
        igst: 0,
    },
    {
        id: 6,
        date: '2021-04-02',
        bill_memo_id: 7,
        name: 'MONOJ',
        address: '',
        pin: null,
        phone: null,
        email: null,
        mobile: '94321110510',
        product: 'CHARGER DIGITEK DMC027+MU2A',
        acc_name: 'Credit Card HDFC Bank',
        ref_no: 'CardN/3/21',
        total_amt: 450,
        type: 'S',
        bill_memo: 'B',
        roundoff: 0,
        gstin: null,
        cgst: 34.32,
        sgst: 34.32,
        igst: 0,
    },
]

const mockProductDetails = [
    {
        item: 'BAT/CHAG',
        brand: 'NIKON',
        model: 'MH24',
        qty: 1,
        price: 2415.25,
        discount: 0,
        spec: null,
        hsn: null,
    },
    {
        item: 'LED',
        brand: 'SONY',
        model: 'HX414',
        qty: 1,
        price: 15232.25,
        discount: 0,
        spec: null,
        hsn: null,
    },
]

// const options = {
//     description: messages.errinvalidMobileNumber,
//     title: messages.infoInvalidMobileNumber,
//     cancellationText: null,
// }
// confirm(options)

// const options = {
//     description: messages.errSelectSmsItem,
//     title: messages.infoEmptySelection,
//     cancellationText: null,
// }
// confirm(options)
