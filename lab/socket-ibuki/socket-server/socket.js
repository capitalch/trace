const { filter } = require('rxjs/operators')
const { Subject, BehaviorSubject } = require('rxjs')
const _ = require('lodash')
const messages = require('./messages.json')
const subject = new Subject()
const behSubject = new BehaviorSubject(0)
let allSocketsMap = new Map() // property is system generated socket id
let allSocketsObject = {} // property is pointId provided by client

function useSocket(io) {
    const { emit, filterOn } = useIbuki()
    io.on('connection', function (socket) {
        allSocketsMap = io.sockets.sockets

        const pointId = socket?.handshake?.query?.pointId
        if (pointId) {
            socket.pointId = pointId
            allSocketsObject[pointId] = socket
        }
        allSocketsObject = _.omitBy(allSocketsObject, _.isUndefined)
        console.log(
            'Socket connected,',
            'Map length:',
            allSocketsMap.size,
            ',allSocketsObject:',
            allSocketsObject
        )
        socket.on('disconnect', () => {
            allSocketsObject[socket.pointId] = undefined
            console.log(
                'Socket disconnected,',
                'Map length:',
                allSocketsMap.size,
                ',allSocketsObject:',
                allSocketsObject
            )
        })

        socket.on('cs-socket-emit', (message, data) => {
            console.log('Emit:', 'Message:', message, 'Data:', data)
            emit(message, data)
        })

        socket.on('cs-socket-filter-on', (message) => {
            console.log('FilterOn:', 'Message:', message)
            const subs1 = filterOn(message).subscribe((d) => {
                socket.emit(message, d)
            })
        })

        socket.on('cs-send-to-point', (message, data, point) => {
            const pointSocket = allSocketsObject[point]
            if (pointSocket) {
                pointSocket.emit('sc-send-to-point', message, data, socket.pointId)
            } else {
                socket.emit('error', messages.errDestPointDisconnected)
            }
        })

        socket.on('cs-send-to-room', (message, data, room) => {
            socket.to(room).emit('sc-send-to-room', message, data)
        })
    })
}

function useIbuki() {
    const emit = (id, options) => {
        subject.next({ id: id, data: options })
    }
    const filterOn = (id) => {
        return subject.pipe(filter((d) => d.id === id))
    }
    const hotEmit = (id, options) => {
        behSubject.next({ id: id, data: options })
    }
    const hotFilterOn = (id) => {
        return behSubject.pipe(filter((d) => d.id === id))
    }
    return { emit, filterOn, hotEmit, hotFilterOn }
}

module.exports = { useIbuki, useSocket }

// socket.on('test-message1', (data) => {
//     console.log(data)
// })

// socket.onAny((message, data, point) => {
//     if (point) {
//         const pointSocket = allSocketsObject[point]
//         if (pointSocket) {
//             pointSocket.send(message, data)
//         }
//     }
// })

// socket.on('cs-send-to-point-with-return',(data, point)=>{
//     const pointSocket = allSocketsObject[point]
//     if(pointSocket){
//         pointSocket.emit('sc-send-to-point-with-return', data, socket.pointId)
//     } else {
//         socket.emit('error',messages.errDestPointDisconnected)
//     }
// })
