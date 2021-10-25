import {
    moment,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useDebitCreditNoteBody(arbitraryData: any, tranType: string) {
    const [, setRefresh] = useState({})
    const {
        emit,
        getCurrentComponent,
        getFromBag,
        genericUpdateMasterDetails,
        hotFilterOn,
        isInvalidDate,
        map,
    } = useSharedElements()

    const isoFormat = 'YYYY-MM-DD'
    const meta: any = useRef({
        isMounted: false,
        // debtorCreditorLedgerAccounts: [],
        // saleLedgerAccounts: [],
        // purchaseLedgerAccounts: [],
        // allAccounts: [],
    })
    const accounts = arbitraryData.body.accounts

    // arbitraryData.body = arbitraryData.body || {
    //     amount: 0.0,
    //     autoRefNo: undefined,
    //     commonRemarks: undefined,
    //     ledgerSubledgerCredit: {},
    //     ledgerSubledgerDebit: {},
    //     lineRefNoDebit: undefined,
    //     lineRefNoCredit: undefined,
    //     lineRemarksDebit: undefined,
    //     lineRemarksCredit: undefined,
    //     tranDate: arbitraryData?.body?.tranDate || moment().format(isoFormat),
    //     tranDetailsIdDebit: undefined,
    //     tranDetailsIdCredit: undefined,
    //     tranHeaderIdDebit: undefined,
    //     tranHeaderIdCredit: undefined,
    //     userRefNo: undefined,
    //     isViewBack: false,
    // }

    useEffect(() => {
        meta.current.isMounted = true
        setAccounts()
        setRefresh({})
        // const pipe1: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').pipe(
        //     map((d: any) =>
        //         d.data.allAccounts.filter((el: any) => {
        //             const accClasses = ['debtor', 'creditor']
        //             let condition =
        //                 accClasses.includes(el.accClass) &&
        //                 (el.accLeaf === 'Y' || el.accLeaf === 'L')
        //             return condition
        //         })
        //     )
        // )

        // const pipe2: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').pipe(
        //     map((d: any) =>
        //         d.data.allAccounts.filter(
        //             (el: any) =>
        //                 ['purchase'].includes(el.accClass) &&
        //                 (el.accLeaf === 'Y' || el.accLeaf === 'L')
        //         )
        //     )
        // )

        // const pipe3: any = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').pipe(
        //     map((d: any) =>
        //         d.data.allAccounts.filter(
        //             (el: any) =>
        //                 ['sale'].includes(el.accClass) &&
        //                 (el.accLeaf === 'Y' || el.accLeaf === 'L')
        //         )
        //     )
        // )

        // const subs1 = pipe1.subscribe((d: any) => {
        //     accounts.debtorCreditorLedgerAccounts = d.map((el: any) => {
        //         return {
        //             label: el.accName,
        //             value: el.id,
        //             accLeaf: el.accLeaf,
        //             isAutoSubledger: !!el.isAutoSubledger,
        //         } // !! converts falsy to boolean false
        //     })
        // })

                    // const subs2 = pipe2.subscribe((d: any) => {
                    //     accounts.purchaseLedgerAccounts = d.map((el: any) => {
                    //         return { label: el.accName, value: el.id, accLeaf: el.accLeaf }
                    //     })
                    // })

                    // const subs3 = pipe3.subscribe((d: any) => {
                    //     accounts.saleLedgerAccounts = d.map((el: any) => {
                    //         return { label: el.accName, value: el.id, accLeaf: el.accLeaf }
                    //     })
                    // })

                    // const subs4: any = hotFilterOn(
                    //     'DATACACHE-SUCCESSFULLY-LOADED'
                    // ).subscribe((d: any) => {
                    //     accounts.allAccounts = d.data.allAccounts
                    // })
        
        return () => {
            meta.current.isMounted = false
            // subs1.unsubscribe()
            // subs2.unsubscribe()
            // subs3.unsubscribe()
            // subs4.unsubscribe()
        }
    }, [])

    function setAccounts() {
        // allAccounts
        const allAccounts = getFromBag('allAccounts') || []
        accounts.allAccounts = allAccounts

        //purchaseLedgerAccounts
        const purchaseLedgerAccounts = allAccounts.filter(
            (el: any) =>
                ['purchase'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        accounts.purchaseLedgerAccounts = purchaseLedgerAccounts

        //saleLedgerAccounts
        const saleLedgerAccounts = allAccounts.filter(
            (el: any) =>
                ['sale'].includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf === 'L')
        )
        accounts.saleLedgerAccounts = saleLedgerAccounts

        // debtorCreditorLedgerAccounts
        const drCrArray = ['debtor', 'creditor']
        const debtorCreditorLedgerAccounts = allAccounts.filter(
            (el: any) =>
                drCrArray.includes(el.accClass) &&
                (el.accLeaf === 'Y' || el.accLeaf == 'L') &&
                !el.isAutoSubledger
        )
        accounts.debtorCreditorLedgerAccounts = debtorCreditorLedgerAccounts
    }

    function getError() {
        const ret =
            arbitraryData.body.ledgerSubledgerDebit.isLedgerSubledgerError ||
            arbitraryData.body.ledgerSubledgerCredit.isLedgerSubledgerError ||
            !arbitraryData.body.amount ||
            isInvalidDate(arbitraryData.body.tranDate)
        return ret
    }

    async function handleSubmit() {
        const header = extractHeader()
        header.data[0].details.push(extractDebits())
        header.data[0].details.push(extractCredits())
        const ret = await genericUpdateMasterDetails([header])
        if (ret.error) {
            console.log(ret.error)
        } else {
            if (arbitraryData.shouldCloseParentOnSave) {
                emit('ACCOUNTS-LEDGER-DIALOG-CLOSE-DRILL-DOWN-CHILD-DIALOG', '')
            } else if (arbitraryData.isViewBack) {
                emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
                // arbitraryData.body.isViewBack = false
                emit('DEBIT-CREDIT-NOTES-HOOK-CHANGE-TAB', 1)
                emit('DEBIT-CREDIT-NOTES-VIEW-HOOK-FETCH-DATA', null)
            } else {
                emit('LAUNCH-PAD:LOAD-COMPONENT', getCurrentComponent())
            }
        }
    }

    function extractHeader() {
        const finYearId = getFromBag('finYearObject')?.finYearId
        const branchId = getFromBag('branchObject')?.branchId || 1
        const isoFormat = 'YYYY-MM-DD'
        const tranDate = moment().format(isoFormat)

        const obj: any = {
            tableName: 'TranH',
            data: [],
        }

        const item: any = getTranHDataItem()
        item.autoRefNo = arbitraryData.body.autoRefNo || undefined
        item.tranDate = arbitraryData.body.tranDate || tranDate
        item.finYearId = finYearId
        item.branchId = branchId
        item.remarks = arbitraryData.body.commonRemarks
        item.tranTypeId = tranType === 'dn' ? 7 : 8
        item.id = arbitraryData.body.id || undefined
        item.userRefNo = arbitraryData.body.userRefNo || undefined
        obj.data.push(item)
        return obj
    }

    function extractCredits() {
        const credit: any = {
            tableName: 'TranD',
            fkeyName: 'tranHeaderId',
            data: [],
        }
        const amt: number = arbitraryData.body.amount
        credit.data.push({
            id: arbitraryData.body.tranDetailsIdCredit,
            accId: arbitraryData.body?.ledgerSubledgerCredit?.accId,
            amount: amt,
            lineRefNo: arbitraryData.body?.lineRefNoCredit,
            remarks: arbitraryData.body?.lineRemarksCredit,
            dc: 'C',
        })
        return credit
    }

    function extractDebits() {
        const debit: any = {
            tableName: 'TranD',
            fkeyName: 'tranHeaderId',
            data: [],
        }
        const amt: number = arbitraryData.body.amount
        debit.data.push({
            id: arbitraryData.body.tranDetailsIdDebit,
            accId: arbitraryData.body?.ledgerSubledgerDebit?.accId,
            amount: amt,
            lineRefNo: arbitraryData.body?.lineRefNoDebit,
            remarks: arbitraryData.body?.lineRemarksDebit,
            dc: 'D',
        })
        return debit
    }

    return { getError, handleSubmit, meta }
}

export { useDebitCreditNoteBody }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginLeft: theme.spacing(2),
            '& .header': {
                marginTop: theme.spacing(2),
                display: 'flex',
                alignItems: 'center',
                '& .no': {
                    color: theme.palette.blue.main,
                },
                '& .submit': {
                    marginLeft: 'auto',
                    marginRight: theme.spacing(2),
                },
            },
            '& .body': {
                marginTop: theme.spacing(1),
                '& .body-line-one': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    columnGap: theme.spacing(3),
                    rowGap: theme.spacing(2),
                    '& .common-remarks': {
                        maxWidth: '20rem',
                        width: '100%',
                    },
                    '& .right-aligned-numeric': {
                        maxWidth: '10.5rem',
                        '& input': {
                            textAlign: 'end',
                        },
                    },
                },
                '& .body-line-two-three': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    columnGap: theme.spacing(2),
                    '& .ledger-subledger-box': {
                        marginTop: theme.spacing(2),
                        '& .ledger-subledger': {
                            marginTop: theme.spacing(1),
                        },
                    },

                    '& .common-text': {
                        marginTop: theme.spacing(5),
                    },
                    '& .remarks': {
                        maxWidth: '20rem',
                        width: '100%',
                    },
                    '& .submit': {
                        marginTop: theme.spacing(8),
                        marginLeft: 'auto',
                        marginRight: theme.spacing(2),
                        height: theme.spacing(4),
                    },
                },
                '& .gutter': {
                    height: theme.spacing(4),
                },
            },
        },
    })
)

export { useStyles }

const getTranHDataItem = () => ({
    tranDate: '',
    userRefNo: null,
    remarks: '',
    tags: null,
    jData: '{}',
    finYearId: '',
    branchId: '',
    posId: '1',
    autoRefNo: null,
    tranTypeId: 0,
    details: [],
})
