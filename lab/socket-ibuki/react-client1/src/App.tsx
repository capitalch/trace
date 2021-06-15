import React, { useEffect, useRef } from 'react'
import _ from 'lodash'
// import { initSocket } from './utils/socket'
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

    const meta: any = useRef({
        link: undefined,
    })

    useEffect(() => {
        initLink('http://localhost:5000')
    }, [])

    return (
        <div className="title">
            <div>React client 1</div>
            <div className="header">
                <button
                    onClick={(e) => {
                        ibukiEmit('REACT-APP1-MESSAGE', {
                            source: 'react-app1',
                            dest: 'Based on subscription',
                            arbitraryData: 'Hi Ibuki testing',
                        })
                    }}>
                    REACT-APP1-MESSAGE
                </button>
                <button
                    onClick={() => {
                        sendToRoom(
                            'REACT-CLIENT1-SEND-TO-ROOM1',
                            {
                                a: 'Sending data to room1',
                                junkData: 'hhh hjhj9090',
                            },
                            'room1'
                        )
                    }}>
                    Send to room1
                </button>
                <button onClick={handleClickSendToNodeClient1}>
                    Send to node-client1
                </button>
                <button
                    onClick={() => {
                        sendToPoint(
                            'POINT-TO-POINT-MESSAGE',
                            { foo: 'XYZ' },
                            'pythonClient1'
                        )
                    }}>
                    Send to pythonClient1
                </button>
            </div>
        </div>
    )

    function handleClickSendToNodeClient1() {
        sendToPoint(
            'a-message',
            { rubbish: 'ABCDEFG' },
            'node-client1'
        )
    }
}

export default App
