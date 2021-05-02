import React, { useState, useRef, useEffect } from 'react'
const isElectron = require('is-electron')
const odbc = window.require('odbc')

function useInventoryExport(){
    const meta: any = useRef({
        sourceDb: '',
        destinationDb: ''
    })

    console.log(isElectron())

    function handleExport(){
        odbcConnect()

        async function odbcConnect() {
            const connString = `DSN=${meta.current.sourceDb}`
            try {
              const conn = await odbc.connect(connString)
              console.log('Successfully connected')
              const data = await conn.query('select * from product')
              console.log(data)
            } catch (e) {
              console.log(e)
            }
          }
    }

    return {handleExport, meta}
}

export {useInventoryExport}