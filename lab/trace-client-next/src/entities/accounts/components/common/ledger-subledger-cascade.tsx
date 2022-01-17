import { CascadeSelect, useState } from '../../../../imports/regular-imports'
import { makeStyles, createStyles } from '../../../../imports/gui-imports'

interface LedgerSubledgerCascadeOptions {
    allAccounts: any[]
    className?: string
    ledgerAccounts: any[]
    onSelectionChange?: any
    rowData: any
}
function LedgerSubledgerCascade({
    allAccounts,
    ledgerAccounts,
    onSelectionChange,
    rowData,
}: LedgerSubledgerCascadeOptions) {
    const [, setRefresh] = useState({})
    const classes = useStyles()

    return (
        <span className={classes.content}>
            <CascadeSelect
                options={ledgerAccounts}
                optionLabel={'accName'}
                optionGroupLabel={'accName'}
                optionGroupChildren={['subledgers']}
                style={{ minWidth: '14rem' }}
                placeholder={'All parties'}
                onChange={(e:any) => {
                    if (!e.value?.id) {
                        rowData.selectedAccount = undefined
                    } else {
                        rowData.selectedAccount = e.value
                    }
                    onSelectionChange && onSelectionChange()
                    setRefresh({})
                }}
                onGroupChange={async (e: any) => {
                    if (e.value?.accLeaf === 'Y') {
                        rowData.selectedAccount = e.value                        
                        e.value.subledgers = getSubledgers(e.value.id)
                        onSelectionChange && onSelectionChange()
                        // setRefresh({})
                    } else {
                        e.value.subledgers = getSubledgers(e.value.id)
                    }
                }}
                value={rowData.selectedAccount}
            />
        </span>
    )

    function getSubledgers(id: number) {
        return allAccounts
            .filter((x: any) => x.parentId === id)
            .map((x: any) => {
                return {
                    accName: x.accName,
                    id: x.id,
                }
            })
            .sort((a: any, b: any) => {
                if (a.accName > b.accName) return 1
                if (a.accName < b.accName) return -1
                return 0
            })
    }
}

export { LedgerSubledgerCascade }

const useStyles: any = makeStyles((theme: any) =>
    createStyles({
        content: {
            '& .p-cascadeselect': {
                minWidth: '15rem',
                height: '2.2rem',
                marginLeft: '1rem',
                fontSize: '0.9rem',
                '& .p-cascadeselect-panel': {
                    '& .p-cascadeselect-item-content': {
                        padding: '0.3rem',
                        fontSize: '.9rem',
                    },
                    '& .p-cascadeselect-sublist': {
                        maxHeight: '10rem',
                        overflowY: 'scroll',
                    },
                },
            },
        },
    })
)

export { useStyles }
