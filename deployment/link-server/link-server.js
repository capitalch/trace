const socket = require('socket.io')
const bcrypt = require('bcrypt')
const { filter } = require('rxjs/operators')
const { Subject, BehaviorSubject } = require('rxjs')
const _ = require('lodash')
const config = require('./config.json')
const messages = require('./messages.json')
const subject = new Subject()
const behSubject = new BehaviorSubject(0)
let allLinksMap = new Map() // property is system generated link id
let allLinksObject = {} // property is pointId provided by client or id of the link

function startLinkServer (io) {
    const { emit, filterOn } = useIbuki()

    io.use((link, next) => {
        const handshake = link.handshake
        let { token } = handshake.headers
        token = token || handshake?.query?.token
        if (config.auth) {
            if (token) {
                bcrypt.compare(config.authKey, token, (err, value) => {
                    if (value) {
                        next()
                    } else {
                        console.log(messages['errInvalidToken'])
                    }
                })
            } else {
                console.log(messages['errInvalidToken'])
            }
        } else {
            next()
        }
    })

    io.on('connection', function (link) {
        allLinksMap = io.sockets.sockets

        let pointId = link?.handshake?.query?.pointId
        pointId = pointId === 'undefined' ? undefined : pointId

        pointId = pointId || link?.handshake?.headers?.pointid || link.id // use link id as pointId if no pointId is provided
        link.pointId = pointId
        allLinksObject[pointId] = link

        console.log(
            'link connected, id=',
            pointId,
            `,allConnections:(${allLinksMap.size})`,
            `[${String(Object.keys(allLinksObject))}]`
        )
        link.on('disconnect', () => {
            link.disconnect()
            delete allLinksObject[link.pointId]
            console.log(
                'link disconnected, id=',
                pointId,
                `,allConnections:(${allLinksMap.size})`,
                `[${String(Object.keys(allLinksObject))}]`
            )
        })

        link.on('cs-join-room', message => {
            link.join(message)
        })

        link.on('cs-link-emit', (message, data) => {
            console.log('Emit:', 'Message:', message, 'Data:', data)
            emit(message, data)
        })

        link.on('cs-link-filter-on', message => {
            console.log('FilterOn:', 'Message:', message)
            const subs1 = filterOn(message).subscribe(d => {
                link.emit(message, d)
            })
        })

        link.on('cs-send-to-point', (message, data, pointId) => {
            const pointlink = allLinksObject[pointId]
            if (pointlink) {
                pointlink.emit('sc-send', message, data, link.pointId)
            } else {
                link.emit('error', messages.errDestPointDisconnected)
            }
        })

        link.on('cs-send-to-room', (message, data, room) => {
            link.to(room).emit('sc-send', message, data)
        })
    })
}

function useIbuki () {
    const emit = (id, options) => {
        subject.next({ id: id, data: options })
    }
    const filterOn = id => {
        return subject.pipe(filter(d => d.id === id))
    }
    const hotEmit = (id, options) => {
        behSubject.next({ id: id, data: options })
    }
    const hotFilterOn = id => {
        return behSubject.pipe(filter(d => d.id === id))
    }
    return { emit, filterOn, hotEmit, hotFilterOn }
}

function isValidToken (token) {}

module.exports = { useIbuki, startLinkServer }
