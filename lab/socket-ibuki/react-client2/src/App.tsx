import React, { useEffect, useRef } from 'react'
import logo from './logo.svg'
import { initSocket } from './utils/socket'

import './App.scss'

function App() {
    const meta: any = useRef({
        socket: undefined,
    })

    useEffect(() => {
        meta.current.socket = initSocket()
        // meta.current.socket.ibukiFilterOn('REACT-APP-MESSAGE1', (data:any) => {
        //     console.log(data)
        // })
    }, [])

    return (
        <div className="title">
            <div>React client 2</div>
            <div className="header">
                <button
                    onClick={(e) => {
                        meta.current.socket.ibukiEmit('REACT-APP-MESSAGE1', {
                            source: 'react-app',
                            dest: 'node-client2',
                            arbitraryData: 'hjhhhhhhj',
                        })
                    }}>
                    Send message1
                </button>
            </div>
        </div>
    )
}

export default App
