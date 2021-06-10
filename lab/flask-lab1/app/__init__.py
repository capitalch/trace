from flask import Flask
# from flask_socketio import SocketIO
import eventlet  # important for asyncronous working
import socketio
eventlet.monkey_patch(thread=False)  # thread=False resolves some problems

sio = socketio.Server(async_mode='eventlet')
# sio = socketio.Server(cors_allowed_origins="*", async_mode='eventlet')
store = {}
# socketio = SocketIO(cors_allowed_origins="*", async_mode='eventlet')
app = socketio.WSGIApp(sio)

eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
# def create_app():
#     # app = Flask(__name__, static_folder='static', static_url_path='')
#     app = socketio.WSGIApp(sio)
#     # socketio.init_app(app)
#     return app
