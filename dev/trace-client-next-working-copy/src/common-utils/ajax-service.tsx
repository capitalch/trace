import {axios, moment, urlJoin } from '../imports/regular-imports'
import { manageEntitiesState} from '../imports/trace-imports'
import { config } from '../config'

function ajaxService() {
    
    const { getLoginData, getFromBag, getCurrentEntity } = manageEntitiesState()

    function getHeaders() {
        const loginData = getLoginData()
        let token: any = undefined
        loginData && (token = loginData.token)
        const buCode = getFromBag('buCode') || ''
        const finYearId = getFromBag('finYearObject')?.finYearId || ''

        const branchId = getFromBag('branchObject')?.branchId || ''
        const selectionCriteria = buCode.concat(':', finYearId, ':', branchId)
        const headers = {
            authorization: token ? `Bearer ${token}` : '',
            'SELECTION-CRITERIA': selectionCriteria,
        }
        return headers
    }

    function getUrl(endPoint: string) {
        let ur: any
        const env: any = process.env.NODE_ENV
        if (env === 'development') {
            ur = config['graphql'][env]
        } else {
            ur = window.location.href
        }
        const url = urlJoin(ur, endPoint)
        return url
    }

    async function httpGet(endPoint: string) {
        const url = getUrl(endPoint)
        const res = await axios({
            method: 'get',
            url: url,
            headers: getHeaders(),
            responseType: 'blob',
        })
        return res
    }

    async function httpPost(endPoint: string, data: any = null) {
        const url = getUrl(endPoint)
        const res = await axios({
            method: 'post',
            url: url,
            data: data,
            headers: getHeaders(),
            responseType: 'blob',
        })
        return res
    }

    async function downloadFile(item: any) {
        const response = await httpPost('downloadFile', item)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const branchCode = getFromBag('branchObject')?.branchCode || ''
        const buCode = getFromBag('buCode') || ''
        const finYearId = getFromBag('finYearObject')?.finYearId || ''
        const suffix = buCode.concat('-', branchCode, '-', finYearId)
        const itemName = item?.name || ''
        const ext = item?.fileFormat || 'json'
        const currentDateTime = moment().format('YYYY-MM-DD-HHmmSSS')
        const dateRange = item.startDate
            ? item.startDate.concat('-to-', item.endDate)
            : ''
        const fileName = itemName.concat(
            '-',
            dateRange,
            '-',
            getCurrentEntity(),
            '-',
            suffix,
            '-time-',
            currentDateTime,
            '.',
            ext
        )
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }
    return { httpGet, httpPost, downloadFile }
}

export { ajaxService }
