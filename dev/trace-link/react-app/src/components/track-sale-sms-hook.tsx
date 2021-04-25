import { useEffect, useRef, useState } from 'react'
import { useSharedElements } from '../shared-elements-hook'
import { makeStyles, Theme, createStyles } from '@material-ui/core'

function useTrackSaleSms() {
    const [, setRefresh] = useState({})
    const { Column, moment } = useSharedElements()
    const meta = useRef({
        isMounted: false,
        saleData: mockSaleData,
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

    function handleRefresh() {
        console.log(meta.current.selectedDate)
    }

    function handleSendSms() {}

    function getColumns() {
        let numb = 0
        function incr() {
            return numb++
        }
        return [
            <Column
                key={incr()}
                selectionMode="multiple"
                headerStyle={{ width: '3em' }}
            />,
            // <Column key={incr()} field="date" />,
            // <Column key={incr()} field="bill_memo_id" />,
            <Column key={incr()} field="ref_no" header="Ref no" />,
            <Column key={incr()} field="mobile" header="Mobile" />,
            <Column key={incr()} field="total_amt" header="Amount" />,
            <Column key={incr()} field="name" header="Name" />,
            <Column key={incr()} field="address" header="Address" />,
            <Column key={incr()} field="pin" header="Pin" />,
            <Column key={incr()} field="email" header="Email" />,

            <Column key={incr()} field="acc_name" header="Account" />,
            <Column key={incr()} field="gstin" header="Gstin" />,
            <Column key={incr()} field="bill_memo" header="Bill / Memo" />,
            <Column key={incr()} field="cgst" header="Cgst" />,
            <Column key={incr()} field="sgst" header="Sgst" />,
            <Column key={incr()} field="igst" header="Igst" />,
        ]
    }

    return { getColumns, handleSendSms, handleRefresh, meta, setRefresh }
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
        address: '',
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
        gstin: null,
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
        gstin: null,
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
