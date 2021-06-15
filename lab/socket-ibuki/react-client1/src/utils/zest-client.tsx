import io from 'socket.io-client'
import { Subject } from 'rxjs'

function usingZestClient() {
    let zLink: any

    function initLink(
        url: string,
        pointId: any = undefined,
        token: any = undefined
    ) {
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
        zLink.on('error', (message: string) => {
            console.log(message)
        })
    }

    function ibukiEmit(message: any, data: any) {
        zLink.emit('cs-link-emit', message, data)
    }

    function ibukiFilterOn(message: string) {
        zLink.emit('cs-link-filter-on', message)
        const subject = new Subject()
        zLink.on(message, (data: any) => {
            subject.next(data)
        })
        return subject
    }

    function joinRoom(room: string) {
        zLink.emit('cs-join-room', room)
    }

    function onReceiveData() {
        const subject = new Subject()
        zLink.on('sc-send', (message: string, data: any) => {
            subject.next({ message, data })
        })
        return subject
    }

    function onReceiveDataFromPoint() {
        const subject = new Subject()
        zLink.on(
            'sc-send-to-point',
            (message: string, data: any, sourcePointId: string) => {
                subject.next({ message, data, sourcePointId })
            }
        )
        return subject
    }

    function sendToPoint(message: string, data: any, point: string) {
        zLink.emit('cs-send-to-point', message, data, point)
    }

    function sendToRoom(message: string, data: any, room: string) {
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

export { usingZestClient }
