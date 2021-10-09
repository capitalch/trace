import { moment, useState, useEffect, useRef } from '../../../../imports/regular-imports'
import {
    Avatar, makeStyles, Theme, createStyles, List,
    ListItem,
    ListItemAvatar, Typography,
    ListItemText,
} from '../../../../imports/gui-imports'
import { } from '../../../../imports/icons-import'
import { useSharedElements } from '../shared/shared-elements-hook'

function usePurchaseInvoiceNoSelect(arbitraryData: any) {
    const [, setRefresh] = useState({})
    useEffect(() => {
        meta.current.isMounted = true

        return () => {
            meta.current.isMounted = false
        }
    }, [])
    const classes = useStyles()
    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        searchFilter: '',
        purchaseInvoicesList: [],
        dialogConfig: {
            title: 'Select purchase invoice',
            subTitle:
                'Search on part of purchase invoice no, product label, brand name, product code, upc code, category name or product information',
            searchFilter: '',
            content: () => { },
            actions: () => { },
        },
    })

    const {
        emit,
        execGenericView,
        getFromBag,
        toDecimalFormat,
        TraceSearchBox,
    } = useSharedElements()

    function handleClear() {
        arbitraryData.userRefNo = ''
        setRefresh({})
    }

    function handleSearchInvoice() {
        const pre = meta.current.dialogConfig
        meta.current.searchFilter = ''
        meta.current.purchaseInvoicesList = []
        meta.current.showDialog = true
        pre.content = Content
        meta.current.isMounted && setRefresh({})
    }

    function Content() {
        const [, setRefresh] = useState({})
        const pre = meta.current.dialogConfig
        return (
            <div className={classes.searchDialogContent}>
                <Typography className="sub-title">{pre.subTitle}</Typography>
                <TraceSearchBox meta={meta} onSearch={onSearch} />
                <Typography variant="caption" component="div">
                    {String(
                        meta.current.purchaseInvoicesList?.length || ''
                    ).concat(' ', 'items')}
                </Typography>
                <List className="list">
                    {meta.current.purchaseInvoicesList}
                </List>
            </div>
        )

        async function onSearch() {
            emit('SHOW-LOADING-INDICATOR', true)
            try {
                const dateFormat = getFromBag('dateFormat')
                const result: any = await execGenericView({
                    sqlKey: 'getJson_search_purchase_invoice',
                    isMultipleRows: true,
                    args: {
                        arg: meta.current.searchFilter,
                    },
                })
                meta.current.purchaseInvoicesList = result?.map(
                    (item: any, index: number) => {
                        return (
                            <ListItem
                                className="list-item"
                                alignItems="flex-start"
                                key={index}
                                dense={true}
                                divider={true}
                                onClick={(e: any) => {
                                    emit(
                                        'PURCHASE-VIEW-HOOK-GET-PURCHASE-ON-ID',
                                        item.id
                                    )
                                    arbitraryData.userRefNo = item.userRefNo
                                    meta.current.showDialog = false
                                    meta.current.isMounted && setRefresh({})
                                }}
                                button={true}>
                                <ListItemAvatar>
                                    <Avatar>{index + 1}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <div className="primary">
                                            <Typography
                                                component="li"
                                                variant="body1">
                                                {moment(item.tranDate).format(
                                                    dateFormat
                                                )}
                                            </Typography>
                                            <Typography
                                                component="li"
                                                variant="body1">
                                                {', '.concat(item.userRefNo)}
                                            </Typography>
                                            <Typography
                                                component="li"
                                                variant="body1">
                                                {', '.concat(item.autoRefNo)}
                                            </Typography>
                                            <Typography
                                                component="li"
                                                variant="body1"
                                                className="amount">
                                                {toDecimalFormat(item.amount)}
                                            </Typography>
                                        </div>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                component="li"
                                                variant="body2">
                                                {item.products}
                                            </Typography>
                                            <Typography
                                                component="li"
                                                variant="body2">
                                                {item.remarks}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        )
                    }
                )
                setRefresh({})
            } catch (e: any) {
                console.log(e.message)
            }
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }

    return { handleClear, handleSearchInvoice, meta }
}

export { usePurchaseInvoiceNoSelect }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .purchase-invoice': {
                width: '22rem',
            },
            '& .button': {
                marginLeft: theme.spacing(2),
                marginTop: theme.spacing(2),
            },
        },

        searchDialogContent: {
            '& .sub-title': {
                color: 'dodgerBlue',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: theme.spacing(2),
            },
        },
    })
)

export { useStyles }
