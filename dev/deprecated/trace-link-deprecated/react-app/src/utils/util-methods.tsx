import isElectron from 'is-electron'
import messages from '../messages.json'
function utilMethods() {

    function getConfig() {
        let config: any
        try {
            if (isElectron()) {
                const path = window.require('path')
                const fs = window.require('fs')
                const dirName = window.__dirname
                let configFilePath = path.join(dirName, '..', '..', 'config.json')
                if (!fs.existsSync(configFilePath)) {
                    configFilePath = path.join(
                        dirName,
                        '..',
                        '..',
                        '..',
                        'config.json'
                    )
                    if (!fs.existsSync(configFilePath)) {
                        alert(messages.errNoConfig)
                        throw new Error(messages.errNoConfig)
                    }
                }
                const temp = fs.readFileSync(configFilePath, { encoding: 'utf8' })
                config = JSON.parse(temp)
            } else {
                const win: any = window
                config = win.config // from config.js in public folder
            }
            // console.log('config.json file extracted:', JSON.stringify(config))
            return(config)
        } catch (e) {
            console.log(e.message)
        }
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

    return {getConfig, isValidMobile, toDecimalFormat }
}

export { utilMethods }
