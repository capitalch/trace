import io from 'socket.io-client'

let socket: any

function initSocket(
    socUrl: string = 'http://localhost:5000',
    pointId: string = '',
    token: string = ''
) {
    const url = socUrl
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

    socket.ibukiEmit = (message: string, data: any) => {
        socket.emit('cs-socket-emit', message, data)
    }

    socket.ibukiFilterOn = (message: string, f: any) => {
        socket.emit('cs-socket-filter-on', message)
        socket.on(message, (data: any) => {
            f(data)
        })
    }

    socket.sendToPoint = (message: string, data: any, point: string) => {
        socket.emit('cs-send-to-point', message, data, point)
    }

    socket.sendToRoom = (message: string, data: any, room: string) => {
        socket.emit('cs-send-to-room', message, data, room)
    }

    socket.joinRoom = (room: string) => {
        socket.join(room)
    }

    socket.on('connect', () => {
        console.log('Connected')
    })

    socket.on('error', (message: string) => {
        console.log(message)
    })

    return socket
}

export { initSocket }

// const socket = io('http://localhost:5000', {
//     query: {
//         a: 'a',
//         b: 'b',
//     },
//     autoConnect: true,
//     reconnection: true,
//     transports: ['websocket'],
// })

// socket.on('connect', () => {
//     console.log('socket connected')
// })

// function socketEmit(message: string, data: any) {
//     socket.emit('cs-socket-emit', message, data)
// }
