import { _, moment, useState, useEffect, useRef } from '../../../../imports/regular-imports'
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Avatar, makeStyles, createStyles
} from '../../../../imports/gui-imports'
import { useSharedElements } from './shared-elements-hook'
import { initCode } from '../../init-code'

function useAccountsSubHeader() {
    const [, setRefresh] = useState({})
    const { setLastBuCodeFinYearIdBranchId } = initCode()
    const {
        accountsMessages,
        emit,
        execGenericView,
        genericUpdateMasterNoForm,
        getCurrentEntity,
        getFromBag,
        getLoginData,
        getUnitHeading,
        setInBag,
    } = useSharedElements()

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        return () => {
            curr.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => <></>,
            actions: () => { },
        },
    })

    const buCode = getFromBag('buCode')
    const finYearObject = getFromBag('finYearObject') || undefined
    const branchObject = getFromBag('branchObject') // default is HEAD
    const entityName = getCurrentEntity()
    const authEntityName = 'authentication'
    const loginData = getLoginData()
    const dateFormat: string = getFromBag('dateFormat')

    const exhibitLogic: any = {
        xs: () => {
            return {
                bu: buCode || 'Select',
                fy: finYearObject?.finYearId || 'Select',
                br: branchObject?.branchCode || 'Select',
                maxWidth: '22%',
                fyMaxWidth: '22%',
            }
        },
        sm: () => {
            return {
                bu: buCode || 'Select',
                fy: finYearObject?.finYearId || 'Select',
                br: branchObject?.branchName || 'Select',
                maxWidth: '22%',
                fyMaxWidth: '22%',
                refreshCache: true,
            }
        },
        md: () => {
            const finYearRange = String(finYearObject?.finYearId || '').concat(
                ' ( ',
                finYearObject?.startDate || '',
                ' - ',
                finYearObject?.endDate || '',
                ' )'
            )
            return {
                bu: buCode || 'Select business unit',
                fy: finYearRange || 'Select fin year',
                br: branchObject?.branchName || 'Select branch',
                maxWidth: '12rem',
                fyMaxWidth: '16rem',
                refreshCache: true,
            }
        },
        lg: () => {
            return exhibitLogic['md']()
        },
        xl: () => {
            return exhibitLogic['md']()
        },
    }

    async function handleSelectBranch() {
        meta.current.dialogConfig.title = 'Select branch'
        meta.current.showDialog = true
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_branches',
            args: {},
            entityName: entityName,
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (!ret) {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages['getBranchesFailed'],
                duration: null,
            })
            return
        }
        const branches: any[] = ret
        setInBag('branches', branches) // to be used in update, at later stage
        const branchesArray = branches.map((x) => {
            return {
                label: x.branchCode.concat(' : ', x.branchName),
                id: x.id,
            }
        })
        const listItems: any[] = branchesArray.map((x: any) => {
            return (
                <ListItem
                    dense={true}
                    divider={true}
                    button={true}
                    key={x.id}
                    alignItems="flex-start"
                    onClick={() => handleListItemClick(x)}>
                    <ListItemAvatar>
                        <Avatar>{x.label[0].toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        style={{ marginTop: '1.1rem' }}
                        primary={x.label}
                    />
                </ListItem>
            )
        })

        meta.current.dialogConfig.content = () => (
            <List component="ul">{listItems}</List>
        )
        meta.current.isMounted && setRefresh({})

        async function handleListItemClick(item: any) {
            const branches: any[] = getFromBag('branches')
            const branchId = item.id
            const branchObject = getFromBag('branchObject')

            if (branchObject?.branchId !== branchId) {
                const selectedObject: any = branches.find(
                    (x) => x.id === branchId
                )
                branchObject.branchId = selectedObject.id
                branchObject.branchName = selectedObject.branchName
                branchObject.branchCode = selectedObject.branchCode
                // save in authenticatio DB useHistory table
                const ret: any = await genericUpdateMasterNoForm({
                    customCodeBlock: 'update_lastUsedBranchId',
                    entityName: authEntityName,
                    data: {
                        userId: getLoginData().id,
                        branchId: item.id,
                    },
                    setRefresh: setRefresh,
                })
                if (ret === true || ret?.length <= 9) {
                    setInBag('branchObject', branchObject)
                    emit('SHOW-MESSAGE', {})
                    emit('TRACE-SUBHEADER:JUST-REFRESH', '')
                    emit('TRACE-MAIN:JUST-REFRESH', {
                        mainHeading: getUnitHeading(),
                    })
                    meta.current.showDialog = false
                    meta.current.isMounted && setRefresh({})
                }
            }
        }

        meta.current.isMounted && setRefresh({})
    }

    async function handleSelectFinYear() {
        meta.current.dialogConfig.title = 'Select financial year'
        emit('SHOW-LOADING-INDICATOR', true)
        meta.current.showDialog = true

        const ret = await execGenericView({
            isMultipleRows: true,
            sqlKey: 'get_finYears',
            args: {},
            entityName: entityName,
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (!ret) {
            emit('SHOW-MESSAGE', {
                severity: 'error',
                message: accountsMessages['getFinYearsFailed'],
                duration: null,
            })
            return
        }
        const finYears: any[] = ret
        setInBag('finYears', finYears) // to be used in update, at later stage
        const finYearsArray = finYears.map((x) => {
            return {
                label: String(x.id).concat(
                    ' : ( ',
                    moment(x.startDate).format(dateFormat),
                    ' to ',
                    moment(x.endDate).format(dateFormat),
                    ' )'
                ),
                id: x.id,
            }
        })
        const listItems: any[] = finYearsArray.map((x: any) => {
            return (
                <ListItem
                    dense={true}
                    divider={true}
                    button={true}
                    key={x.id}
                    alignItems="flex-start"
                    onClick={() => handleListItemClick(x)}>
                    <ListItemAvatar>
                        <Avatar> F</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        style={{ marginTop: '1.1rem' }}
                        primary={x.label}
                    />
                </ListItem>
            )
        })
        meta.current.dialogConfig.content = () => (
            <List component="ul">{listItems}</List>
        )
        meta.current.isMounted && setRefresh({})

        function handleListItemClick(item: any) {
            const finYearId = item.id
            if (finYearObject?.finYearId !== finYearId) {
                const selectedObject: any = finYears.find((x) => {
                    return x.id === +finYearId
                })
                finYearObject.finYearId = selectedObject?.id
                finYearObject.startDate = moment(
                    selectedObject.startDate
                ).format(dateFormat)
                finYearObject.endDate = moment(selectedObject.endDate).format(
                    dateFormat
                )
                emit('SHOW-MESSAGE', {})
                emit('TRACE-SUBHEADER:JUST-REFRESH', '')
                emit('TRACE-MAIN:JUST-REFRESH', {
                    mainHeading: getUnitHeading(),
                })
                meta.current.showDialog = false
                meta.current.isMounted && setRefresh({})
            }
        }
    }

    async function handleSelectBu() {
        meta.current.showDialog = true
        const ifElse: any = {
            a: 'adminUserBuListPermissions',
            b: 'businessUserBuListPermissions',
        }
        meta.current.dialogConfig.title = 'Select business unit'
        emit('SHOW-LOADING-INDICATOR', true)
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_businessUnits_permissions_for_loggedinUser',
            args: {
                entityName: entityName,
                userId: loginData.id,
            },
            entityName: authEntityName,
        })
        emit('SHOW-LOADING-INDICATOR', false)
        if (!ret) return
        const pre = ret.jsonResult
        const buArray = pre?.[ifElse[loginData.userType]]
        const buListItems: any[] = buArray.map((x: any) => {
            return (
                <ListItem
                    dense={true}
                    divider={true}
                    button={true}
                    key={x.buCode}
                    onClick={() => handleListItemClick(x)}
                    alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar>{x.buCode[0].toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        style={{ marginTop: '1.1rem' }}
                        primary={x.buCode}
                    />
                </ListItem>
            )
        })
        meta.current.dialogConfig.content = () => (
            <List component="ul">{buListItems}</List>
        )
        meta.current.isMounted && setRefresh({})

        async function handleListItemClick(item: any) {
            const ret: any = await genericUpdateMasterNoForm({
                customCodeBlock: 'update_lastUsedBuCode',
                entityName: authEntityName,
                data: {
                    userId: getLoginData().id,
                    buCode: item.buCode,
                },
                setRefresh: setRefresh,
            })
            if (ret === true || ret?.length <= 9) {
                setInBag('buCode', item.buCode)
                getLoginData().lastUsedBuCode = item.buCode
                emit('SHOW-MESSAGE', {})
                //when buCode is changed then set the default branch id which is 1
                setLastBuCodeFinYearIdBranchId(1) // to restart init-code to load bu, finYear and branch in trace-subheader. The finYear and branch depend on bu.
                // now set permissions for the selected bu and user
                const buObject = buArray.find(
                    (x: any) => x.buCode === item.buCode
                )
                const permissions = _.isEmpty(buObject)
                    ? []
                    : buObject.permissions
                getLoginData().permissions = permissions
                meta.current.showDialog = false
                meta.current.isMounted && setRefresh({})
            }
        }
    }

    function utilFunc() {
        const dateFormat = getFromBag('dateFormat')
        async function changeFinYear(change: number) {
            const entityName = getCurrentEntity()
            const finYearObject = getFromBag('finYearObject')
            const finYearId = finYearObject?.finYearId
            if (finYearId) {
                const prevFinYearId = finYearId + change
                const ret = await execGenericView({
                    isMultipleRows: false,
                    sqlKey: 'get_finYearDates',
                    args: { finYearId: prevFinYearId },
                    entityName: entityName,
                })
                const startDate = ret?.startDate
                const endDate = ret?.endDate
                if (startDate && endDate) {
                    finYearObject.finYearId = prevFinYearId
                    finYearObject.startDate =
                        moment(startDate).format(dateFormat)
                    finYearObject.endDate = moment(endDate).format(dateFormat)
                    finYearObject.isoStartDate = startDate
                    finYearObject.isoEndDate = endDate
                    setInBag('finYearObject', finYearObject)
                    emit('TRACE-SUBHEADER:JUST-REFRESH', '')
                    emit('TRACE-MAIN:JUST-REFRESH', {
                        mainHeading: getUnitHeading(),
                    })
                }
            }
        }
        return { changeFinYear }
    }

    return {
        exhibitLogic,
        handleSelectBranch,
        handleSelectBu,
        handleSelectFinYear,
        meta,
        utilFunc,
    }
}

export { useAccountsSubHeader }

const useStyles: any = makeStyles(() =>
    createStyles({
        content: {
            '& .chip-select': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            },

            '& .containerBox': {
                width: '100%',
                alignItems: 'center',
            },
        },
    })
)

export { useStyles }
