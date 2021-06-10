import { useSharedElements } from '../shared-elements-hook'
import { useTopMenu, useStyles } from './top-menu-hook'
// import { socketId, socket } from '../utils/socket'

function TopMenu() {
    const { handleButtonClick, meta, setRefresh } = useTopMenu()
    const { Button, useIbuki } = useSharedElements()
    const { emit } = useIbuki()
    const classes = useStyles()
    return (
        <div className={classes.content}>
            <Button
                className="menu-button"
                title="Send SMS of sale bill to customer"
                onClick={(e) => {
                    handleButtonClick('trackSaleSms')
                }}>
                Sale SMS
            </Button>
            <Button
                className="menu-button"
                title="Imports sale data from Track+ to Trace"
                onClick={(e) => {
                    handleButtonClick('importTrackSale')
                }}>
                Import Track+ sales
            </Button>
            <Button
                className="menu-button"
                title="Imports sale data from Service+ to Trace"
                onClick={(e) => {
                    handleButtonClick('importServiceSale')
                }}>
                Import Service+ sales
            </Button>
            {/* <Button
                className="menu-button"
                onClick={(e) => {
                    socket.emit('room-test', {
                        socketId: socketId,
                        data: 'abcd',
                    })
                }}>
                Test Socket
            </Button>
            <Button
                className="menu-button"
                onClick={(e) => {
                    socket.emit('room-change', {
                        socketId: socketId,
                        data: 'abcd',
                        room:'room2'
                    })
                }}>
                Change room
            </Button> */}
        </div>
    )
}

export { TopMenu }
