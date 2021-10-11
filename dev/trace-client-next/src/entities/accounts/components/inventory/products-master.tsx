import {
    NativeSelect,
    Box,
    Icon,
    IconButton,
    Paper,
    Typography,
    Button,
} from '../../../../imports/gui-imports'
import {
    useState,
    useEffect,
    MaterialTable,
} from '../../../../imports/regular-imports'
import {
    AddCircle,
    DeleteForever,
    SyncSharp,
    Edit,
} from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useProductsMaster, useStyles } from './products-master-hook'
import { NewProduct } from './new-product'
import { DeleteSharp } from '@material-ui/icons'

function ProductsMaster() {
    const [, setRefresh] = useState({})
    const { meta } = useProductsMaster()
    const classes = useStyles()

    useEffect(() => {
        meta.current.isMounted = true
        fetchData()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const {
        emit,
        execGenericView,
        getFromBag,
        setInBag,
        tableIcons,
        TraceDialog,
    } = useSharedElements()

    return (
        <Paper className={classes.content}>
            <MaterialTable
                actions={getActionsList()}
                columns={getColumns()}
                components={{
                    Action: (props: any) => {
                        let ret: any
                        if (props.action.name === 'edit') {
                            ret = (
                                <Button
                                    color="secondary"
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => {
                                        emit('NEW-PRODUCT-EDIT', props.data)
                                    }}
                                />
                            )
                        } else if (props.action.name === 'delete') {
                            ret = (
                                <Button
                                    className="delete-button"
                                    size="small"
                                    startIcon={<DeleteForever/>}
                                    onClick={() =>
                                        emit('NEW-PRODUCT-DELETE', props.data)
                                    }></Button>
                            )
                        } else if (props.action.name === 'add') {
                            ret = <NewProduct isIconButton={true} />
                        } else if (props.action.name === 'refresh') {
                            ret = (
                                <IconButton
                                    className="refresh-button"
                                    onClick={fetchData}>
                                    <SyncSharp style={{ fontSize: '2rem' }} />
                                </IconButton>
                            )
                        } else if (props.action.name === 'select') {
                            ret = (
                                <Box component="span">
                                    <Typography
                                        variant="caption"
                                        component="span">
                                        Last
                                    </Typography>
                                    <NativeSelect
                                        value={
                                            getFromBag('allProducts') ??
                                            meta.current.no // if undefined or null then 10
                                        }
                                        style={{
                                            width: '3.3rem',
                                            marginLeft: '0.1rem',
                                        }}
                                        onChange={(e) => {
                                            setInBag(
                                                'allProducts',
                                                e.target.value
                                            )
                                            fetchData()
                                        }}>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                        <option value={1000}>1000</option>
                                        <option value={''}>All</option>
                                    </NativeSelect>
                                </Box>
                            )
                        }
                        return ret
                    },
                }}
                data={meta.current.data}
                icons={tableIcons}
                options={{
                    actionsColumnIndex: 1,
                    paging: false,
                    search: true,
                }}
                title={meta.current.title}></MaterialTable>

            <TraceDialog meta={meta} />
        </Paper>
    )

    function getActionsList() {
        return [
            {
                icon: () => <Edit />,
                name: 'edit',
                onClick: () => {},
            },
            {
                icon: () => <DeleteSharp />,
                name: 'delete',
                onClick: () => {},
            },
            {
                icon: () => <SyncSharp />,
                name: 'refresh',
                isFreeAction: true,
                onClick: () => {},
            },
            {
                icon: () => <AddCircle />,
                name: 'add',
                isFreeAction: true,
                onClick: () => {},
            },
            {
                icon: () => <Icon />,
                name: 'select',
                isFreeAction: true,
                onClick: () => {},
            },
        ]
    }

    function getColumns() {
        return [
            { title: 'Index', field: 'index', width: '4rem' },
            { title: 'Id', field: 'id', width: '4rem' },
            { title: 'Code', field: 'productCode', width: '6rem' },
            { title: 'Category', field: 'catName', width: '10rem' },
            { title: 'Brand', field: 'brandName', width: '10rem' },
            { title: 'Label', field: 'label', width: '10rem' },
            { title: 'HSN', field: 'hsn', width: '6rem' },
            { title: 'Unit', field: 'unitName', width: '4rem' },
            { title: 'Details', field: 'info' },
            { title: 'UPC', field: 'upcCode', width: '10rem' },
        ]
    }

    async function fetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const result: any = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_products',
            args: {
                no: (getFromBag('allProducts') ?? meta.current.no) || null,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        meta.current.data = result
        meta.current.isMounted && setRefresh({})
    }
}

export { ProductsMaster }
