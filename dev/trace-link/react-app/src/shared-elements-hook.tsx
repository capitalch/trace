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
import { useIbuki, usingIbuki } from './utils/ibuki'
function useSharedElements() {
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
        TextField,
        Typography,
        useIbuki,
        usingIbuki,
    }
}

export { useSharedElements }
