import React, { useState, useEffect, useRef } from 'react'
// import bcrypt from 'bcryptjs'
import gql from 'graphql-tag'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useIbuki } from '../common-utils/ibuki'
import { StyledLoginLinkButton } from './trace-styled-components'
// import { getArtifacts } from '../react-form/common/react-form-hook'
import ReactForm from '../react-form/react-form'
import { componentStore } from '../react-form/component-store/html-core'
import { initialize } from '../react-form/common/react-form-hook'
import { manageFormsState } from '../react-form/core/fsm'
import { manageEntitiesState } from '../common-utils/esm'
import { graphqlService } from '../common-utils/graphql-service'
import messages from '../messages.json'

function TraceLoginDialog() {
    const [, setRefresh] = useState({})
    const { resetForm, clearServerError, getValidationFabric
        , getFormData, showServerError, doFormRefresh, releaseForm } = manageFormsState()
    const { doValidateForm, isValidForm } = getValidationFabric()
    const { setLoginData } = manageEntitiesState()
    const { emit } = useIbuki()
    const meta: any = useRef({
        isMounted: true
        , showDialog: false
        , formId: 'login' //fixed form id  
    })
    const { queryGraphql } = graphqlService()
    const { filterOn } = useIbuki()
    useEffect(() => {
        meta.current.isMounted = true
        initReactForm()
        const subs1 = filterOn('LOGIN-CLICKED').subscribe(d => {
            meta.current.showDialog = true
            meta.current.isMounted && setRefresh({})
        })
        return (() => {
            meta.current.isMounted = false
            subs1.unsubscribe()
        })
    }, [])

    function closeDialog() {
        meta.current.showDialog = false
        meta.current.isMounted && setRefresh({})
    }

    async function submitLogin() {
        const q: any = (credentials: any) => gql`query login {
            authentication {
             login(credentials:"${credentials}")
               }
           }`
        clearServerError(meta.current.formId)
        await doValidateForm(meta.current.formId)
        if (isValidForm(meta.current.formId)) {
            let data: any = getFormData(meta.current.formId)
            data = JSON.parse(JSON.stringify(data))
            const base64UidPwd = window.btoa(data.uidOrEmail.concat(':', data.password))

            const query = q(base64UidPwd)
            const result: any = await queryGraphql(query)
            const login: any = result.data.authentication.login
            const token: string = login && login.token ? login.token : undefined
            const uid: string = login.uid
            const isSuperAdmin: boolean = login && login.isSuperAdmin ? login.isSuperAdmin : false
            // isSuperAdmin ? emit('ACTIVATE-SUPERADMIN', true) : emit('ACTIVATE-SUPERADMIN', false)
            setLoginData({
                token: token
                , isSuperAdmin: isSuperAdmin
                , uid: uid
            })
            if (token) {
                emit('LOGIN-SUCCESSFUL', uid)
                meta.current.showDialog = false
                resetForm(meta.current.formId)
                releaseForm(meta.current.formId)
                setRefresh({})
            } else {
                // showServerError(meta.current.formId, messages['invalidUidOrPassword'])
            }

        } else {
            doFormRefresh(meta.current.formId) // necessary to show errors in the form
        }
    }

    function initReactForm() {
        initialize({
            entityName: 'traceLogin'
            , allFormTemplates: {}
            , useIbuki: useIbuki
        })
    }

    function Comp() {
        resetForm(meta.current.formId)
        return <ReactForm
            formId={meta.current.formId}
            jsonText={JSON.stringify(loginJson)}
            name="traceLogin"
            componentStore={componentStore}
        ></ReactForm>
    }

    return <Dialog
        visible={meta.current.showDialog}
        header={<span>Login / Create an account</span>}
        footer={
            <div>
                <div>
                    <Button icon='pi pi-check' label="Login" style={{ width: '100%' }}
                        onClick={e => { submitLogin() }}
                    >
                    </Button>
                </div>
                {/* <StyledLoginLinkButton>Create an account</StyledLoginLinkButton> */}
            </div>}
        modal={false}
        style={{ width: '16%', minWidth: '20rem' }}
        closable={true}
        focusOnShow={true}
        onHide={() => closeDialog()}>
        <Comp></Comp>
        {/* <StyledLoginLinkButton>Change uid</StyledLoginLinkButton>
        <StyledLoginLinkButton>Change password</StyledLoginLinkButton> */}
        <StyledLoginLinkButton>Forgot password</StyledLoginLinkButton>
    </Dialog>
}

export { TraceLoginDialog }

const loginJson: any = {
    "class": "generic-dialog"
    , "items": [
        {
            "type": "Text"
            , "name": "uidOrEmail"
            , "label": "User id or email"
            , "validations": [
                {
                    "name": "required",
                    "message": "User id or email is required"
                }
                // , {
                //     "name": "emailOrNoWhiteSpaceOrSpecialChar",
                //     "message": "Value should be either a valid email or a user id with no special characters or whitespace"
                // }
            ]
        }
        , {
            "type": "Password"
            , "name": "password"
            , "label": "Password"
            , "validations": [
                {
                    "name": "required",
                    "message": "Password is required"
                }
            ]
        }
    ]
}

/*
*/