import {
    _,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    Avatar,
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useSaleHeader(arbitraryData: any) {
    const [, setRefresh] = useState({})

    const { emit, execGenericView, getMappedAccounts } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        arbitraryData.rowData.accId =
            localStorage.getItem('saleAccountId') || null
        setRefresh({})
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => {},
            actions: () => {},
        },
    })

    function AccountsList({ mapFunction }: any) {
        return (
            <>
                <label>
                    {meta.current.dialogConfig.data.length}
                    {' Items'}
                </label>
                <List>{getListItems(mapFunction)}</List>
            </>
        )

        function getListItems(mapFunction = (x: any) => {}) {
            return meta.current.dialogConfig.data.map(
                (item: any, index: number) => {
                    return (
                        <ListItem
                            key={index}
                            dense={true}
                            button={true}
                            onClick={async () => {
                                arbitraryData.saleVarietyAccId = item.id
                                arbitraryData.saleVarietyAccName = item.accName
                                // arbitraryData.footer.items[0].rowData = {accId: arbitraryData.saleVarietyAccId}
                                arbitraryData.footer.items[0].accId =
                                    arbitraryData.saleVarietyAccId
                                emit('SALE-FOOTER-REFRESH', null)
                                await mapFunction(item)
                                meta.current.showDialog = false
                                meta.current.isMounted && setRefresh({})
                            }}>
                            <ListItemAvatar>
                                <Avatar>
                                    {item.accName[0]?.toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.accName}
                                secondary={
                                    <>
                                        <li>
                                            {item.accClass &&
                                                `Type: ${item.accClass}`}
                                        </li>
                                        <li>
                                            {item.gstin &&
                                                `Gstin: ${item.gstin}`}
                                        </li>
                                    </>
                                }
                            />
                        </ListItem>
                    )
                }
            )
        }
    }

    async function handleAutoSubledgerSales() {
        meta.current.dialogConfig.title =
            'Select a ledger account from following'
        meta.current.showDialog = true
        meta.current.dialogConfig.data =
            arbitraryData.accounts.autoSubledgerAccounts
        meta.current.dialogConfig.content = () => <AccountsList />
        meta.current.dialogConfig.actions = () => {}
        setFooterRow(arbitraryData.accounts.autoSubledgerAccounts)
        meta.current.isMounted && setRefresh({})
    }

    async function handleInstitutionSales() {
        meta.current.dialogConfig.title = 'Select an institution from following'
        meta.current.showDialog = true
        meta.current.dialogConfig.data =
            arbitraryData.accounts.debtorCreditorAccountsWithSubledgers
        meta.current.dialogConfig.content = () => (
            <AccountsList mapFunction={mapBillTo} />
        )
        meta.current.dialogConfig.actions = () => {}
        setFooterRow(arbitraryData.accounts.debtorCreditorAccountsWithLedgers)
        meta.current.isMounted && setRefresh({})

        async function mapBillTo(it: any) {
            emit('SHOW-LOADING-INDICATOR', true)
            const item = await execGenericView({
                isMultipleRows: false,
                sqlKey: 'get_extBusinessContactsAccM_on_accId',
                args: { id: it.id },
            })
            emit('SHOW-LOADING-INDICATOR', false)

            // copies businessContact to billTo
            const businessContact = {
                contactName: item?.contactName,
                mobileNumber: item?.mobileNumber,
                email: item?.email,
                address1: item?.jAddress?.[0]?.address1,
                address2: item?.jAddress?.[0]?.address2,
                pin: item?.jAddress?.[0]?.pin,
                country: item?.jAddress?.[0]?.country,
                state: item?.jAddress?.[0]?.state,
                city: item?.jAddress?.[0]?.city,
                gstin: item?.gstin,
            }
            arbitraryData.billTo = {
                ...arbitraryData.billTo,
                ...businessContact,
            }
        }
    }

    async function handleRetailCashBankSales() {
        meta.current.dialogConfig.title = 'Select a cash / bank account'
        meta.current.showDialog = true
        meta.current.dialogConfig.data =
            arbitraryData.accounts.cashBankAccountsWithSubledgers
        meta.current.dialogConfig.content = () => (
            <AccountsList mapFunction={() => {}} />
        )
        setFooterRow(arbitraryData.accounts.cashBankAccountsWithLedgers)
        meta.current.isMounted && setRefresh({})
    }

    function setFooterRow(ledgerAccounts: any[]) {
        if (arbitraryData?.footer?.items?.length > 0) {
            arbitraryData.footer.items[0].ledgerAccounts =
                getMappedAccounts(ledgerAccounts)
        }
    }

    function handleSaleVariety(variety: string) {
        arbitraryData.saleVariety = variety
        meta.current.isMounted && setRefresh({})
    }

    function resetAddresses() {
        arbitraryData.billTo = {}
        arbitraryData.shipTo = {}
        emit('BILL-TO-REFRESH', null)
    }

    function onChangeLedgerSubledger() {
        localStorage.setItem('saleAccountId', arbitraryData.rowData.accId)
        meta.current.isMounted && setRefresh({})
    }

    return {
        handleAutoSubledgerSales,
        handleInstitutionSales,
        handleRetailCashBankSales,
        handleSaleVariety,
        onChangeLedgerSubledger,
        resetAddresses,
        meta,
    }
}

export { useSaleHeader }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .sale-head': {
                '& .general': {
                    paddingTop: theme.spacing(1),
                    marginTop: theme.spacing(1),
                    marginLeft: theme.spacing(1),
                    marginBottom: '0px',
                },
            },

            '& .head-controls': {
                padding: theme.spacing(1),
                paddingTop: '0px',
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: theme.spacing(3),
                rowGap: theme.spacing(1),
                '& .sale-variety': {
                    display: 'flex',
                    flexDirection: 'column',

                    '& .selected-account': {
                        position: 'relative',
                        fontWeight: 'bold',
                        color: 'dodgerBlue',
                        fontSize: '0.8rem',
                    },
                },
            },
        },
    })
)

export { useStyles }
