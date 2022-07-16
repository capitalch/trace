import { Box, Button, Typography } from '@mui/material'
import { Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'

function Comp1() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        data: '',
    })
    const pre = meta.current

    useEffect(() => {
        // loadData()
    }, [])

    const keysWithMethods: any = {} // {prop:String, value:any}
    const registerKeyWithMethod = function (key: string, method: Function) {
        keysWithMethods[key] = method
    }

    const executeMethodForKey: any = function executeMethodForKey(
        key: string,
        ...params: any
    ) {
        keysWithMethods[key](...params)
    }

    return (
        <Box>
            <Box>
                <Button onClick={register}>Register</Button>
                <Button
                    onClick={() => {
                        executeMethodForKey('key1', 'abcd',false)
                    }}>
                    Execute
                </Button>
            </Box>
        </Box>
    )

    function register() {
        registerKeyWithMethod('key1', func1)
    }

    function func1(arg1: string, arg2: boolean=true) {
        console.log(arg1, ' ', arg2)
    }
}
export { Comp1 }

{
    /* <Typography>{pre.data}</Typography> */
}
