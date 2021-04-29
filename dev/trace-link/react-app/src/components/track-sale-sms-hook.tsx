import { useEffect, useRef, useState } from 'react'
import { useSharedElements } from '../shared-elements-hook'
import {
    makeStyles,
    Theme,
    createStyles,
    // DialogContent,
} from '@material-ui/core'
import { useSqlAnywhere } from '../utils/sql-anywhere-hook'
import axios from 'axios'

// import { sqls } from '../utils/sqls'

function useTrackSaleSms() {
    const [, setRefresh] = useState({})
    let conn: any = {}
    const {
        Column,
        // confirm,
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
        saleData: [], //mockSaleData,
        selectedDate: moment().format('YYYY-MM-DD'),
        selectedRows: [],
        tableHeader: 'Sale data',
        title: 'Send SMS to selected sale bills',
    })

    useEffect(() => {
        meta.current.isMounted = true
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const { execSql } = useSqlAnywhere()

    async function handleRefresh() {
        meta.current.selectedRows = []
        emit('SHOW-LOADING-INDICATOR', true)
        if (isElectron()) {
            const saleData = await execSql('track-sale-sms', [
                meta.current.selectedDate,
            ])
            meta.current.saleData = saleData.map((x:any)=>x) // Just to clean the array
        } else {
            meta.current.saleData = mockSaleData
        }
        emit('SHOW-LOADING-INDICATOR', false)
        meta.current.isMounted && setRefresh({})
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
                const jsonPayload: any = await getJsonPayload(selectedRows)
                const config: any = {
                    method: 'post',
                    url: 'http://localhost:5000/track-bills',
                    data: jsonPayload,
                }
                const response = await axios(config)
                console.log(response)
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
            const len = rows.length
            for(let i=0 ; i< len; i++){ // map function did not work. It returned promise instead of data
                const billMemoId = rows[i].bill_memo_id
                const produc = await execSql('track-get-product-details', [billMemoId])
                const products = produc.map((x: any)=>x) // needed tfor cleanup
                rows[i].products = products
              }
            // const payload =  await rows.map(async (row: any) => {
            //     let ret: any[] = []
            //     if (isElectron()) {
            //         const bill_memo_id: any = row.bill_memo_id
            //         ret = await execSql('track-get-product-details', [bill_memo_id])
            //     } else {
            //         ret = await mockProductDetails
            //     }               
            //     row.products = ret
            //     return row
            // })
            
            return rows
        }
    }

    function sumAmount() {
        meta.current.saleData = meta.current.saleData || []
        const result = meta.current.saleData.reduce(
            (prev: any, curr: any) => {
                const amt = prev.total_amt + curr.total_amt
                return { total_amt: amt }
            },
            { total_amt: 0 }
        )
        return toDecimalFormat(result.total_amt)
    }

    function getColumns() {
        let numb = 0
        function incr() {
            return numb++
        }
        return [
            // checkbox
            <Column
                key={incr()}
                selectionMode="multiple"
                headerStyle={{ width: '4em' }}
                className="data-table-footer"
            />,
            // ref_no
            <Column
                key={incr()}
                style={{ width: '9rem', wordWrap: 'break-word' }}
                field="ref_no"
                header="Ref no"
                footer={meta.current.saleData?.length || 0}
                footerClassName="data-table-footer"
            />,
            // name
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
            // mobile
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
            // amount
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
            //address
            <Column
                key={incr()}
                className="overflow-ellipsis"
                style={{
                    width: '12rem',
                }}
                field="address"
                header="Address"
            />,
            //pin
            <Column
                key={incr()}
                style={{
                    width: '6rem',
                    textAlign: 'right',
                }}
                field="pin"
                header="Pin"
            />,
            // gstin
            <Column
                key={incr()}
                style={{
                    width: '12rem',
                    wordWrap: 'break-word',
                }}
                field="gstin"
                header="Gstin"
            />,
            //email
            <Column
                key={incr()}
                className="overflow-ellipsis"
                style={{
                    width: '8rem',
                    wordWrap: 'break-word',
                }}
                field="email"
                header="Email"
            />,
            //product
            <Column
                key={incr()}
                className="overflow-ellipsis"
                style={{
                    width: '8rem',
                }}
                field="product"
                header="Product"
            />,
            // account name
            <Column
                key={incr()}
                className="overflow-ellipsis"
                style={{
                    width: '8rem',
                }}
                field="acc_name"
                header="Account"
            />,

            // bill_memo
            <Column
                key={incr()}
                style={{
                    width: '5rem',
                    wordWrap: 'break-word',
                }}
                field="bill_memo"
                header="Bill / Memo"
            />,
            // cgst
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
            // sgst
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
            //igst
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
                columnGap: theme.spacing(2),
            },
            '& .data-table': {
                marginTop: theme.spacing(2),
                fontSize: theme.spacing(1.5),
                fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
                '& .data-table-footer': {
                    color: 'dodgerBlue',
                },
                '& .overflow-ellipsis': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
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
