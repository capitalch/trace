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

    return { toDecimalFormat }
}

export { utilMethods }
