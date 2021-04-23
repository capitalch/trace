import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'

function useTestHook(){
    
    const [,setRefresh] = useState({})
    
    useLayoutEffect(() => {
        console.log('layout effect test hook')
    })

    useEffect(() => {
        console.log('use effect test hook')
    })

    console.log('body test hook')

    function func1InHook(){
        console.log('func1 in hook executed')
        setRefresh({})
    }

    return {func1InHook}
}

export {useTestHook}