import messages from '../messages.json'
import queries from './graphql-queries-mutations'
import { graphqlService } from '../../../common-utils/graphql-service'
import {utilMethods} from '../../../common-utils/util-methods'
const formLevelValidators: any = {    
    passwordsShouldBeSame: (a: any, formData: any, putErrors: any) => {
        let ret: any = messages['passwordsShouldBeSame']
        const newPwd = formData.newPwd
        const repeatNewPwd = formData.repeatNewPwd
        if (newPwd === repeatNewPwd) {
            ret = undefined
        }
        putErrors(a.name, ret)
    }

    , userEmailExists: async (a: any, formData: any, putErrors: any) => {
        const {execGenericView}  = utilMethods()
        let ret: any = messages['userEmailExists']
        const data = { userEmail: formData['userEmail'] }
        const result:any = await execGenericView({
            isMultipleRows : false
            , args:data
            , sqlKey: 'doesExist_userEmail'
        })
        const doesExist = result?.doesExist
        if (!doesExist) {
            ret = undefined
        }
        putErrors(a.name, ret)
    }

    , buCodeExists: async (a: any, formData: any, putErrors: any) => {
        const {execGenericView}  = utilMethods()
        let ret: any = a.message // messages[buCodeExists]
        const result: any = await execGenericView({
            isMultipleRows: false
            , sqlKey: 'doesExist_bu'
            , args:{
                buCode: formData['buCode']
                , entityId: formData['entityId']
            }
        })
        const doesExist = result?.doesExist
        if (doesExist === false) {
            ret = undefined
        }
        putErrors(a.name, ret)
    }

    , userAlreadyAllocated: async (a: any, formData: any, putErrors: any) => {
        let ret: any = a.message // messages[buCodeExists]
        const { queryGraphql } = graphqlService()
        const value = {
            sqlKey: 'doesExist_user_allocation_to_entity'
            , isMultipleRows: false
            , args: {
                entityId: formData['entityId']
                , userId: formData['userId']
            }
        }
        const finalValue = escape(JSON.stringify(value))
        const q = queries['genericView'](finalValue)
        if (q) {
            const result = await queryGraphql(q)
            const doesExist: boolean = result.data.authentication.genericView.doesExist
            if (!doesExist) {
                ret = undefined
            }
        }
        putErrors(a.name, ret)
    }


}

export default formLevelValidators