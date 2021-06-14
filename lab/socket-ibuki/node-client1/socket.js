const io = require('socket.io-client')
const { fromEvent, lastValueFrom } = require('rxjs')

let socket

function initSocket(
    socUrl = 'http://localhost:5000',
    pointId = '',
    token = ''
) {
    const url = socUrl || 'http://localhost:5000'
    const pId = pointId || newRandomId()
    socket = io(url, {
        query: {
            pointId: pId,
            token: token,
        },
        autoConnect: true,
        reconnection: true,
        transports: ['websocket'],
    })

    function newRandomId() {
        return (
            Math.random().toString(36).substring(2, 5) +
            '-' +
            Math.random().toString(36).substring(2, 5)
        ).toUpperCase()
    }

    socket.ibukiEmit = (message, data) => {
        socket.emit('cs-socket-emit', message, data)
    }

    socket.ibukiFilterOn = (message, f) => {
        socket.emit('cs-socket-filter-on', message)
        socket.on(message, (data) => {
            f(data)
        })
    }

    socket.joinRoom = (room) => {
        socket.join(room)
    }

    socket.on('connect', () => {
        console.log('Connected')
    })

    // socket.onAny((message, data) => {
    //     console.log('message:', message, 'data:', data)
    // })

    socket.onReceiveFromPoint = (f) => {
        socket.on('sc-send-to-point', (message, data, sourcePointId) => {
            f(message, data, sourcePointId)
        })
    }

    socket.sendToRoom = (message, data, room) => {
        socket.emit('cs-send-to-room', message, data, room)
    }

    socket.onReceiveInRoom = (f) => {
        socket.on('sc-send-to-room', (message, data) => {
            f(message, data)
        })
    }

    // socket.onReceiveFromPointWithReturn = (returnData, f) => {
    //     socket.on('sc-send-to-point-with-return', (data, sourcePoint) => {
    //         f(data)
    //         socket.emit('cs-send-to-point', returnData, sourcePoint)
    //     })
    // }

    // socket.on('sc-send-to-point', (data) => {
    //     console.log(data)
    // })

    socket.on('error', (message) => {
        console.log(message)
    })

    return socket
}

// function socketFilterOn(message, f) {
//     socket.emit('cs-socket-filter-on', message)
//     socket.on(message, (data) => {
//         f(data)
//     })
// }

module.exports = { initSocket } //, socketEmit, socketFilterOn }

// function socketEmit(message, data) {
//     socket.emit('cs-socket-emit', message, data)
// }

// function socketFilterOn(message) {
//     socket.emit('cs-socket-filter-on', message)
//     let subscribe = function(m){
//         // console.log(m)
//     }
//     socket.on(message, (data)=>{
//         subscribe(data)
//     })
//     return({subscribe})
// }

// const socket = io('http://localhost:5000', {
//     query: {
//         a: 'a',
//         b: 'b',
//     },
//     autoConnect: true,
//     reconnection: true,
//     transports: ['websocket'],
// })
