import { _, accountsMessages, Box, Button, cities, countries, IMegaData, InputMask, MegaDataContext, ReactSelect, states, TextField, useConfirm, useContext, useEffect, useState, utils, utilMethods } from '../redirect'

function NewEditCustomer({ parentMeta }: any) {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales
    const billTo = sales.billTo
    const pre = parentMeta.current
    const confirm = useConfirm()
    const { execGenericView, } = utilMethods()
    const { isImproperDate, isInvalidEmail, isInvalidGstin, isInvalidIndiaMobile, isInvalidIndiaPin, isInvalidStateCode } = utils()
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.5rem',
        }),
    }

    useEffect(() => {
        setOptions()
        setRefresh({})
    }, [])

    return (
        <Box sx={{ display: 'flex', rowGap: 4, flexDirection: 'column', '& .horiz': { display: 'flex', flexWrap: 'wrap', columnGap: 4 }, '& .select-country': { flex: 1, border: getCountryStateCityBorder(billTo?.selectedCountryOption?.label) }, '& .select-state': { flex: 1, border: getCountryStateCityBorder(billTo?.selectedStateOption?.label) }, '& .select-city': { flex: 0.53, border: getCountryStateCityBorder(billTo?.selectedCityOption?.label) } }}>
            <Box className='horiz'>
                {/* Mobile number */}
                <InputMask
                    mask="99-999-99999"
                    alwaysShowMask={true}
                    onChange={(e: any) => {
                        const num = e.target.value.replace(/[^0-9]/g, '')
                        billTo.mobileNumber = parseInt(num, 10)
                        billTo.isMobileNumberChanged = true
                        setRefresh({})
                    }}
                    onBlur={handleOnBlurMobileNumber}
                    value={billTo.mobileNumber || ''}>
                    {() => (
                        <TextField
                            autoFocus={true}
                            sx={{ flex: 1 }}
                            autoComplete='off'
                            label="Mobile"
                            variant="standard"
                            error={isInvalidIndiaMobile(
                                billTo.mobileNumber
                            )}
                        />
                    )}
                </InputMask>
                {/* Other mobile number */}
                <TextField
                    autoComplete='off'
                    sx={{ flex: 1 }}
                    label="Other mobile numbers"
                    variant="standard"
                    value={billTo.otherMobileNumber || ''}
                    onChange={(e: any) => handleTextChanged('otherMobileNumber', e)}
                />
            </Box>
            <Box className='horiz'>
                {/* Contact name */}
                <TextField
                    sx={{ flex: 1 }}
                    autoComplete='off'
                    label="Contact name"
                    variant="standard"
                    error={!billTo.contactName}
                    value={billTo.contactName || ''}
                    onChange={(e: any) => handleTextChanged('contactName', e)}
                />
                {/* Land phone  */}
                <TextField
                    sx={{ flex: 1 }}
                    autoComplete='off'
                    label="Land phone"
                    variant="standard"
                    value={billTo.landPhone || ''}
                    onChange={(e: any) => handleTextChanged('landPhone', e)}
                />
            </Box>
            <Box className='horiz'>
                {/* Email */}
                <TextField
                    autoComplete='off'
                    sx={{ flex: 1 }}
                    label="Email"
                    variant="standard"
                    error={isInvalidEmail(billTo.email)}
                    value={billTo.email || ''}
                    onChange={(e: any) => handleTextChanged('email', e)}
                />
                {/* Gstin */}
                <TextField
                    autoComplete='off'
                    sx={{ flex: 1 }}
                    label="Gstin"
                    variant="standard"
                    className="text-field"
                    error={isInvalidGstin(billTo.gstin)}
                    value={billTo.gstin || ''}
                    onChange={(e: any) => handleTextChanged('gstin', e)}
                />
            </Box>
            <Box className='horiz'>
                {/* Address1 */}
                <TextField
                    autoComplete='off'
                    sx={{ flex: 1 }}
                    label="Address1"
                    variant="standard"
                    className="text-field"
                    error={!billTo.address1}
                    value={billTo.address1 || ''}
                    onChange={(e: any) => handleTextChanged('address1', e)}
                />
                {/* Address2 */}
                <TextField
                    autoComplete='off'
                    sx={{ flex: 1 }}
                    label="Address2"
                    variant="standard"
                    className="text-field"
                    value={billTo.address2 || ''}
                    onChange={(e: any) => handleTextChanged('address2', e)}
                />
            </Box>
            <Box className='horiz'>
                {/* Countries */}
                <ReactSelect
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    maxMenuHeight={150}
                    onChange={handleCountryChange}
                    placeholder="Select country"
                    options={billTo.countryOptions}
                    styles={styles}
                    className="select-country"
                    value={billTo.selectedCountryOption}></ReactSelect>
                {/* States */}
                <ReactSelect
                    maxMenuHeight={150}
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    onChange={handleStateChange}
                    placeholder="Select state"
                    options={billTo.stateOptions}
                    styles={styles}
                    className="select-state"
                    value={billTo.selectedStateOption}></ReactSelect>
            </Box>
            <Box className='horiz' sx={{ alignItems: 'center' }}>
                {/* Cities */}
                <ReactSelect
                    maxMenuHeight={150}
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    onChange={handleCityChange}
                    placeholder="Select city"
                    options={billTo.cityOptions}
                    styles={styles}
                    className="select-city"
                    value={billTo.selectedCityOption}></ReactSelect>
                {/* Pin */}
                <InputMask
                    mask="999999"
                    alwaysShowMask={false}
                    onChange={(e: any) => {
                        billTo.pin = parseInt(e.target.value)
                        setRefresh({})
                    }}
                    value={billTo.pin || ''}>
                    {() => (
                        <TextField
                            autoComplete='off'
                            variant="standard"
                            label="Pin"
                            sx={{ flex: 0.2 }}
                            error={isInvalidIndiaPin(billTo.pin)}
                        />
                    )}
                </InputMask>
                {/* State code */}
                <InputMask
                    mask="99"
                    alwaysShowMask={true}
                    onChange={(e: any) => {
                        billTo.stateCode = parseInt(e.target.value)
                        setRefresh({})
                    }}
                    value={billTo.stateCode || ''}>
                    {() => (
                        <TextField
                            sx={{ flex: 0.2 }}
                            autoComplete='off'
                            label="State code"
                            variant="standard"
                            error={isInvalidStateCode(billTo?.stateCode)} />
                    )}
                </InputMask>
            </Box>
            <Box className='horiz'>
                {/* Date of birth */}
                <TextField
                    label="Date of birth"
                    variant="standard"
                    type="date"
                    error={isImproperDate(billTo.dateOfBirth)}
                    value={billTo.dateOfBirth || ''}
                    onChange={(e: any) => handleTextChanged('dateOfBirth', e)}
                />
                {/* Anniversary date */}
                <TextField
                    label="AnniversaryDate"
                    variant="standard"
                    type="date"
                    error={isImproperDate(billTo.anniversaryDate)}
                    value={billTo.anniversaryDate || ''}
                    onChange={(e: any) => handleTextChanged('anniversaryDate', e)}
                />
                {/* Description */}
                <TextField
                    autoComplete='off'
                    label="Description"
                    variant="standard"
                    className="text-field"
                    value={billTo.descr || ''}
                    onChange={(e: any) => handleTextChanged('descr', e)}
                />
            </Box>
            {/* Submit */}
            <Button
                color="secondary"
                className="submit"
                disabled={isSubmitDisabled()}
                // disabled={((x1 = isSubmitDisabled()), x1)}
                variant="contained"
                onClick={handleSubmit}>
                Submit
            </Button>

        </Box >)

    function getCountryStateCityBorder(option: any) {
        return (option ? '' : '3px solid red')
    }

    function handleCityChange(e: any) {
        billTo.selectedCityOption = { value: e.value, label: e.label }
        setRefresh({})
    }

    function handleCloseDialog() {
        pre.showDialog = false
        pre.setRefresh({})
    }

    function handleCountryChange(e: any) {
        billTo.selectedCountryOption = { value: e.value, label: e.label }
        billTo.selectedStateOption = { label: null, value: null, stateCode: 0 }
        billTo.selectedCityOption = { label: null, value: null, stateCode: 0 }
        setStateOptions()
        setRefresh({})
    }

    function handleStateChange(e: any) {
        billTo.selectedStateOption = {
            value: e.value,
            label: e.label,
            stateCode: e.stateCode,
        }
        setCityOptions()
        billTo.selectedCityOption = { label: null, value: null, stateCode: 0 }
        billTo.stateCode = e.stateCode
        setRefresh({})
    }

    async function handleOnBlurMobileNumber(e: any) {
        const mobileNumber = e.target.value.replace(/[^0-9]/g, '')
        if ((!isInvalidIndiaMobile(mobileNumber)) && (billTo.isMobileNumberChanged)) {
            await setContactFromMobile()
        }

        async function setContactFromMobile() {
            const ret = await execGenericView({
                isMultipleRows: false,
                sqlKey: 'get_contact_for_mobile',
                args: { mobileNumber: mobileNumber }
            })
            const options: any = {
                description: accountsMessages.contactExists,
                confirmationText: 'Yes',
                cancellationText: 'No',
                confirmationButtonProps: { autoFocus: true, variant: 'contained', color: 'secondary' },
                cancellationButtonProps: { variant: 'contained', color: 'secondary' },
                titleProps: { color: 'dodgerBlue' },
                title: "Notification !!!"
            }
            if (!_.isEmpty(ret)) {
                confirm(options).then(() => {
                    sales.billTo = ret
                    billTo.contactSelectedFlag = true
                    handleCloseDialog()
                }).catch(() => { })
            }
        }
    }

    async function handleSubmit() {
        const item = {
            id: billTo.id || null,
            contactName: billTo.contactName,
            mobileNumber: billTo.mobileNumber,
            otherMobileNumber: billTo.otherMobileNumber || null,
            landPhone: billTo.landPhone || null,
            email: billTo.email || null,
            descr: billTo.descr || null,
            anniversaryDate: billTo.anniversaryDate,
            address1: billTo.address1,
            address2: billTo.address2 || null,
            country: billTo.selectedCountryOption.label,
            state: billTo.selectedStateOption.label,
            city: billTo.selectedCityOption.label,
            gstin: billTo.gstin || null,
            pin: billTo.pin,
            dateOfBirth: billTo.dateOfBirth,
            stateCode: billTo.stateCode,
        }
        const ret = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'insert_or_update_contact',
            args: { ...item }
        })
        billTo.id = billTo.id || ret?.id || undefined // To take care when ret = false, or the save fails
        if (ret) {
            megaData.executeMethodForKey('handleCloseDialog:customer')
        }
    }

    function handleTextChanged(propName: string, e: any) {
        billTo[propName] = e.target.value
        setRefresh({})
    }

    function isSubmitDisabled() {
        const ret =
            isInvalidIndiaMobile(billTo.mobileNumber) ||
            !billTo.contactName ||
            isInvalidEmail(billTo.email) ||
            !billTo.address1 ||
            !billTo?.selectedCountryOption?.label ||
            !billTo?.selectedStateOption?.label ||
            !billTo?.selectedCityOption?.label ||
            isInvalidIndiaPin(billTo.pin) ||
            isInvalidStateCode(billTo.stateCode) ||
            isInvalidGstin(billTo.gstin) ||
            isImproperDate(billTo.dateOfBirth) ||
            isImproperDate(billTo.anniversaryDate)
        return !!ret
    }

    function setOptions() {
        billTo.country = billTo?.selectedCountryOption?.label || billTo.country || 'India'
        billTo.state = billTo.selectedStateOption?.label || billTo.state || 'West Bengal'
        billTo.city = billTo.selectedCityOption?.label || billTo.city || 'Kolkata'
        billTo.countryOptions = getCountries()
        billTo.selectedCountryOption = billTo.countryOptions.find(
            (x: any) => x.label === billTo.country
        )
        setStateOptions()

        billTo.selectedStateOption = billTo.stateOptions.find(
            (x: any) => x.label === billTo.state
        )
        billTo.stateCode = billTo.stateCode || billTo?.selectedStateOption?.stateCode
        setCityOptions()
        billTo.selectedCityOption = billTo.cityOptions.find((x: any) => x.label === billTo.city)

        !billTo.dateOfBirth && (billTo.dateOfBirth = '1900-01-01')
        !billTo.anniversaryDate && (billTo.anniversaryDate = '1900-01-01')

        function getCountries() {
            return countries.map((x) => {
                return {
                    value: x.id,
                    label: x.name,
                }
            })
        }
    }

    function setCityOptions() {
        billTo.cityOptions = cities
            .filter(
                (x: any) =>
                    parseInt(x.state_id) === billTo?.selectedStateOption?.value
            )
            .map((x: any) => ({
                label: x.name,
                value: parseInt(x.id),
            }))
    }

    function setStateOptions() {
        billTo.stateOptions = states
            .filter(
                (x: any) =>
                    parseInt(x.country_id) ===
                    billTo?.selectedCountryOption?.value
            )
            .map((x: any) => ({
                label: x.name,
                value: parseInt(x.id),
                stateCode: x.stateCode,
            }))
    }
}
export { NewEditCustomer }