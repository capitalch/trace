import { _, accountsMessages, useConfirm, Box, Button, IconButton, IMegaData, manageEntitiesState, MegaDataContext, pdf, Preview, Tooltip, Typography, useContext, useEffect, useRef, useTraceMaterialComponents, useState, useTheme, utilMethods } from '../redirect'
import { InvoiceA } from '../../pdf/invoices/invoiceA'

function useDebitsCreditsPreview() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const confirm = useConfirm()
    const { getFromBag, setInBag } = manageEntitiesState()
    const { sendEmail, sendSms } = utilMethods()
    const unitInfo = getFromBag('unitInfo')

    const meta = useRef({
        rawSaleData: null,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => <></>,
            maxWidth: 'md',
        }
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod('handleBillPreviewFromSalesView:debitsCreditsPreview', handleBillPreviewFromSalesView)
    }, [])

    function handleBillPreview() {
        pre.rawSaleData = null
        doBillPreview()
    }

    function doBillPreview() {
        const dialog = pre.dialogConfig
        dialog.title = 'Sale invoice'
        pre.showDialog = true
        setRefresh({})
    }

    function handleBillPreviewFromSalesView(rawSaleData: any) {
        setInBag('rawSaleData', null)
        pre.rawSaleData = rawSaleData
        doBillPreview()
    }

    function handleClose() {
        pre.showDialog = false
        setRefresh({})
    }

    async function handleEmail() {
        // const rawSaleData = sales.rawSaleData || {}
        const rawSaleData = getFromBag('rawSaleData') || {}
        const emailAddress = rawSaleData?.jsonResult?.billTo?.email
        const options = {
            description: accountsMessages.emailNotFound,
            confirmationText: 'Ok',
            cancellationText: '',
        }
        if (!emailAddress) {
            confirm(options)
                .then(() => { })
                .catch(() => { })
            return
        }
        const Doc = () => (
            <InvoiceA unitInfo={unitInfo} rawSaleData={rawSaleData} />
        )
        const blob = await pdf(<Doc />).toBlob()
        // Convert blob to Base64, remove the first few chars till the character ',' from the base64 string and send it to server
        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String: any = reader.result
            const base64Data = base64String.substr(
                base64String.indexOf(',') + 1
            )
            const ret = await sendEmail(
                escape(
                    JSON.stringify({
                        data: base64Data,
                        subject: accountsMessages.emailBillSubject.replace('$sender', unitInfo.unitName),
                        body: accountsMessages.emailBillBody.replace('$sender', unitInfo.unitName),
                        emailAddress: emailAddress,
                    })
                )
            )
            console.log(ret)
        }
        reader.readAsDataURL(blob)
    }

    async function handleSms() {
        // const rawSaleData = sales.rawSaleData || {}
        const rawSaleData = getFromBag('rawSaleData') || {}
        const mobileNumber = rawSaleData?.jsonResult?.billTo?.mobileNumber
        const options = {
            description: accountsMessages.mobileNumberNotFound,
            confirmationText: 'Ok',
            cancellationText: '',
        }
        if (!mobileNumber) {
            confirm(options)
                .then(() => { })
                .catch(() => { })
            return
        }
        const Doc = () => (
            <InvoiceA unitInfo={unitInfo} rawSaleData={rawSaleData} />
        )
        const blob = await pdf(<Doc />).toBlob()
        // Convert blob to Base64, remove the first few chars till the character ',' from the base64 string and send it to server
        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String: any = reader.result
            const base64Data = base64String.substr(
                base64String.indexOf(',') + 1
            )
            const id = rawSaleData?.jsonResult?.tranH?.id
            const ret = await sendSms(
                escape(
                    JSON.stringify({
                        data: base64Data,
                        id: id,
                        sqlKey: 'update_pdf_invoice',
                        mobileNumber: mobileNumber,
                        unitName: unitInfo?.shortName || 'Trace'
                    })
                )
            )
            console.log(ret)
        }
        reader.readAsDataURL(blob)
    }

    return ({ handleBillPreview, handleClose, handleEmail, handleSms, meta })
}

export { useDebitsCreditsPreview }