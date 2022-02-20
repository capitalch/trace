import { useState } from 'react'
import { manageFormsState } from './fsm'
import { getArtifacts } from '../common/react-form-hook'

const useSubmit = (props: any) => {
    const { formId, item } = props

    const {
        clearServerError,
        doFormRefresh,
        getValidationFabric,
    } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    let [isBusy] = useState(false)

    async function submitOnClick(e: any) {
        clearServerError(formId)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            const methodName = item.methodName
            const customMethods = getArtifacts(props.name)['customMethods']
            if (methodName && customMethods[methodName]) {
                await customMethods[methodName](formId)
            }
        } else {
            //form refresh so that validation errors are visible
            doFormRefresh(formId)
        }
    }
    return { submitOnClick: submitOnClick, isBusy: isBusy }
}

export { useSubmit }
