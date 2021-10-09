import { useState, useEffect, useRef } from '../../../../imports/regular-imports'
import { makeStyles, Theme, createStyles } from '../../../../imports/gui-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import countries from '../../../../data/countries.json'
import states from '../../../../data/states.json'
import cities from '../../../../data/cities.json'

function useNewEditContact(arbitraryData: any) {
    const [, setRefresh] = useState({})
    const billTo = arbitraryData.billTo
    const classes = useStyles(arbitraryData.billTo)
    useEffect(() => {
        meta.current.isMounted = true
        setDefaultValues()
        setRefresh({})
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const {
        Button,
        emit,
        genericUpdateMasterNoForm,
        InputMask,
        isImproperDate,
        isInvalidEmail,
        isInvalidGstin,
        isInvalidIndiaMobile,
        isInvalidIndiaPin,
        isInvalidStateCode,
        ReactSelect,
        TextField,
    } = useSharedElements()

    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        dialogConfig: {
            title: '',
            content: () => {},
            actions: () => {},
        },
    })

    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.5rem',
        }),
    }

    function getCountries() {
        return countries.map((x) => {
            return {
                value: x.id,
                label: x.name,
            }
        })
    }

    function getStates() {
        return states
            .filter(
                (x: any) =>
                    parseInt(x.country_id) ===
                    arbitraryData?.billTo?.country?.value //101 countryId for India
            )
            .map((x: any) => {
                return {
                    label: x.name,
                    value: parseInt(x.id),
                    stateCode: x.stateCode,
                }
            })
    }

    function getCities() {
        return cities
            .filter(
                (x: any) =>
                    parseInt(x.state_id) ===
                    (arbitraryData?.billTo?.state?.value || 41)
            )
            .map((x: any) => {
                return {
                    label: x.name,
                    value: parseInt(x.id),
                }
            })
    }

    function handleCityChange(e: any) {
        billTo.city = { value: e.value, label: e.label }
        meta.current.isMounted && setRefresh({})
    }

    function handleCountryChange(e: any) {
        billTo.country = { value: e.value, label: e.label }
        billTo.state = { value: null, label: null }
        billTo.city = { value: null, label: null }
        meta.current.isMounted && setRefresh({})
    }

    function handleStateChange(e: any) {
        billTo.state = { value: e.value, label: e.label }
        billTo.city = { value: null, label: null }
        billTo.state.stateCode = e.stateCode
        meta.current.isMounted && setRefresh({})
    }

    async function handleSubmit() {
        const obj: any = {
            tableName: 'Contacts',
            data: [],
        }
        const item = {
            id: billTo.id,
            contactName: billTo.contactName,
            mobileNumber: billTo.mobileNumber,
            otherMobileNumber: billTo.otherMobileNumber,
            landPhone: billTo.landPhone,
            email: billTo.email,
            descr: billTo.descr,
            anniversaryDate: billTo.anniversaryDate,
            address1: billTo.address1,
            address2: billTo.address2,
            country: billTo.country.label,
            state: billTo.state.label,
            city: billTo.city.label,
            gstin: billTo.gstin,
            pin: billTo.pin,
            dateOfBirth: billTo.dateOfBirth,
            stateCode: billTo.stateCode,
        }
        obj.data.push(item)
        const ret = await genericUpdateMasterNoForm({
            data: item,
            tableName: 'Contacts',
        })
        billTo.id = ret
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
            !billTo.country.value ||
            !billTo.state.value ||
            !billTo.city.value ||
            !billTo.address1 ||
            isInvalidIndiaPin(billTo.pin) ||
            isInvalidStateCode(billTo.state.stateCode) ||
            isInvalidGstin(billTo.gstin) ||
            isImproperDate(billTo.dateOfBirth) ||
            isImproperDate(billTo.anniversaryDate)
        return !!ret
    }

    function setDefaultValues() {
        !billTo?.country?.value &&
            (arbitraryData.billTo.country = {
                label: 'India',
                value: 101,
            })

        !billTo?.state?.value &&
            (arbitraryData.billTo.state = {
                label: 'West Bengal',
                value: 41,
                stateCode: 19,
            })

        !billTo?.city?.value &&
            (arbitraryData.billTo.city = {
                label: 'Kolkata',
                value: 5583,
            })

        !billTo.dateOfBirth && (billTo.dateOfBirth = '1900-01-01')
        !billTo.anniversaryDate && (billTo.anniversaryDate = '1900-01-01')
    }

    function Form() {
        const [, setRefresh] = useState({})

        return (
            <div className={classes.content}>
                {/* Mobile number */}
                <InputMask
                    mask="(999) 999-9999"
                    alwaysShowMask={true}
                    onChange={(e) => {
                        const num = e.target.value.replace(/[^0-9]/g, '')
                        arbitraryData.billTo.mobileNumber = parseInt(num, 10)
                        setRefresh({})
                    }}
                    value={billTo.mobileNumber || ''}>
                    {() => (
                        <TextField
                            label="Mobile"
                            error={isInvalidIndiaMobile(
                                arbitraryData.billTo.mobileNumber
                            )}
                            autoFocus={true}
                            className="short-text-field"
                        />
                    )}
                </InputMask>

                {/* Contact name */}
                <TextField
                    label="Contact name"
                    className="text-field"
                    error={!arbitraryData.billTo.contactName}
                    value={arbitraryData.billTo.contactName || ''}
                    onChange={(e) => {
                        arbitraryData.billTo.contactName = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Other mobile number */}
                <TextField
                    label="Other mobile numbers"
                    className="text-field"
                    value={arbitraryData.billTo.otherMobileNumber || ''}
                    onChange={(e) => {
                        arbitraryData.billTo.otherMobileNumber = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Land phone  */}
                <TextField
                    label="Land phone"
                    className="text-field"
                    value={arbitraryData.billTo.landPhone || ''}
                    onChange={(e) => {
                        arbitraryData.billTo.landPhone = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Email */}
                <TextField
                    label="Email"
                    className="text-field"
                    error={isInvalidEmail(arbitraryData.billTo.email)}
                    value={arbitraryData.billTo.email || ''}
                    onChange={(e) => {
                        arbitraryData.billTo.email = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Address1 */}
                <TextField
                    label="Address1"
                    className="text-field"
                    error={!arbitraryData.billTo.address1}
                    value={arbitraryData.billTo.address1 || ''}
                    onChange={(e) => {
                        arbitraryData.billTo.address1 = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Address2 */}
                <TextField
                    label="Address2"
                    className="text-field"
                    value={arbitraryData.billTo.address2 || ''}
                    onChange={(e) => {
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
                    options={getCountries()}
                    styles={styles}
                    className="react-select-country"
                    value={arbitraryData.billTo.country || {}}></ReactSelect>

                {/* States */}
                <ReactSelect
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    onChange={handleStateChange}
                    placeholder="Select State"
                    options={getStates()}
                    styles={styles}
                    className="react-select-state"
                    value={arbitraryData.billTo.state || {}}></ReactSelect>

                {/* Cities */}
                <ReactSelect
                    menuPlacement="auto"
                    menuShouldScrollIntoView={true}
                    onChange={handleCityChange}
                    placeholder="Select State"
                    options={getCities()}
                    styles={styles}
                    className="react-select-city"
                    value={arbitraryData.billTo.city || {}}></ReactSelect>

                {/* Pin */}
                <InputMask
                    mask="999999"
                    alwaysShowMask={false}
                    onChange={(e) => {
                        arbitraryData.billTo.pin = parseInt(e.target.value)
                        setRefresh({})
                    }}
                    value={billTo.pin || ''}>
                    {() => (
                        <TextField
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
                    onChange={(e) => {
                        billTo.state.stateCode = parseInt(e.target.value)
                        setRefresh({})
                    }}
                    value={billTo.state?.stateCode || ''}>
                    {() => (
                        <TextField
                            label="State code"
                            error={isInvalidStateCode(billTo?.state?.stateCode)}
                            className="short-text-field"
                        />
                    )}
                </InputMask>

                {/* Gstin */}
                <TextField
                    label="Gstin"
                    className="text-field"
                    error={isInvalidGstin(arbitraryData.billTo.gstin)}
                    value={arbitraryData.billTo.gstin || ''}
                    onChange={(e) => {
                        arbitraryData.billTo.gstin = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Date of birth */}
                <TextField
                    label="Date of birth"
                    type="date"
                    error={isImproperDate(arbitraryData.billTo.dateOfBirth)}
                    className="text-field"
                    value={arbitraryData.billTo.dateOfBirth || '1900-01-01'}
                    onChange={(e) => {
                        arbitraryData.billTo.dateOfBirth = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Anniversary date */}
                <TextField
                    label="AnniversaryDate"
                    type="date"
                    error={isImproperDate(billTo.anniversaryDate)}
                    className="text-field"
                    value={billTo.anniversaryDate || '1900-01-01'}
                    onChange={(e) => {
                        billTo.anniversaryDate = e.target.value
                        setRefresh({})
                    }}
                />

                {/* Description */}
                <TextField
                    label="Description"
                    className="text-field"
                    value={arbitraryData.billTo.descr || ''}
                    onChange={(e) => {
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
                    const isError = !billTo?.country?.value
                    return isError ? '3px solid red' : ''
                },
            },
            '& .react-select-state': {
                width: '15rem',
                border: (billTo: any) => {
                    const isError = !billTo?.state?.value
                    return isError ? '3px solid red' : ''
                },
            },
            '& .react-select-city': {
                width: '15rem',
                border: (billTo: any) => {
                    const isError = !billTo?.city?.value
                    return isError ? '3px solid red' : ''
                },
            },
        },
    })
)

export { useStyles }
