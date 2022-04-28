import { _, Avatar, Box, Button, CloseSharp, errorMessages, FormControlLabel, IconButton, IMegaData, LedgerSubledger, List, ListItem, ListItemAvatar, ListItemText, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useIbuki, useTraceMaterialComponents, Typography, useContext, useEffect, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function useShipTo() {
    const [, setRefresh] = useState({})
    const theme = useTheme()
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const shipTo = sales.shipTo
    const allErrors = sales.allErrors
    const { emit } = useIbuki()
    const meta: any = useRef({
        showDialog: false,
        dialogConfig: {
            title: 'New shipping details',
            content: () => <></>,
            maxWidth: 'sm'
        }
    })
    const pre = meta.current

    useEffect(() => {
        megaData.registerKeyWithMethod('closeDialog:shipTo', closeDialog)
        megaData.registerKeyWithMethod('handleClear:shipTo', handleClear)
    }, [])

    useEffect(() => {
        emit('ALL-ERRORS-JUST-REFRESH', null)
    })

    function ShippingDetails() {
        const [, setRefresh] = useState({})
        return (<Box >
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', rowGap: 2.2, justifyContent: 'space-around', p: 2 }}>
                {/* Name */}
                <TextField
                    autoComplete='off'
                    autoFocus={true}
                    error={!shipTo.name}
                    label='Name'
                    type='text'
                    variant='standard'
                    value={shipTo.name || ''}
                    onChange={(e: any) => handleTextChanged('name', e)}
                />
                {/* mobile */}
                <TextField
                    autoComplete='new-password'
                    label='Mobile'
                    type='tel'
                    variant='standard'
                    value={shipTo.mobile || ''}
                    onChange={(e: any) => handleTextChanged('mobile', e)}
                />
                {/* email */}
                <TextField
                    autoComplete='new-password'
                    label='Email'
                    variant='standard'
                    value={shipTo.email || ''}
                    onChange={(e: any) => handleTextChanged('email', e)}
                />
                {/* address1 */}
                <TextField
                    autoComplete='new-password'
                    error={!shipTo.address1}
                    label='Address1'
                    variant='standard'
                    value={shipTo.address1 || ''}
                    onChange={(e: any) => handleTextChanged('address1', e)}
                />
                {/* address2 */}
                <TextField
                    autoComplete='new-password'
                    label='Address2'
                    variant='standard'
                    value={shipTo.address2 || ''}
                    onChange={(e: any) => handleTextChanged('address2', e)}
                />
                {/* country */}
                <TextField
                    autoComplete='new-password'
                    error={!shipTo.country}
                    label='Country'
                    variant='standard'
                    value={shipTo.country || ''}
                    onChange={(e: any) => handleTextChanged('country', e)}
                />
                {/* State */}
                <TextField
                    autoComplete='new-password'
                    error={!shipTo.state}
                    label='State'
                    variant='standard'
                    value={shipTo.state || ''}
                    onChange={(e: any) => handleTextChanged('state', e)}
                />
                {/* city */}
                <TextField
                    autoComplete='new-password'
                    error={!shipTo.city}
                    label='City'
                    variant='standard'
                    value={shipTo.city || ''}
                    onChange={(e: any) => handleTextChanged('city', e)}
                />
                {/* pin */}
                <TextField
                    autoComplete='new-password'
                    error={!shipTo.pin}
                    label='Pin'
                    variant='standard'
                    value={shipTo.pin || ''}
                    onChange={(e: any) => handleTextChanged('pin', e)}
                />
                {/* other info */}
                <TextField
                    autoComplete='new-password'
                    label='Other info'
                    variant='standard'
                    value={shipTo.otherInfo || ''}
                    onChange={(e: any) => handleTextChanged('otherInfo', e)}
                />
            </Box>
            <Box sx={{ display: 'flex', }}>
                <Button sx={{ ml: 'auto', }} color='warning' variant='contained' size='small' onClick={handleClear} >Clear</Button>
                <Button color='secondary' variant='contained' size='small' sx={{ ml: 2, mr: 5 }} onClick={handleOk} >Ok</Button>
            </Box>
        </Box>)

        function handleClear() {
            Object.keys(sales.shipTo).forEach((key: any) => delete sales.shipTo[key])
            setRefresh({})
        }

        function handleOk() {
            megaData.executeMethodForKey('closeDialog:shipTo')
        }

        function handleTextChanged(propName: string, e: any) {
            shipTo[propName] = e.target.value
            setRefresh({})
        }
    }

    function checkAllErrors() {
        if (_.isEmpty(shipTo)) {
            allErrors.shipToError = undefined
        } else {
            const ok = shipTo.name && shipTo.address1 && shipTo.country && shipTo.state && shipTo.city && shipTo.pin
            allErrors.shipToError = ok ? undefined : errorMessages.shipToError
        }
    }

    function closeDialog() {
        pre.showDialog = false
        setRefresh({})
    }

    function getShipToAsString() {
        return (Object.values(shipTo).filter((x: any) => x).join(', ').replace(/^,/, ''))
    }

    function handleClear() {
        Object.keys(sales.shipTo).forEach((key: any) => delete sales.shipTo[key])
        setRefresh({})
    }

    function handleNewClicked() {
        pre.showDialog = true
        pre.dialogConfig.content = ShippingDetails
        setRefresh({})
    }



    return ({ allErrors, checkAllErrors, getShipToAsString, handleClear, handleNewClicked, meta })
}

export { useShipTo }