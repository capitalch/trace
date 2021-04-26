import _ from 'lodash'
import axios from 'axios'
import clsx from 'clsx'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
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
    Switch,
    Tabs,
    Tab,
    TextareaAutosize,
    TextField,
    Theme,
    Typography,
    useTheme,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useIbuki, usingIbuki } from './utils/ibuki'
import { utilMethods } from './utils/util-methods'
import {LoadingIndicator} from './utils/loading-indicator'
function useSharedElements() {
    const { toDecimalFormat } = utilMethods()
    return {
        _,
        axios,
        Button,
        ButtonGroup,
        clsx,
        DataTable,
        moment,
        Paper,
        Column,
        IconButton,
        InputAdornment,
        LoadingIndicator,
        SearchIcon,
        TextField,
        toDecimalFormat,
        Typography,
        useIbuki,
        usingIbuki,
    }
}

export { useSharedElements }
