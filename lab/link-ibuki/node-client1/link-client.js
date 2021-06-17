const io = require('socket.io-client')
const { Subject } = require('rxjs')

function usingLinkClient() {
    let zLink

    function getLink(url, pointId = undefined, token = undefined) {
        const subject = new Subject()
        if (!url) return null
        if (zLink) {
            return zLink
        }
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
            subject.next(zLink)
        })
        zLink.on('error', (message) => {
            console.log(message)
        })
        return subject
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
        getLink,
        ibukiEmit,
        ibukiFilterOn,
        joinRoom,
        onReceiveData,
        onReceiveDataFromPoint,
        sendToPoint,
        sendToRoom,
    }
}

module.exports = { usingLinkClient }
