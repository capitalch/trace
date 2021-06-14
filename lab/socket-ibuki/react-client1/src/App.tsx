import React, { useEffect, useRef } from 'react'
import _ from 'lodash'
import { initSocket } from './utils/socket'
import './App.scss'

function App() {
    const meta: any = useRef({
        socket: undefined,
    })
    useEffect(() => {
        meta.current.socket = initSocket()
    }, [])

    return (
        <div className="title">
            <div>React client 1</div>
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
                <button onClick={handleClickSendToNodeClient1}>
                    Send to node-client1
                </button>
            </div>
        </div>
    )

    function handleClickSendToNodeClient1() {
        meta.current.socket.sendToPoint({ rubbish: 'ABCDEFG' }, 'node-client1')
    }
}

export default App
