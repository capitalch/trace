import { Box, Button, Tab, Tabs, Typography, useTheme } from '../../../../../imports/gui-imports'
// import { useFormik, Yup } from '../../../../../imports/regular-imports'
import { useSharedElements } from '../../common/shared-elements-hook'
import { PurchaseStore } from '../purchase-store'
import { PurchaseMainHeader } from './purchase-main-header'
import { usePurchaseMain } from './purchase-main-hook'
import { PurchaseMainItems } from './items/purchase-main-items'
import { PurchaseMainSubheader } from './purchase-main-subheader'

function PurchaseMain({ purchaseType }: { purchaseType: 'pur' | 'ret' }) {
    const theme = useTheme()
    const { accountsMessages } = useSharedElements()
    const { handleOnSubmit } = usePurchaseMain()

    return (<Box sx={{ mt: theme.spacing(2), display: 'flex', flexDirection: 'column' }}>
        <PurchaseMainHeader />
        <PurchaseMainSubheader />
        <PurchaseMainItems />
    </Box>)
}
export { PurchaseMain }

// {/* <form onSubmit={formik.handleSubmit}> */}
//  {/* </form> */}
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