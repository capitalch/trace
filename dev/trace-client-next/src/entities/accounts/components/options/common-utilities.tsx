import { MaterialTable, useEffect, useState, useRef } from '../../../../imports/regular-imports'
import { Button } from '../../../../imports/gui-imports'
import { usingIbuki } from '../../../../imports/trace-imports'
import { SendIcon } from '../../../../imports/icons-import'
import { tableIcons } from '../shared/material-table-icons'
import { utilMethods } from '../../../../global-utils/misc-utils'
import { utils } from '../../utils'
import accountsMessages from '../../json/accounts-messages.json'

function CommonUtilities() {
    const meta: any = useRef({
        isMounted: false,
        isBusy: false,
    })

    useEffect(() => {
        meta.current.isMounted = true
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const [, setRefresh] = useState({})
    const { emit } = usingIbuki()
    const { isControlDisabled } = utilMethods()
    const data = [
        {
            descr: accountsMessages['messTransferClosingBalance'],
            name: 'transferBalance',
            label: 'Transfer',
        },
    ].map((item: any, index: number) => {
        return {
            index: index + 1,
            ...item,
        }
    })

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title={'Utilities'}
                columns={[
                    {
                        title: 'Index',
                        render: (rowData: any) => rowData.index,
                        width: 20,
                    },
                    { title: 'Description', field: 'descr' },
                    {
                        title: 'Action',
                        render: (rowData: any) => (
                            <Button
                                disabled={isControlDisabled(
                                    'transferAccountsBalances'
                                )}
                                endIcon={<SendIcon></SendIcon>}
                                variant="contained"
                                color="secondary"
                                onClick={async (e) => {
                                    const { transferClosingBalances } = utils()
                                    meta.current.isBusy = true
                                    setRefresh({})
                                    const ret = await transferClosingBalances()
                                    if (
                                        ret?.data?.accounts
                                            ?.transferClosingBalances
                                    ) {
                                        emit('SHOW-MESSAGE', '')
                                    }
                                    meta.current.isBusy = false
                                    setRefresh({})
                                }}>
                                {rowData.label}
                            </Button>
                        ),
                        width: 20,
                    },
                ]}
                data={data}
                options={{
                    paging: false,
                    search: false,
                }}
            />
        </>
    )
}

export { CommonUtilities }

/*

*/