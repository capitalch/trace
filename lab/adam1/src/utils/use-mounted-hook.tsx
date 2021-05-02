import React, { useState } from 'react'

const mount: any = {}

function useMounted(key: string) {
    mount[key] || (mount[key] = {})

    function setMounted() {
        mount[key].isMounted = true
    }

    function resetMounted() {
        mount[key].isMounted = false
    }

    function isMounted() {
        return mount[key].isMounted
    }

    return { setMounted, resetMounted, isMounted }
}

export { useMounted }