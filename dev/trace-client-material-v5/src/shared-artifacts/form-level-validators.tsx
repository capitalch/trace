const formLevelValidators: any = {
    pwdConfirmPwd: (a: any, formData: any, putErrors: any) => {
        let ret = a.message || 'Pwd should be same as confirm Pwd';
        if (formData['pwd'] === formData['confirmPwd']) {
            ret = undefined;
        }
        putErrors(a.name, ret);
    },
    confirmPwdLength: (a: any, formData: any, putErrors: any) => {
        let ret = a.message || 'Confirm Pwd length > 3';
        if (formData['confirmPwd'] && formData['confirmPwd'].length > 3) {
            ret = undefined;
        }
        putErrors(a.name, ret);
    },
    sampleAsyncValidation1: (a: any, formData: any, putErrors: any) => {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                putErrors(a.name, a.message);
                resolve('success');
            }, 5000)
        })
        return promise;
    },
    sampleFormValidation1: (a: any, formData: any, putErrors: any) => {
        let ret:any = 'sampleFormValidation1 failed'
        if(formData['gymFirstName'] === formData['gymLastName'] ){
            ret = undefined
        }
        putErrors(a.name, ret)
    }
}


export {formLevelValidators}