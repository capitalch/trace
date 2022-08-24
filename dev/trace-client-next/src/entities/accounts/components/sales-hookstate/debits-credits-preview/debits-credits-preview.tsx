import { useHookstate } from '@hookstate/core'
import {
    _, Box, ButtonGroup, CloseSharp, Dialog, DialogContent, DialogTitle, EmailIcon, IconButton, IMegaData,
    manageEntitiesState, MegaDataContext, PDFViewer, Preview, SmsIcon, Tooltip, Typography, useContext, useEffect, useTraceMaterialComponents,
    useState, useTheme, utilMethods
} from '../redirect'
import { salesGlobal } from '../sales-global-state/sales-global'

function DebitsCreditsPreview() {
    const [, setRefresh] = useState({})
    // const salesAtomValue:any = useRecoilValue(salesAtom)
    const salesState = useHookstate(salesGlobal)
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const { getFromBag } = manageEntitiesState()
    return(<Box sx={{ display: 'flex', alignItems: 'center', rowGap: 1, flexWrap: 'wrap' }}>
        <Typography variant='body2'>Debits:&nbsp;{toDecimalFormat(salesState.debits.get())}</Typography>
        <Typography variant='body2' sx={{ ml: 2 }}>Credits:&nbsp;{toDecimalFormat(salesState.credits.get())}</Typography>
        <Typography variant='body2'>{salesState.billTo.gstin.get()}</Typography>
        <Typography variant='body2' sx={{ fontWeight: 'bold', ml: 2, color: (salesState.credits.get() - salesState.debits.get()) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
            Diff:&nbsp;{toDecimalFormat(salesState.credits.get() - salesState.debits.get())}
        </Typography>
    </Box>)
}
export { DebitsCreditsPreview }