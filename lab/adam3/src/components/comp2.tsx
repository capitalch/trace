import { PDFViewer } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'
import { useComp2 } from './comp2-hook'
function Comp2() {
    const [, setRefresh] = useState({})
    const { InvoicePdf } = useComp2()

    // useEffect(() => {
    //     setRefresh({})
    // }, [])
    const invoiceData = getInvoiceData(traceCompany, traceInvoiceIndividual)
    processInvoiceData(invoiceData)

    console.log(invoiceData)
    return (
        <PDFViewer width={600} height={800}>
            <InvoicePdf invoiceData={invoiceData} />
        </PDFViewer>
    )

    function getInvoiceData(traceCompany: any, traceInvoice: any) {
        const tc = traceCompany,
            ti = traceInvoice.jsonResult
        const i: {
            invoiceInfo: any
            companyInfo: any
            billTo: any
            shipTo: any
            items: any[]
            summary: any
            transactions: any
        } = {
            invoiceInfo: null,
            companyInfo: null,
            billTo: null,
            shipTo: null,
            items: [],
            summary: null,
            transactions: null,
        }
        i.invoiceInfo = {
            title: 'Tax Invoice',
            titleRight:'Original for recipient',
            invoiceNo: ti.tranH.autoRefNo,
            invoiceDate: ti.tranH.tranDate,
            type: ti.tranH.tranTypeId == 4 ? 'Sale' : 'Sale Ret',
            terms: '',
        }
        i.companyInfo = {
            name: tc.unitName,
            address1: tc.address1,
            address2: tc.address2,
            pin: tc.pin,
            phone: ''.concat(tc.landPhone, ' ', tc.mobileNumber),
            email: tc.email,
            web: tc.webSite,
            gstin: tc.gstin,
            stateName: 'West Bengal', // Get from stateCode from data
            stateCode: tc.state,
        }
        const billTo = ti.billTo || ti.businessContacts
        i.billTo = {
            name: billTo.contactName,
            address1: billTo.address1,
            address2: billTo.address2,
            pin: billTo.pin || billTo.jAddress?.pin,
            phone: ''.concat(billTo.mobileNumber || '', ' ', billTo.landPhone || ''),
            email: billTo.email,
            gstin: billTo.gstin,
            stateName: billTo.state || billTo.jAddress?.state,
            stateCode: billTo.stateCode,
        }
        i.shipTo = {}
        i.items = ti.salePurchaseDetails.map((x: any) => ({
            desc: ''.concat(
                x.catName,
                ', ',
                x.brandName,
                ', ',
                x.label,
                ', ',
                'Serial nos ',
                x.serialNumbers,
                ', HSN ',
                x.hsn
            ),
            qty: x.qty,
            cgst: x.cgst,
            sgst: x.sgst,
            igst: x.igst,
            gst:x.cgst + x.sgst + x.igst,
            aggr: (x.price * x.qty) - x.discount,
            price: x.price,
            pricegst: x.priceGst,
            gstRate: x.gstRate,
            discount: x.discount,
            amount: x.amount,
        }))
        const gst = ti.extGstTranD
        i.summary = {
            cgst: gst?.cgst,
            sgst: gst?.sgst,
            igst: gst?.igst,
            // aggr: amou (cgst 
            amount: 0, // calculate amount from tranD
        }
        i.transactions = {}
        return i
    }

    function processInvoiceData(invoiceData: any) {
        // update sale terms
        // update transactions
        // update summary
    }
}
export { Comp2 }

const traceCompany = {
    pin: '700067',
    email: 'invest@gmail.com',
    gstin: '19AACCC5685L1Z3',
    state: '19',
    webSite: 'www.capital-investments.com',
    address1: '12, Ko Chi Minch Sarani, Efteel Towers',
    address2: 'Behind Kutub Minar',
    unitName: 'Capital Investments Pvt Ltd',
    landPhone: '23551699',
    shortName: 'capitalInvestments',
    mobileNumber: '9155632145',
}

