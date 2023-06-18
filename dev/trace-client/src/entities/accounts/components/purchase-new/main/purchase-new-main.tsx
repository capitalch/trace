import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../../imports/gui-imports'
import { useFormik, Yup } from '../../../../../imports/regular-imports'
import { useSharedElements } from '../../common/shared-elements-hook'
import { PurchaseNewStore } from '../purchase-new-store'
import { PurchaseNewMainHeader } from './purchase-new-main-header'
import { usePurchaseNewMain } from './purchase-new-main-hook'

function PurchaseNewMain() {
    const theme = useTheme()
    const { accountsMessages } = useSharedElements()
    const { handleOnSubmit } = usePurchaseNewMain()
    // const formik = useFormik({
    //     initialValues: {
    //         refNo: PurchaseNewStore.main.header.refNo.value,
    //         tranDate: PurchaseNewStore.main.header.tranDate.value,
    //         invoiceNo: PurchaseNewStore.main.header.invoiceNo.value,
    //         commonRemarks: PurchaseNewStore.main.header.commonRemarks.value,
    //         isCreditPurchase: PurchaseNewStore.main.header.isCreditPurchase.value,
    //         isGstInvoice: PurchaseNewStore.main.header.isGstInvoice.value,
    //     },
    //     validateOnMount: true,
    //     validationSchema: Yup.object({
    //         // refNo: Yup.string().required(accountsMessages.genericRequired),
    //         tranDate: Yup.date().required(accountsMessages.genericRequired),
    //         invoiceNo: Yup.string().required(accountsMessages.genericRequired)
    //     }),

    //     onSubmit: handleOnSubmit
    // })
    return (<Box sx={{ mt: theme.spacing(2), display: 'flex', flexDirection: 'column' }}>
        
            <PurchaseNewMainHeader />
       
    </Box>)
}
export { PurchaseNewMain }

// {/* <form onSubmit={formik.handleSubmit}> */}
//  {/* </form> */}