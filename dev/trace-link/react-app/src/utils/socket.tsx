import io from 'socket.io-client'
import { usingIbuki } from '../utils/ibuki'
import { utilMethods } from '../utils/util-methods'

const { getConfig } = utilMethods()
const config = getConfig()
const socketUrl: string = "localhost:5000" // config[config.env]
const socketId = Math.random().toString(36).substr(2, 12)
const { emit } = usingIbuki()
// const socket = io(socketUrl, {
//     query: { socketId: socketId,room:'room1' },
//     autoConnect: true,
//     reconnection: true,
//     transports: ['websocket'],
// })

// socket.on('SC-NOTIFY-ROWS-PROCESSED', (data) => {
//     emit('IMPORT-SERVICE-SALE-HELPER-HOOK-COUNTER-TICK', data)
// })

// socket.on('sc-room-test', (data) => {
//     console.log(data)
// })

// export { socketId, socket }
