import { useRecoilValue } from 'recoil'
import {
    _, Box, ButtonGroup, CloseSharp, Dialog, DialogContent, DialogTitle, EmailIcon, IconButton, IMegaData,
    manageEntitiesState, MegaDataContext, PDFViewer, Preview, SmsIcon, Tooltip, Typography, useContext, useEffect, useTraceMaterialComponents,
    useState, useTheme, utilMethods
} from '../redirect'
import { salesAtom } from '../sales-recoil-state/sales-atoms-selectors'

function RDebitsCreditsPreview() {
    const [, setRefresh] = useState({})
    const salesAtomValue:any = useRecoilValue(salesAtom)
    const theme = useTheme()
    const { toDecimalFormat } = utilMethods()
    const { getFromBag } = manageEntitiesState()
    return(<Box sx={{ display: 'flex', alignItems: 'center', rowGap: 1, flexWrap: 'wrap' }}>
        <Typography variant='body2'>Debits:&nbsp;{toDecimalFormat(salesAtomValue.debits)}</Typography>
        <Typography variant='body2' sx={{ ml: 2 }}>Credits:&nbsp;{toDecimalFormat(salesAtomValue.credits)}</Typography>
        <Typography variant='body2' sx={{ fontWeight: 'bold', ml: 2, color: (salesAtomValue.credits - salesAtomValue.debits) === 0 ? theme.palette.common.black : theme.palette.error.light }}>
            Diff:&nbsp;{toDecimalFormat(salesAtomValue.credits - salesAtomValue.debits)}
        </Typography>
    </Box>)
}
export { RDebitsCreditsPreview }
