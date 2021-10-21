import {Big, useState, useEffect, useRef } from '../../../../imports/regular-imports'
import { makeStyles, Theme, createStyles } from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useSaleFooter(arbitraryData: any) {
    const [, setRefresh] = useState({})
    const { emit, getFromBag, getMappedAccounts } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        if (arbitraryData.footer?.items?.length === 0) {
            handleAddItem()
        }
        return () => {
            meta.current.isMounted = false
        }
    })

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => {},
            actions: () => {},
        },
    })

    function computeSummary() {
        arbitraryData.footer.amount = arbitraryData.footer.items.reduce(
            (prev: any, curr: any) => {
                prev.amount = +Big(curr.amount || 0).plus(Big(prev.amount || 0))
                return prev
            },
            { amount: 0 }
        ).amount
        arbitraryData.salesCrownRefresh()
    }

    function handleAddItem() {
        const length = arbitraryData.footer.items.push({
            index: arbitraryData.footer.items.length + 1,
            accId: '',
            amount: 0.0,
            isAmountError: true,
            isLedgerSubledgerError: true,
            remarks: '',
        })
        const allAccounts = getFromBag('allAccounts') || []
        const cashBankArray = ['cash', 'bank', 'card', 'ecash']
        const cashBankAccountsLedger = allAccounts.filter(
            (el: any) =>
                cashBankArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        arbitraryData.footer.items[
            length - 1
        ].ledgerAccounts = getMappedAccounts(cashBankAccountsLedger) //default
        computeSummary()
        meta.current.isMounted && setRefresh({})
    }

    function handleDeleteItem(e: any, rowData: any) {
        const rowIndex = rowData.index - 1
        const items = arbitraryData.footer.items
        items.splice(rowIndex, 1)
        if (rowData.id) {
            arbitraryData.footer.deletedIds.push(rowData.id) // deletion is actually done in table salePurchaseDetails
        }
        for (let i = 0; i < items.length; i++) {
            items[i].index = i + 1
        }
        computeSummary()
        meta.current.isMounted && setRefresh({})
    }

    function onChangeLedgerSubledger(rowData: any) {
        arbitraryData.saleVarietyAccId = rowData.accId
        const allAccounts: any[] = getFromBag('allAccounts')
        const accName = allAccounts.find((x: any) => x.id === rowData.accId)
            ?.accName
        arbitraryData.saleVarietyAccName = accName
        arbitraryData.salesCrownRefresh()
    }

    return {
        computeSummary,
        handleAddItem,
        handleDeleteItem,
        meta,
        onChangeLedgerSubledger,
    }
}

export { useSaleFooter }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginTop: theme.spacing(1),
            '& .sale-footer': {
                '& .index-header': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    '& .index': {
                        marginLeft: '0.2rem',
                    },
                    '& .add-box': {
                        position: 'relative',
                        left: '-0.9rem',
                        marginLeft: '0px',
                        '& .add-icon': {
                            fontSize: '2.2rem',
                            color: theme.palette.secondary.main,
                        },
                    },
                },
                '& .index-body': {
                    '& .delete-icon': {
                        fontSize: '1.5rem',
                        color: theme.palette.secondary.dark,
                    },
                    '&  .clear-icon': {
                        color: 'dodgerBlue',
                    },
                },
                '& .right-aligned-numeric': {
                    '& input': {
                        textAlign: 'end',
                    },
                },
            },
        },
    })
)

export { useStyles }
