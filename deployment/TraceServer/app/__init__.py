# import eventlet # important for asyncronous working
from flask import Flask
# from flask_socketio import SocketIO

# eventlet.monkey_patch(thread=False) # thread=False resolves some problems

store = {}
# socketio = SocketIO(cors_allowed_origins="*", async_mode='eventlet')

def create_app():
    app=Flask(__name__, template_folder="../build")
    # socketio.init_app(app)
    return app