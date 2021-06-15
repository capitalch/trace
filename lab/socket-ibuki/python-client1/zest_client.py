import socketio

# sio = None

def initLink(url, pointId=None, token=None):
    if(url is None):
        return
    sio = socketio.Client(reconnection=True)

    @sio.on('connect')
    def on_connect():
        print('connected')
    
    pid = pointId if pointId is not None else pointId
    sio.connect(url, headers={'pointId': pid},  transports=('websocket'))
    return(sio)

def ibukiEmit(sio, message, data):
    sio.emit('cs-socket-emit', (message, data))


def ibukiFilterOn(sio, message, f):
    sio.emit('cs-socket-filter-on', message)

    @sio.on(message)
    def on_message(data):
        f(data)


def joinRoom(sio, room):
    sio.emit('cs-join-room', room)


def onReceiveData(sio, f):
    @sio.on('sc-send')
    def on_receive(message, data):
        f(message, data)


def onReceiveDataFromPoint(sio, f):
    @sio.on('sc-send-to-point')
    def on_sc_send_to_point(message, data, sourcePointId):
        f(message, data, sourcePointId)