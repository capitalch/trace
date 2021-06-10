import io from 'socket.io-client'
import { usingIbuki } from './ibuki'
import { manageEntitiesState } from './esm'

const { emit } = usingIbuki()
let socket: any = undefined
function getUrl() {
    const win: any = window
    const config = win.config
    const env: any = process.env.NODE_ENV
    const graphql: any = config.graphql
    const url = graphql[env]
    return url
}



function getParts() {
    const { getFromBag, getLoginData } = manageEntitiesState()
    const socketUrl = getUrl()
    const socketId = Math.random().toString(36).substr(2, 12)
    //
    const buCode = getFromBag('buCode')
    const { finYearId } = getFromBag('finYearObject') || ''
    const { token } = getLoginData()
    const { branchId } = getFromBag('branchObject') || ''
    const roomPart = `${':'.concat(buCode, ':', finYearId, ':', branchId)}`
    return {
        roomPart,
        socketUrl,
        socketId,
        token,
    }
}

function initSocket() {
    const { roomPart, socketId, socketUrl, token } = getParts()
    socket = io(socketUrl, {
        query: {
            socketId: socketId,
            token: token,
            roomPart: roomPart,
        },
        autoConnect: true,
        reconnection: true,
        transports: ['websocket'],
    })
    socket.emit('join', { roomPart: roomPart })

    socket.on('SC-VOUCHER-UPDATED', (data: any) => {
        emit('VOUCHER-UPDATED-REFRESH-REPORTS', null)
    })
}

function changeRoom() {
    const { roomPart } = getParts()
    socket.emit('leave')
}

export { changeRoom, initSocket, socket }
