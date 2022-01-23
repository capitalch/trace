import {
    InputMask,
    moment,
    useState,
    useEffect,
} from '../../../imports/regular-imports'

import {
    manageEntitiesState,
    manageFormsState,
} from '../../../imports/trace-imports'

import { useGeneric } from '../../../react-form/core/generic-item'

const customControls = {
    DateMask: (props: any) => {
        const { getFromBag } = manageEntitiesState()
        const { getValidationFabric, setField, setDateValidatorFormat } =
            manageFormsState()
        const { doValidateControl } = getValidationFabric()

        const { parent, item } = props
        const { xValue, XLabel, XErrorDisplay, formId, controlId } =
            useGeneric(props)
        const [, setRefresh] = useState({})

        const isoDateFormat = 'YYYY-MM-DD'
        const dateFormat: any = getFromBag('dateFormat') || isoDateFormat
        // In DateMask during validation of the date it is considered as in dateFormat. If date is sent from Datepicker it is in isoFormat
        setDateValidatorFormat(formId, controlId, dateFormat)
        useEffect(() => {
            const val = moment().format(dateFormat)
            parent[item.name] || (parent[item.name] = val)
        }, [dateFormat, item.name, parent])
        const maskMap: any = {
            'DD/MM/YYYY': '99/99/9999',
            'MM/DD/YYYY': '99/99/9999',
            'YYYY-MM-DD': '9999-99-99',
        }

        return (
            <>
                <div>
                    <XLabel></XLabel>
                </div>
                <InputMask
                    style={{ width: 200 }}
                    mask={maskMap[dateFormat]}
                    value={xValue || ''}
                    onFocus={(e: any) => {
                        e.target.select()
                    }}
                    onChange={async (e: any) => {
                        setField(parent, item.name, e.target.value)
                        await doValidateControl(formId, controlId)
                        setRefresh({})
                    }}
                    onBlur={async (e: any) => {
                        await doValidateControl(formId, controlId)
                        setRefresh({})
                    }}
                />
                <XErrorDisplay></XErrorDisplay>
            </>
        )
    },
}

export default customControls

