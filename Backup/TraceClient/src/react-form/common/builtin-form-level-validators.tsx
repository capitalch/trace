const builtinFormLevelValidators: any = {
    passwordsShouldBeSame: (a: any, formData: any, putErrors: any) => {
        // let ret: any = messages['passwordsShouldBeSame']
        let ret:any = 'Error'
        const newPwd = formData.newPwd
        const repeatNewPwd = formData.repeatNewPwd
        if (newPwd === repeatNewPwd) {
            ret = undefined
        }
        putErrors(a.name, ret)
    }
}
export default builtinFormLevelValidators