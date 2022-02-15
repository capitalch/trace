import { useState, useEffect, useRef } from '../../../../imports/regular-imports'
import { Typography, } from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'

function TypographySmart({ item }: any) {
    const { filterOn, getAccountBalanceFormatted } = useSharedElements()
    const [, setRefresh] = useState({})
    const meta = useRef({
        label: getAccountBalanceFormatted(item?.accId) || ''
    })

    useEffect(() => {
        const subs1 = filterOn('TYPOGRAPHY-SMART-REFRESH').subscribe(doUpdate)
        const subs2 = filterOn('TRACE-SERVER-MASTER-DETAILS-UPDATE-DONE').subscribe(() => doUpdate())

        function doUpdate() {
            const accId = item.accId
            meta.current.label = getAccountBalanceFormatted(accId)
            setRefresh({})
        }

        return (() => {
            subs1.unsubscribe()
            subs2.unsubscribe()
        })
    }, [])

    return (<Typography variant='caption' sx={{ fontWeight: 'bold', color: 'dodgerblue' }}>
        {meta.current.label}
    </Typography>)
}
export { TypographySmart }