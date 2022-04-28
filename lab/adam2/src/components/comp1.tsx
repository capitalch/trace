import { Box, Typography } from '@mui/material'
import { Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'

function Comp1() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        data: ''
    })
    const pre = meta.current

    useEffect(() => {
        // loadData()
    }, [])

    return (
        <Suspense fallback='Loading'>
            <Box>
                <Comp11 />
            </Box>
        </Suspense>
    )

    async function loadData() {
        const ret = await axios.get('https://gorest.co.in/public/v2/users')
        pre.data = ret.data[0].email
        setRefresh({})
    }

    function Comp11() {
        const ret: any = axios.get('https://gorest.co.in/public/v2/users').then((data: any) => data).catch((e: any) => { throw e })
        return (
            <Typography>{ret?.data[0]?.email || ''}</Typography>
        )
    }
}
export { Comp1 }

{/* <Typography>{pre.data}</Typography> */ }