import io from 'socket.io-client'

let socket: any

function initSocket(
    socUrl: string = 'http://localhost:5000',
    pointId: string = '',
    token: string = ''
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

    socket.ibukiEmit = (message: string, data: any) => {
        socket.emit('cs-socket-emit', message, data)
    }

    socket.ibukiFilterOn = (message: string, f: any) => {
        socket.emit('cs-socket-filter-on', message)
        socket.on(message, (data: any) => {
            f(data)
        })
    }

    socket.joinRoom = (room: string) => {
        socket.join(room)
    }

    socket.on('connect', () => {
        console.log('Connected')
    })

    return socket
}

export { initSocket }