const traceInvoiceIndividual = {
    jsonResult: {
        tranH: {
            id: 9663,
            tranDate: '2021-07-14',
            userRefNo: '32375',
            remarks: 'Service+ job no: J11174682',
            autoRefNo: 'head\\SAL\\2853\\2021',
            jData: null,
            tranTypeId: 4,
        },
        billTo: {
            id: 250,
            contactName: '*****',
            mobileNumber: null,
            otherMobileNumber: null,
            landPhone: null,
            email: null,
            descr: null,
            jData: null,
            anniversaryDate: '1900-01-01',
            address1: '*****',
            address2: null,
            country: 'India',
            state: 'West Bengal',
            city: 'Kolkata',
            gstin: null,
            pin: '999999',
            dateOfBirth: '1900-01-01',
            stateCode: 19,
            timestamp: '2021-07-07T14:19:46.333481+00:00',
        },
        businessContacts: null,
        tranD: [
            {
                id: 19271,
                accId: 167,
                dc: 'C',
                amount: 250,
                instrNo: null,
                remarks: null,
            },
            {
                id: 19272,
                accId: 118,
                dc: 'D',
                amount: 250,
                instrNo: null,
                remarks: 'Service+ sale',
            },
        ],
        extGstTranD: {
            id: 9509,
            gstin: null,
            cgst: 19.07,
            sgst: 19.07,
            igst: 0,
        },
        salePurchaseDetails: [
            {
                id: 9468,
                productId: 28,
                qty: 1,
                price: 211.86,
                priceGst: 250,
                discount: 0,
                cgst: 19.07,
                sgst: 19.07,
                igst: 0,
                amount: 250,
                hsn: 998729,
                gstRate: 18,
                productCode: '1018',
                upcCode: '14',
                catName: 'OLED',
                brandName: 'SONY',
                info: 'Exclusive',
                label: '25" Thin clear',
                serialNumbers: '',
                remarks: null,
            },
        ],
    },
}

const traceInvoiceParty = {
    jsonResult: {
        tranH: {
            id: 9931,
            tranDate: '2021-11-17',
            userRefNo: null,
            remarks: null,
            autoRefNo: 'head\\SAL\\2908\\2021',
            jData: null,
        },
        billTo: null,
        businessContacts: {
            id: 4,
            contactName: 'Billenium sales pvt ltd',
            contactCode: 'billeniumSales',
            mobileNumber: '9555421232',
            otherMobileNumber: '',
            landPhone: '235512254',
            email: 'bille@fgg.com',
            otherEmail: '',
            jAddress: [
                {
                    pin: '7000013',
                    city: 'Kolkata',
                    state: 'West Bengal',
                    country: 'India',
                    address1: '23, Tootie lane',
                    address2: '',
                },
            ],
            descr: '',
            accId: 159,
            jData: null,
            gstin: '37AADCB2230M2ZR',
            timestamp: '2021-03-25T09:58:01+00:00',
            stateCode: 19,
        },
        tranD: [
            {
                id: 19745,
                accId: 167,
                dc: 'C',
                amount: 5600,
                instrNo: null,
                remarks: null,
            },
            {
                id: 19746,
                accId: 159,
                dc: 'D',
                amount: 5600,
                instrNo: null,
                remarks: '',
            },
        ],
        extGstTranD: {
            id: 9663,
            gstin: '37AADCB2230M2ZR',
            cgst: 300,
            sgst: 300,
            igst: 0,
        },
        salePurchaseDetails: [
            {
                id: 9570,
                productId: 12,
                qty: 1,
                price: 5000,
                priceGst: 5600,
                discount: 0,
                cgst: 300,
                sgst: 300,
                igst: 0,
                amount: 5600,
                hsn: 2222,
                gstRate: 12,
                productCode: '1003',
                upcCode: '4',
                catName: 'OLED',
                brandName: 'SONY',
                info: '',
                label: 'eeewwswqw',
                serialNumbers: '',
                remarks: null,
            },
        ],
    },
}
