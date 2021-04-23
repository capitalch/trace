const builtinValidators: any = {
    required: (a: any, value: any, putErrors: any) => {
        let ret: any = a.message || 'The value is required';
        value && ((String(value).length > 0) || (value === true)) && (ret = undefined);
        putErrors(a.name, ret);
    },

    minLength: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0].toString()));
        const len = a.args[0];
        let ret: any = message || a.message || 'Minimum length required is'.concat(' ', len.toString());
        ((!value) || (value.length >= len)) && (ret = undefined);
        putErrors(a.name, ret);
    },

    maxLength:(a: any, value: string, putErrors: any)=>{
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0].toString()));
        const len = a.args[0]
        let ret: any = message || a.message || 'Maximum length can be'.concat(' ', len.toString());
        ((!value) || (value.length <= len)) && (ret = undefined)
        putErrors(a.name, ret)
    },

    shouldNotContainSpecificChar: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Should not have '.concat(a.args[0], ' in the value');
        (!(value && value.includes(a.args[0]))) && (ret = undefined);
        putErrors(a.name, ret);
    },

    noWhiteSpaceOrSpecialChar: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'White space or special characters are not allowed';
        // (!(value && !/^(\d|\w)+$/.test(value))) && (ret = undefined);
        const isValid: boolean = /^(\d|\w)+$/.test(value);
        isValid && (ret = undefined)
        putErrors(a.name, ret);
    },

    noSpecialChar: (a: any, value: string, putErrors: any) =>{
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Special characters are not allowed';
        const isValid: boolean = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/.test(value);
        isValid && (ret = undefined)
        putErrors(a.name, ret);
    },

    //password: numeric, Upper case, lower case, special char, 8 in length
    alphanumericWithSpecialChars: (a: any, value: string, putErrors: any)=>{
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Must have alphanumeric with at least one special character'
        const isValid: boolean = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*\-_]).{8,}$/.test(value)
        isValid && (ret = undefined)
        putErrors(a.name, ret);
    },

    numbersOnly: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Please only enter numeric characters';
        const isValid: boolean = /^\d*(?:\.\d\d)?$/.test(value);
        // (!(value && /^[A-Za-z0-9 ]+$/.test(value))) && (ret = undefined);
        isValid && (ret = undefined)
        putErrors(a.name, ret);
    },

    yearOnly: (a: any, value: string, putErrors: any) =>{
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Only valid years are allowed'
        const numValue = +value
        if(!isNaN(numValue))
        {
            if((numValue >= 1900)  && (numValue <= 4000)){
                ret = undefined
            }
        }
        putErrors(a.name, ret)
    },

    charOnly: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Numeric characters not allowed';
        (!(value && !(!/^[0-9]+$/.test(value)))) && (ret = undefined);
        putErrors(a.name, ret);
    },

    password: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Password must be more than 8 character. Should contain atleast one upper case, one lower case, one digit and one special character';
        (!(value && !(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(value)))) && (ret = undefined);
        putErrors(a.name, ret);
    },

    phoneNumber: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Invalid Phone No';
        (!(value && !(/^\d{10}$/.test(value)))) && (ret = undefined);
        putErrors(a.name, ret);
    },

    emailOrNoWhiteSpaceOrSpecialChar: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Invalid mail or user id'
        const isValidMail = /^.+@[^\.].*\.[a-z]{2,}$/.test(value)
        const isValidNoWhiteSpaceOrSpecialChar = /^(\d|\w)+$/.test(value)
        if (isValidMail || isValidNoWhiteSpaceOrSpecialChar) {
            ret = undefined
        }
        putErrors(a.name, ret)
    },

    email: (a: any, value: string, putErrors: any) => {
        const message = (a.args) && (Array.isArray(a.args)) && (a.args.length > 0) && a.message && (a.message.replace('$args', a.args[0]))
        let ret: any = message || a.message || 'Invalid email';
        (!(value && !(/^.+@[^\.].*\.[a-z]{2,}$/.test(value)))) && (ret = undefined);
        putErrors(a.name, ret);
    }

    // Provide all built-in sync / async validators here
}
export { builtinValidators };