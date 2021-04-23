import React from 'react'
import check1 from '../json-form-templates/check1.json'
import clubMembership from '../json-form-templates/club-membership.json'
import companyProfile from '../json-form-templates/company-profile.json'
import deepNestingSample from '../json-form-templates/deep-nesting-sample.json'
import electronicsRental from '../json-form-templates/electronics-rental.json'
import employeeInfo from '../json-form-templates/employee-info.json'
import employeePerformance from '../json-form-templates/employee-performance.json'
import eventFeedback from '../json-form-templates/event-feedback.json'
import gymRegistration from '../json-form-templates/gym-registration.json'
import loanApplication from '../json-form-templates/loan-application.json'
import softwareEvaluation from '../json-form-templates/software-evaluation.json'
import studentAdmission from '../json-form-templates/student-admission.json'
import ReactForm from '../../../react-form/react-form'
import getNextId from '../../../react-form/core/form-id-generator'
import '../sample-forms.scss'
import config from '../config.json'
import { componentStore } from '../../../react-form/component-store/html-component-store'


const sampleFormsComponents: any = {
    check1: check1,
    clubMembership: clubMembership,
    companyProfile: companyProfile,
    deepNestingSample: deepNestingSample,
    electronicsRental: electronicsRental,
    employeeInfo: employeeInfo,
    employeePerformance: employeePerformance,
    eventFeedback: eventFeedback,
    gymRegistration: gymRegistration,
    loanApplication: loanApplication,
    softwareEvaluation: softwareEvaluation,
    studentAdmission: studentAdmission
}

const allFormObjects: any = {} //eventually it contains all form components after processing

function processFormsComponents() {
    Object.keys(sampleFormsComponents).forEach((key) => {
        const props: any = {}
        props.componentStore = componentStore
        props.formId = getNextId()

        props.jsonText = JSON.stringify(sampleFormsComponents[key])
        props.name = config.name // name is entityName
        allFormObjects[key] = () => <ReactForm>{props}</ReactForm>
    })
}
processFormsComponents()

export default allFormObjects