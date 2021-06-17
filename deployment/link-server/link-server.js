const socket = require('socket.io')
const { filter } = require('rxjs/operators')
const { Subject, BehaviorSubject } = require('rxjs')
const _ = require('lodash')
const messages = require('./messages.json')
const subject = new Subject()
const behSubject = new BehaviorSubject(0)
let allLinksMap = new Map() // property is system generated link id
let allLinksObject = {} // property is pointId provided by client or id of the link

function startLinkServer(io) {
    const { emit, filterOn } = useIbuki()
    io.on('connection', function (link) {
        allLinksMap = io.sockets.sockets

        let pointId = link?.handshake?.query?.pointId
        pointId = (pointId === 'undefined') ? undefined : pointId

        pointId = pointId || link?.handshake?.headers?.pointid || link.id // use link id as pointId if no pointId is provided
        link.pointId = pointId
        allLinksObject[pointId] = link

        // allLinksObject = _.omitBy(allLinksObject, _.isUndefined) // To remove the undefined values
        console.log(
            'link connected,',
            'Map length:',
            allLinksMap.size,
            ',allLinksObject:',
            allLinksObject
        )
        link.on('disconnect', () => {
            delete allLinksObject[link.pointId]
            // io.sockets.sockets.delete(link.id)
            console.log(
                'link disconnected,',
                'Map length:',
                allLinksMap.size,
                ',allLinksObject:',
                allLinksObject
            )
        })

        link.on('cs-join-room', (message) => {
            link.join(message)
        })

        link.on('cs-link-emit', (message, data) => {
            console.log('Emit:', 'Message:', message, 'Data:', data)
            emit(message, data)
        })

        link.on('cs-link-filter-on', (message) => {
            console.log('FilterOn:', 'Message:', message)
            const subs1 = filterOn(message).subscribe((d) => {
                link.emit(message, d)
            })
        })

        link.on('cs-send-to-point', (message, data, pointId) => {
            const pointlink = allLinksObject[pointId]
            if (pointlink) {
                pointlink.emit(
                    'sc-send',
                    message,
                    data,
                    link.pointId
                )
            } else {
                link.emit('error', messages.errDestPointDisconnected)
            }
        })

        link.on('cs-send-to-room', (message, data, room) => {
            link.to(room).emit('sc-send', message, data)
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

module.exports = { useIbuki, startLinkServer }
