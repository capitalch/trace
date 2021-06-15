const io = require('socket.io-client')
const { Subject } = require('rxjs')

function usingZestClient() {
    let zLink

    function initLink(url, pointId = undefined, token = undefined) {
        if (!url) return null
        zLink = io(url, {
            query: {
                pointId: pointId,
                token: token,
            },
            autoConnect: true,
            reconnection: true,
            transports: ['websocket'],
        })
        zLink.on('connect', () => {
            console.log('Connected')
        })
        zLink.on('error', (message) => {
            console.log(message)
        })
    }

    function ibukiEmit(message, data) {
        zLink.emit('cs-link-emit', message, data)
    }

    function ibukiFilterOn(message) {
        zLink.emit('cs-link-filter-on', message)
        const subject = new Subject()
        zLink.on(message, (data) => {
            subject.next(data)
        })
        return subject
    }

    function joinRoom(room) {
        zLink.emit('cs-join-room', room)
    }

    function onReceiveData() {
        const subject = new Subject()
        zLink.on('sc-send', (message, data) => {
            subject.next({ message, data })
        })
        return subject
    }

    function onReceiveDataFromPoint() {
        const subject = new Subject()
        zLink.on('sc-send-to-point', (message, data, sourcePointId) => {
            subject.next({ message, data, sourcePointId })
        })
        return subject
    }

    function sendToPoint(message, data, point) {
        zLink.emit('cs-send-to-point', message, data, point)
    }

    function sendToRoom(message, data, room) {
        zLink.emit('cs-send-to-room', message, data, room)
    }

    return {
        initLink,
        ibukiEmit,
        ibukiFilterOn,
        joinRoom,
        onReceiveData,
        onReceiveDataFromPoint,
        sendToPoint,
        sendToRoom,
    }
}

module.exports = { usingZestClient }
