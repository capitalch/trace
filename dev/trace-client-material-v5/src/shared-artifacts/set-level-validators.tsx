const setLevelValidators: any = {
    confirmPwdLength: (a: any, dataObject: any, putErrors: any) => {
        let ret = a.message || 'Confirm Pwd length > 3';
        if (dataObject['confirmPwd'] && dataObject['confirmPwd'].length > 3) {
            ret = undefined;
        }
        putErrors(a.name, ret);
    },
    pwdConfirmPwd: (a: any, dataObject: any, putErrors: any) => {
        let ret = a.message || 'Pwd should be same as confirm Pwd';
        if (dataObject['pwd'] === dataObject['confirmPwd']) {
            ret = undefined;
        }
        putErrors(a.name, ret);
    },
    sampleValidation: (a: any, dataObject: any, putErrors: any) => {
        let ret = a.message || 'This is a sample set level validation';
        if (dataObject['stuStreet'] && dataObject['stuStreet'].includes('x')) {
            ret = undefined;
        }
        putErrors(a.name, ret);
    },
    sampleAsyncValidation1: (a: any, dataObject: any, putErrors: any) => {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                putErrors(a.name, a.message);
                resolve('success');
            }, 5000)
        })
        return promise;
    }
}

export {setLevelValidators}