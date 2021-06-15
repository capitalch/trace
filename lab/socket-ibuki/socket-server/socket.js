const { filter } = require('rxjs/operators')
const { Subject, BehaviorSubject } = require('rxjs')
const _ = require('lodash')
const messages = require('./messages.json')
const subject = new Subject()
const behSubject = new BehaviorSubject(0)
let allSocketsMap = new Map() // property is system generated socket id
let allSocketsObject = {} // property is pointId provided by client or id of the socket

function useSocket(io) {
    const { emit, filterOn } = useIbuki()
    io.on('connection', function (socket) {
        allSocketsMap = io.sockets.sockets

        let pointId = socket?.handshake?.query?.pointId
        pointId = (pointId === 'undefined') ? undefined : pointId

        pointId = pointId || socket?.handshake?.headers?.pointid || socket.id // use socket id as pointId if no pointId is provided
        socket.pointId = pointId
        allSocketsObject[pointId] = socket

        allSocketsObject = _.omitBy(allSocketsObject, _.isUndefined) // To remove the undefined values
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

        socket.on('cs-join-room', (message) => {
            socket.join(message)
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

        socket.on('cs-send-to-point', (message, data, pointId) => {
            const pointSocket = allSocketsObject[pointId]
            if (pointSocket) {
                pointSocket.emit(
                    'sc-send-to-point',
                    message,
                    data,
                    socket.pointId
                )
            } else {
                socket.emit('error', messages.errDestPointDisconnected)
            }
        })

        socket.on('cs-send-to-room', (message, data, room) => {
            socket.to(room).emit('sc-send', message, data)
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
