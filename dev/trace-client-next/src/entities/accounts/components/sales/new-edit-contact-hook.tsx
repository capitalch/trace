import {
    _,
    useState,
    useEffect,
    ReactSelect,
    useRef,
    InputMask,
} from '../../../../imports/regular-imports'
import {
    makeStyles,
    Button,
    Theme,
    createStyles,
    TextField,
} from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import countries from '../../../../data/countries.json'
import states from '../../../../data/states.json'
import cities from '../../../../data/cities.json'

function useNewEditContact(arbitraryData: any) {
    const [, setRefresh] = useState({})
    const billTo = arbitraryData.billTo
    const classes = useStyles(arbitraryData.billTo)

    useEffect(() => {
        const curr = meta.current
        curr.isMounted = true
        setOptions()
        setRefresh({})
        return () => {
            curr.isMounted = false
        }
    }, [])

    useEffect(() => {
        if (pre.mobileNumberTextRef?.current) {
            pre.mobileNumberTextRef.current.focus()
        }
    })

    const {
        accountsMessages,
        confirm,
        emit,
        execGenericView,
        genericUpdateMasterNoForm,
        isImproperDate,
        isInvalidEmail,
        isInvalidGstin,
        isInvalidIndiaMobile,
        isInvalidIndiaPin,
        isInvalidStateCode,
    } = useSharedElements()

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        mobileNumberTextRef: undefined,
        isMobileNumberChanged: false,
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
        },
    })
    const pre = meta.current
    pre.mobileNumberTextRef = useRef()

    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.5rem',
        }),
    }

    function handleCountryChange(e: any) {
        billTo.selectedCountryOption = { value: e.value, label: e.label }
        billTo.selectedStateOption = { label: null, value: null, stateCode: 0 }
        billTo.selectedCityOption = { label: null, value: null, stateCode: 0 }
        setStateOptions()
        meta.current.isMounted && setRefresh({})
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
        meta.current.isMounted && setRefresh({})
    }

    function handleCityChange(e: any) {
        billTo.selectedCityOption = { value: e.value, label: e.label }
        meta.current.isMounted && setRefresh({})
    }

    async function handleOnBlurMobileNumber(e: any) {
        const mobileNumber = e.target.value.replace(/[^0-9]/g, '')
        if ((!isInvalidIndiaMobile(mobileNumber)) && (pre.isMobileNumberChanged)) {
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
                    arbitraryData.billTo = ret
                    pre.contactSelectedFlag = true
                    emit('BILL-TO-CLOSE-DIALOG', null)
                }).catch(() => { })
            }
        }
    }

    async function handleSubmit() {
        const obj: any = {
            tableName: 'Contacts',
            data: [],
        }
        const item = {
            id: billTo.id || null, // null value for id is not allowed, undefined is allowed
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
        // obj.data.push(item)        
        // const ret = await genericUpdateMasterNoForm({
        //     data: item,
        //     tableName: 'Contacts',
        // })
        billTo.id = billTo.id || ret?.id || undefined // To take care when ret = false, or the save fails
        if (ret) {
            meta.current.showDialog = false
            meta.current.isMounted && setRefresh({})
            emit('BILL-TO-CLOSE-DIALOG', null) // Refresh parent
        }
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
            !billTo.address1 ||
            isInvalidIndiaPin(billTo.pin) ||
            isInvalidStateCode(billTo.stateCode) ||
            isInvalidGstin(billTo.gstin) ||
            isImproperDate(billTo.dateOfBirth) ||
            isImproperDate(billTo.anniversaryDate)
        return !!ret
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

    function Form() {
        const [, setRefresh] = useState({})
        return (
            <div className={classes.content}>
                {/* Mobile number */}
                <InputMask
                    mask="99-999-99999"
                    alwaysShowMask={true}
                    onChange={(e: any) => {
                        const num = e.target.value.replace(/[^0-9]/g, '')
                        arbitraryData.billTo.mobileNumber = parseInt(num, 10)
                        pre.isMobileNumberChanged = true
                        setRefresh({})
                    }}
                    onBlur={handleOnBlurMobileNumber}
                    value={billTo.mobileNumber || ''}>
                    {() => (
                        <TextField
                            autoComplete='off'
                            label="Mobile"
                            variant="standard"
                            inputRef={pre.mobileNumberTextRef}
                            error={isInvalidIndiaMobile(
                                arbitraryData.billTo.mobileNumber
                            )}
                            // autoFocus={true}
                            className="short-text-field"
                        />
                    )}
                </InputMask>

                {/* Contact name */}
                <TextField
                    autoComplete='off'
                    label="Contact name"
                    variant="standard"
                    className="text-field"
                    error={!arbitraryData.billTo.contactName}
                    value={arbitraryData.billTo.contactName || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.contactName = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Other mobile number */}
                <TextField
                    autoComplete='off'
                    label="Other mobile numbers"
                    variant="standard"
                    className="text-field"
                    value={arbitraryData.billTo.otherMobileNumber || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.otherMobileNumber = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Land phone  */}
                <TextField
                    autoComplete='off'
                    label="Land phone"
                    variant="standard"
                    className="text-field"
                    value={arbitraryData.billTo.landPhone || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.landPhone = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Email */}
                <TextField
                    autoComplete='off'
                    label="Email"
                    variant="standard"
                    className="text-field"
                    error={isInvalidEmail(arbitraryData.billTo.email)}
                    value={arbitraryData.billTo.email || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.email = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Address1 */}
                <TextField
                    autoComplete='off'
                    label="Address1"
                    variant="standard"
                    className="text-field"
                    error={!arbitraryData.billTo.address1}
                    value={arbitraryData.billTo.address1 || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.address1 = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Address2 */}
                <TextField
                    autoComplete='off'
                    label="Address2"
                    variant="standard"
                    className="text-field"
                    value={arbitraryData.billTo.address2 || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.address2 = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Countries */}
                <ReactSelect
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    onChange={handleCountryChange}
                    placeholder="Select country"
                    options={billTo.countryOptions}
                    styles={styles}
                    className="react-select-country"
                    value={billTo.selectedCountryOption}></ReactSelect>

                {/* States */}
                <ReactSelect
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    onChange={handleStateChange}
                    placeholder="Select State"
                    options={billTo.stateOptions}
                    styles={styles}
                    className="react-select-state"
                    value={billTo.selectedStateOption}></ReactSelect>

                {/* Cities */}
                <ReactSelect
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    onChange={handleCityChange}
                    placeholder="Select State"
                    options={billTo.cityOptions}
                    styles={styles}
                    className="react-select-city"
                    value={billTo.selectedCityOption}></ReactSelect>

                {/* Pin */}
                <InputMask
                    mask="999999"
                    alwaysShowMask={false}
                    onChange={(e: any) => {
                        arbitraryData.billTo.pin = parseInt(e.target.value)
                        setRefresh({})
                    }}
                    value={billTo.pin || ''}>
                    {() => (
                        <TextField
                            autoComplete='off'
                            variant="standard"
                            label="Pin"
                            error={isInvalidIndiaPin(arbitraryData.billTo.pin)}
                            className="short-text-field"
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
                            autoComplete='off'
                            label="State code"
                            variant="standard"
                            error={isInvalidStateCode(billTo?.stateCode)}
                            className="short-text-field"
                        />
                    )}
                </InputMask>

                {/* Gstin */}
                <TextField
                    autoComplete='off'
                    label="Gstin"
                    variant="standard"
                    className="text-field"
                    error={isInvalidGstin(arbitraryData.billTo.gstin)}
                    value={arbitraryData.billTo.gstin || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.gstin = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Date of birth */}
                <TextField
                    label="Date of birth"
                    variant="standard"
                    type="date"
                    error={isImproperDate(arbitraryData.billTo.dateOfBirth)}
                    className="text-field"
                    value={arbitraryData.billTo.dateOfBirth || '1900-01-01'}
                    onChange={(e: any) => {
                        arbitraryData.billTo.dateOfBirth = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Anniversary date */}
                <TextField
                    label="AnniversaryDate"
                    variant="standard"
                    type="date"
                    error={isImproperDate(billTo.anniversaryDate)}
                    className="text-field"
                    value={billTo.anniversaryDate || '1900-01-01'}
                    onChange={(e: any) => {
                        billTo.anniversaryDate = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Description */}
                <TextField
                    autoComplete='off'
                    label="Description"
                    variant="standard"
                    className="text-field"
                    value={arbitraryData.billTo.descr || ''}
                    onChange={(e: any) => {
                        arbitraryData.billTo.descr = e.target.value
                        setRefresh({})
                    }}
                />
                {/* Submit */}
                <Button
                    color="secondary"
                    className="submit"
                    disabled={((x1 = isSubmitDisabled()), x1)}
                    variant="contained"
                    onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        )
    }
    let x1
    return { Form, meta }
}

export { useNewEditContact }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            display: 'flex',
            columnGap: theme.spacing(3),
            rowGap: theme.spacing(2),
            alignItems: 'center',
            flexWrap: 'wrap',
            '& .text-field': {
                '& .MuiInputBase-root': {
                    width: '15rem',
                },
            },
            '& .short-text-field': {
                width: '15rem',
                '& .MuiInputBase-root': {
                    width: '8rem',
                },
            },
            '& .submit': {
                marginLeft: 'auto',
            },
            '& .react-select-country': {
                width: '15rem',
                border: (billTo: any) => {
                    const isError = !billTo?.selectedCountryOption?.label
                    return isError ? '3px solid red' : ''
                },
            },
            '& .react-select-state': {
                width: '15rem',
                border: (billTo: any) => {
                    const isError = !billTo?.selectedStateOption?.label
                    return isError ? '3px solid red' : ''
                },
            },
            '& .react-select-city': {
                width: '15rem',
                border: (billTo: any) => {
                    const isError = !billTo?.selectedCityOption?.label
                    return isError ? '3px solid red' : ''
                },
            },
        },
    })
)

export { useStyles }
