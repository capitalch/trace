import React, { useState, useEffect } from "react"

const useGeneric = () => {
    function testModifier(value: string) {
        return value + 'X'
    }

    useEffect(()=>{
        console.log('Use effect of parent hook called')
        return(()=>{
            console.log('Return of parent hook"s useEffect method called')
        })
    },[])

    return { testModifier }
}

export { useGeneric }