import accountsMessages from '../../json/accounts-messages.json'
import { manageEntitiesState } from '../../../../imports/trace-imports'
import { utilMethods } from '../../../../global-utils/misc-utils'
// import reactDomServer from 'react-dom/server'
import axios from 'axios'

export { axios }
export { renderToStaticMarkup, renderToString } from 'react-dom/server'
export {
    Badge,
    Box,
    Button,
    Card,
    Container,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Input,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    RadioGroup,
    Radio,
    Switch,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '../../../../imports/gui-imports'
export {
    Add,
    AddCircle,
    Attachment,
    CheckCircle,
    CloseSharp,
    DeleteForever,
    Edit,
    Link,
    ListAlt,
    Preview,
    Search,
    SyncSharp,
} from '../../../../imports/icons-import'
export {
    _,
    moment,
    NumberFormat,
    PrimeColumn,
    ReactSelect,
    TreeTable,
    useContext,
    useEffect,
    useRef,
    useState,
    XXGrid,
} from '../../../../imports/regular-imports'
export { accountsMessages }
export { useSharedElements } from '../common/shared-elements-hook'
export { utilMethods } //from '../../../../global-utils/misc-utils'
export { utils } from '../../utils'
export { useStockSummaryReport } from './reports/gr-stock-summary-report-hook'
export { StockSummaryReport } from './reports/gr-stock-summary-report'
export { useTraceMaterialComponents } from '../../../../common/trace-material-components'
export { useConfirm } from 'material-ui-confirm'

export {
    DataGridPro,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridFooterContainer,
    type GridRowId,
    type GridRowData,
    useGridApiRef,
    type GridCellParams,
} from '@mui/x-data-grid-pro'

export { useIbuki } from '../../../../global-utils/ibuki'
export { MultiDataContext } from '../common/multi-data-bridge'
export { SalesReport } from './reports/gr-sales-report'
export {
    // manageEntitiesState,
    MegaDataContext,
    type IMegaData,
} from '../../../../imports/trace-imports'
export { useInventoryUtils } from './inventory-utils-hook'
export { PurchaseReport } from './reports/gr-purchase-report'
export { stockJournalMegaData } from '../common/init-mega-data-context-values'
export { manageEntitiesState }
export const { getFromBag, setInBag } = manageEntitiesState()
// export { getFromBag, setInBag }
export const { execGenericView, showPdf, genericUpdateMasterDetails } = utilMethods()
