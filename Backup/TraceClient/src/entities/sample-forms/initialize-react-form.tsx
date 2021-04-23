import customMethods from './artifacts/custom-methods'
import customControls from './artifacts/custom-controls'
import graphqlQueries from './artifacts/graphql-queries-mutations'
import formLevelValidators from './artifacts/form-level-validators'
import itemLevelValidators from './artifacts/item-level-validators'
import setLevelValidators from './artifacts/set-level-validators'
import check1 from './json-form-templates/check1.json'
import tabs1 from './json-form-templates/tabs-sample1.json'
import clubMembership from './json-form-templates/club-membership.json'
import companyProfile from './json-form-templates/company-profile.json'
import deepNestingSample from './json-form-templates/deep-nesting-sample.json'
import electronicsRental from './json-form-templates/electronics-rental.json'
import employeeInfo from './json-form-templates/employee-info.json'
import employeePerformance from './json-form-templates/employee-performance.json'
import eventFeedback from './json-form-templates/event-feedback.json'
import gymRegistration from './json-form-templates/gym-registration.json'
import loanApplication from './json-form-templates/loan-application.json'
import softwareEvaluation from './json-form-templates/software-evaluation.json'
import studentAdmission from './json-form-templates/student-admission.json'
import hrms from './json-form-templates/hrms.json'
// import {customControls} from '../../shared-artifacts/custom-controls'
// import sharedCustomMethods from '../../shared-artifacts/custom-methods'
// import sharedFormLevelValidators from '../../shared-artifacts/form-level-validators'
// import sharedItemLevelValidators from '../../shared-artifacts/item-level-validators'
// import sharedSetLevelValidators from '../../shared-artifacts/set-level-validators'
// import sharedGraphqlQueries from '../../shared-artifacts/graphql-queries-mutations'
import { initialize } from '../../react-form/common/react-form-hook'
import { manageEntitiesState } from '../../common-utils/esm'
import { useIbuki } from '../../common-utils/ibuki'
const { getCurrentEntity } = manageEntitiesState()
initialize({
    entityName: getCurrentEntity()
    , allFormTemplates: {
        tabs1: JSON.stringify(tabs1),
        check1: JSON.stringify(check1),
        clubMembership: JSON.stringify(clubMembership),
        companyProfile: JSON.stringify(companyProfile),
        deepNestingSample: JSON.stringify(deepNestingSample),
        electronicsRental: JSON.stringify(electronicsRental),
        employeeInfo: JSON.stringify(employeeInfo),
        employeePerformance: JSON.stringify(employeePerformance),
        eventFeedback: JSON.stringify(eventFeedback),
        gymRegistration: JSON.stringify(gymRegistration),
        loanApplication: JSON.stringify(loanApplication),
        softwareEvaluation: JSON.stringify(softwareEvaluation),
        studentAdmission: JSON.stringify(studentAdmission),
        hrms: JSON.stringify(hrms)
    }
    , useIbuki: useIbuki
    , sharedArtifacts: {
        // customControls: sharedCustomControls,
        // customMethods: sharedCustomMethods,
        // formLevelValidators: sharedFormLevelValidators,
        // itemLevelValidators: sharedItemLevelValidators,
        // setLevelValidators: sharedSetLevelValidators,
        // graphqlQueries: sharedGraphqlQueries
    }
    , customControls: customControls
    , customForms: {} // you can add your custom created complete forms here. They will be available in artifacts.allForms
    , customMethods: customMethods
    , formLevelValidators: formLevelValidators
    , itemLevelValidators: itemLevelValidators
    , setLevelValidators: setLevelValidators
    , graphqlQueries: graphqlQueries
    , stylesheetFileName: 'sample-forms.scss' //This file must be present in root folder of the entity
})
