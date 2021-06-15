import React, { useEffect, useRef } from 'react'
import { usingZestClient } from './utils/zest-client'

import './App.scss'

function App() {
    const {
        initLink,
        ibukiEmit,
        ibukiFilterOn,
        joinRoom,
        onReceiveData,
        onReceiveDataFromPoint,
        sendToPoint,
        sendToRoom,
    } = usingZestClient()

    useEffect(() => {
        initLink('http://localhost:5000')
        ibukiFilterOn('REACT-APP1-MESSAGE')
            .subscribe((d: any) => {
                console.log(d)
            })
        onReceiveData().subscribe((d: any) => {
            console.log(d)
        })
    }, [])

    return (
        <div className="title">
            <div>React client 3</div>
            <div className="header">
                <button
                    onClick={(e) => {
                        ibukiEmit('REACT-APP-MESSAGE1', {
                            source: 'react-app',
                            dest: 'node-client2',
                            arbitraryData: 'hjhhhhhhj',
                        })
                    }}>
                    Send message1
                </button>
                <button
                    onClick={() => {
                        joinRoom('room1')
                    }}>
                    Join room1
                </button>
            </div>
        </div>
    )
}

export default App
