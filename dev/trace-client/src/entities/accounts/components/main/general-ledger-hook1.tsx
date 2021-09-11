import { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function useGeneralLedger1() {
    const [, setRefresh] = useState({})

    const {
        getFromBag,
        getGeneralLedger,
    } = useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        meta.current.allAccounts = (getFromBag('allAccounts')|| []).map(
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
        setRefresh({})
        return () => {
            meta.current.isMounted = false
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
        // rowCount: 0,
        transactions: [],
        ledgerSubledger: {},
        headerConfig: {
            title: 'General ledger',
        },
        dialogConfig: {
            title: '',
            content: () => {},
            actions: () => {},
        },
    })

    const { fetchData } = getGeneralLedger(meta)

    async function handleFetchData() {
        const accId = meta.current.ledgerSubledger.accId
        if (accId) {
            await fetchData()
        } else {
            meta.current.showDialog = true
        }
        meta.current.isMounted && setRefresh({})
    }

    return { handleFetchData, meta }
}

export { useGeneralLedger1 }


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
                    fontWeight:'bold'
                    // position: 'relative',
                    // top: '-2.5rem',
                },
                '& .expand': {
                    position: 'relative',
                    top: '.2rem',
                },
                '& .select-ledger': {
                    // position:'relative',
                    // top: '1rem',
                    marginTop: theme.spacing(2),
                    display: 'flex',
                    flexDirection: 'column',
                    // rowGap: '0.2rem',
                    '& .ledger-subledger': {
                        position: 'relative',
                        // top:'0.5rem'
                    },
                },
            },
            '& .data-table': {
                '& .p-datatable-tfoot': {
                    '& tr':{
                        '& td': {
                    fontSize: '0.8rem',
                    color: 'dodgerBlue !important',
                        }
                    }
                },
                '& .ledger-summary':{
                    color: theme.palette.blue.dark,
                    backgroundColor: '#FFFAFA',
                    // fontSize:'0.7rem',
                    fontFamily:'Lato',
                    fontWeight: 'bold'
                    // textAlign:'right',
                }
            },

           
        },
    })
)

export { useStyles }
