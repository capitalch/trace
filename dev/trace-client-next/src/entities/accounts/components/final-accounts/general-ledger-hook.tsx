import { useState, useEffect, useRef } from '../../../../imports/regular-imports'
import { makeStyles, Theme, createStyles } from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function useGeneralLedger() {
    const [, setRefresh] = useState({})

    const {
        emit,
        filterOn,
        getFromBag,
        getGeneralLedger,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        meta.current.allAccounts = (getFromBag('allAccounts') || []).map(
            (item: any) => ({
                label: item.accName,
                value: item.id,
                ...item,
            })
        )
        meta.current.ledgerAccounts = meta.current.allAccounts
            .filter((el: any) => el.accLeaf === 'Y' || el.accLeaf === 'L')
            .map((el: any) => {
                return {
                    label: el.accName,
                    value: el.id,
                    accLeaf: el.accLeaf,
                    subledgers: el.accLeaf === 'L' ? [] : null,
                }
            })
        const subs1 = filterOn('ROOT-WINDOW-REFRESH').subscribe(() => {
            emit('XX-GRID-FETCH-DATA', meta.current.sqlQueryArgs)
        })
        setRefresh({})
        return () => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        }
    }, [])

    const meta: any = useRef({
        accId: 0,
        allAccounts: [],
        data: [],
        dateFormat: getFromBag('dateFormat'),
        ledgerAccounts: [],
        isDailySummary: false,
        isMounted: false,
        isReverseOrder: false,
        showDialog: false,
        transactions: [],
        ledgerSubledger: {},
        sqlQueryArgs: null,
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
        },
    })

    // const { fetchData } = getGeneralLedger(meta)

    // async function handleFetchData() {
    //     const accId = meta.current.ledgerSubledger.accId
    //     if (accId) {
    //         await fetchData()
    //     } else {
    //         meta.current.showDialog = true
    //     }
    //     meta.current.isMounted && setRefresh({})
    // }

    return { meta }
}

export { useGeneralLedger }


const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .header': {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing(4),
                '& .heading': {
                    fontWeight: 'bold'
                },
                '& .expand': {
                    position: 'relative',
                    top: '.2rem',
                },
                '& .select-ledger': {
                    marginTop: theme.spacing(2),
                    display: 'flex',
                    flexDirection: 'column',
                    '& .ledger-subledger': {
                        position: 'relative',
                    },
                },
            },
            '& .data-grid': {
                height: 'calc(100vh - 303px)'
            }
            // '& .data-table': {
            //     '& .p-datatable-tfoot': {
            //         '& tr': {
            //             '& td': {
            //                 fontSize: '0.8rem',
            //                 color: 'dodgerBlue !important',
            //             }
            //         }
            //     },
            //     '& .ledger-summary': {
            //         color: theme.palette.blue.dark,
            //         backgroundColor: '#FFFAFA',
            //         fontFamily: 'Lato',
            //         fontWeight: 'bold'
            //     }
            // },


        },
    })
)

export { useStyles }
