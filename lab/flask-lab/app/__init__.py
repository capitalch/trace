from flask import Flask
from flask_socketio import SocketIO
store = {}
socketio = SocketIO(cors_allowed_origins="*")

def create_app():
    app=Flask(__name__)
    socketio.init_app(app)
    return app