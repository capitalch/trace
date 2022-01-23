const itemLevelValidators: any = {
    shouldHaveOneSpecialChar: (a: any, value: string, putErrors: any) => {
        let ret: any = a.message || 'Should have one special char';
        const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        ((value.length === 0) || format.test(value)) && (ret = undefined)
        putErrors(a.name, ret);
    },
    sampleAsyncValidation1: (a: any, value: string, putErrors: any, callbacks: any) => {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                putErrors(a.name, a.message);
                resolve('success');
            }, 5000)
        })
        return promise;
    },
    sampleAsyncValidation2: (a: any, value: string, putErrors: any, callbacks: any) => {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                putErrors(a.name, a.message);
                resolve('success');
            }, 7000)
        })
        return promise;
    }
    // Put your custom async / sync item validators here

}

export { itemLevelValidators }