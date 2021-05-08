import _ from 'lodash'
import axios from 'axios'
import clsx from 'clsx'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useConfirm } from 'material-ui-confirm'
import messages from './messages.json'

import {    
    Avatar,
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    Chip,
    Container,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    NativeSelect,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    Switch,
    Tabs,
    Tab,
    TextareaAutosize,
    TextField,
    Theme,
    Typography,
    useTheme,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import SearchIcon from '@material-ui/icons/Search'
import { useIbuki, usingIbuki } from './utils/ibuki'
import { utilMethods } from './utils/util-methods'
import {LoadingIndicator} from './utils/loading-indicator'
import CloseIcon from '@material-ui/icons/Close'

function useSharedElements() {
    const { toDecimalFormat, isValidMobile } = utilMethods()
    const confirm = useConfirm()
    const isElectron = require('is-electron')

    return {
        _,
        Alert,
        axios,
        Button,
        ButtonGroup,
        CloseIcon,
        clsx,
        confirm,
        DataTable,
        moment,
        Paper,
        Column,
        isValidMobile,
        IconButton,
        InputAdornment,
        isElectron,
        LoadingIndicator,
        messages,
        SearchIcon,
        Snackbar,
        TextField,
        toDecimalFormat,
        Typography,
        useIbuki,
        usingIbuki,
    }
}


export { useSharedElements }
