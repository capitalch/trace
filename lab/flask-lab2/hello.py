from flask import Flask
# import wsgi_app
# from flask_socketio import SocketIO
# import module1.myFile as myFile

import socketio
import eventlet

eventlet.monkey_patch(thread=False)
sio = socketio.Server(async_mode='eventlet', cors_allowed_origins="*")
# app = socketio.WSGIApp(sio)
app = Flask(__name__)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app) # 1 working
# wsgi_app = socketio.WSGIApp(sio, app.wsgi_app) # 2 working
# wsgi_app = socketio.WSGIApp(sio) # 3  working
# socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="*")
# socketio = SocketIO(app,  cors_allowed_origins="*")
# app = socketio.WSGIApp(sio, app)
@app.route('/')
def hello():
    return('Hello')

@sio.on('connect')
def connect(sid, environ):
    print('connected')

eventlet.wsgi.server(eventlet.listen(('', 5000)), app) # 1 working
# eventlet.wsgi.server(eventlet.listen(('', 5000)), app) # 2 working
# eventlet.wsgi.server(eventlet.listen(('', 5000)), wsgi_app)
# eventlet.listen('', 5000)




# @socketio.on('connect')
# def on_connect():
#     print('connected')


# @socketio.on('disconnect')
# def on_disconnect():
#     print('disconnected')

# if(__name__ == "__main__"):
#     socketio.run(app)