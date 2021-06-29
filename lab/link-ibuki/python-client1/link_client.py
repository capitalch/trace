import socketio
from rx.subject import Subject, BehaviorSubject
sio = None


def connectToLinkServer(url, pointId=None, token=None):
    global sio
    if(url is None):
        return
    subject = BehaviorSubject(1)
    pid = pointId

    if(sio is not None):
        subject.on_next({'connected', True})
        return(subject, sio)

    sio = socketio.Client(reconnection=True)

    @sio.on('connect')
    def on_connect():
        print('connected')
        subject.on_next({'connected', True})

    @sio.on('error')
    def on_error():
        print('connection error')
        subject.on_next({'connected': False})

    try:
        sio.connect(url, headers={'pointId': pid},  transports=('websocket'))
    except(Exception) as error:
        print(' '.join(['Link server', str(error)]))

    return(subject, sio)

def disconnectFromLinkServer():
    sio.disconnect()

def ibukiEmit(message, data):
    sio.emit('cs-socket-emit', (message, data))


def ibukiFilterOn(message, f):
    sio.emit('cs-socket-filter-on', message)

    @sio.on(message)
    def on_message(data):
        f(data)


def joinRoom(room):
    sio.emit('cs-join-room', room)


def onReceiveData(f):
    @sio.on('sc-send')
    def on_receive(message, data):
        f(message, data)


def onReceiveDataFromPoint(f):
    @sio.on('sc-send-to-point')
    def on_sc_send_to_point(message, data, sourcePointId):
        f(message, data, sourcePointId)

def sendToPoint(message, data, point):
    sio.emit('cs-send-to-point', (message, data, point))

def sendToRoom(message, data, room):
    sio.emit('cs-send-to-room', (message, data, room))
