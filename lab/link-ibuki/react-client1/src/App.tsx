import React, { useEffect, useRef } from 'react'
import _ from 'lodash'
import { usingLinkClient } from './utils/link-client'
import './App.scss'

function App() {
    const {
        connectToLinkServer,
        getPointId,
        ibukiEmit,
        ibukiFilterOn,
        joinRoom,
        onReceiveData,
        onReceiveDataFromPoint,
        sendToPoint,
        sendToRoom,
    } = usingLinkClient()

    const meta: any = useRef({
        link: undefined,
    })

    useEffect(() => {
        connectToLinkServer('http://localhost:5001')?.subscribe((d:any)=>{
            if(d && d.connected){
                
            } else {

            }
        })
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
                <button
                    onClick={() => {
                        console.log('pointId:', getPointId())
                    }}>
                    Get point id
                </button>
            </div>
        </div>
    )

    function handleClickSendToNodeClient1() {
        sendToPoint('a-message', { rubbish: 'ABCDEFG' }, 'node-client1')
    }
}

export default App
