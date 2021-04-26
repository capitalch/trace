function utilMethods() {
    
    function toDecimalFormat(s: any) {
        s ?? (s = '')
        if (s === '') {
            return s
        }
        if (typeof s !== 'string') {
            s = String(s)
        }
        let ret: string = s
        const v = Number(s)
        if (!isNaN(v)) {
            ret = v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        }
        return ret
    }

    function isValidMobile(mobile: any) {
        let ret = false
        mobile = String(mobile || '')
        if (mobile) {
            ret =
                (mobile.length === 10 && !isNaN(mobile))
        }
        return ret
    }

    return {isValidMobile, toDecimalFormat }
}

export { utilMethods }
