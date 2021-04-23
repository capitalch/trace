import axios from 'axios';

const useAjax = () => {
    const httpGet = async (url: string) => {
        const res = await axios.get(url)
        return res //res.data has actual data
    }

    const httpPost = async (url: string, data: any) => {
        const res = await axios.post(url, data)
        return res //res.data has actual data
    }

    return { httpGet, httpPost }
}

export {useAjax}
