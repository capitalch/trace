import socketio
import eventlet

eventlet.monkey_patch(thread=False)
sio = socketio.Server(async_mode='eventlet')
app = socketio.WSGIApp(sio)

# @sio.on('connect')
# def test_connect():
#     print('connected')

@sio.event
def connect(sid, environ, auth):
    print('connect ', sid)

import eventlet
eventlet.wsgi.server(eventlet.listen(('', 8000)), app)



