import io from 'socket.io-client'
import { BehaviorSubject, Subject } from 'rxjs'

let zLink: any
function useLinkClient() {
    const errNotConnected = 'Link server is not connected'
    function connectToLinkServer(
        url: string,
        pointId: any = undefined,
        token: any = undefined
    ) {
        const subject = new BehaviorSubject<any>(1)
        if (!url) return subject

        if (zLink && zLink.connected) {
            subject.next({ connected: zLink.connected })
            return subject
        }

        zLink = io(url, {
            query: {
                pointId: pointId,
                token: token,
            },
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 50,
            transports: ['websocket'],
        })
        zLink.on('connect', () => {
            console.log('Connected:', zLink.id)
            subject.next({ connected: zLink.connected })
        })
        zLink.on('error', (message: string) => {
            console.log(message)
            subject.next({ connected: false })
        })
        zLink.on('disconnect', () => {
            console.log('disconnected')
        })
        return subject
    }

    function disconnectFromLinkServer() {
        if (zLink.connected) {
            zLink.disconnect()
        }
    }

    function getPointId() {
        return zLink.id
    }

    function ibukiEmit(message: any, data: any) {
        if (zLink.connected) {
            zLink.emit('cs-link-emit', message, data)
        } else {
            throw new Error(errNotConnected)
        }
    }

    function ibukiFilterOn(message: string) {
        if (zLink.connected) {
            zLink.emit('cs-link-filter-on', message)
            const subject = new Subject()
            zLink.on(message, (data: any) => {
                subject.next(data)
            })
            return subject
        } else {
            throw new Error(errNotConnected)
        }
    }

    function joinRoom(room: string) {
        if (zLink.connected) {
            zLink.emit('cs-join-room', room)
        } else {
            throw new Error(errNotConnected)
        }
    }
    // function isLinkConnected() {
    //     return zLink.connected
    // }

    function onReceiveData() {
        const subject = new Subject()
        if (zLink.connected) {
            zLink.on('sc-send', (message: string, data: any) => {
                subject.next({ message, data })
            })
            return subject
        } else {
            throw new Error(errNotConnected)
        }
    }

    function onReceiveDataFromPoint() {
        const subject = new Subject()
        if (zLink.connected) {
            zLink.on(
                'sc-send',
                (message: string, data: any, sourcePointId: string) => {
                    subject.next({ message, data, sourcePointId })
                }
            )
            return subject
        } else {
            throw new Error(errNotConnected)
        }
    }

    function sendToPoint(message: string, data: any, point: string) {
        if (zLink.connected) {
            zLink.emit('cs-send-to-point', message, data, point)
        } else {
            throw new Error(errNotConnected)
        }
    }

    function sendToRoom(message: string, data: any, room: string) {
        if (zLink.connected) {
            zLink.emit('cs-send-to-room', message, data, room)
        } else {
            throw new Error(errNotConnected)
        }
    }

    return {
        connectToLinkServer,
        disconnectFromLinkServer,
        getPointId,
        ibukiEmit,
        ibukiFilterOn,
        joinRoom,
        onReceiveData,
        onReceiveDataFromPoint,
        sendToPoint,
        sendToRoom,
    }
}

export { useLinkClient }