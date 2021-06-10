from flask.wrappers import Request
from flask_socketio import emit
from flask.globals import request
from . import socketio
from . import store

@socketio.on('connect')
def test_connect(auth):
    clientId = request.args.get('clientId')
    store[clientId] = request.sid
    print('Connected:', clientId)


@socketio.on('disconnect')
def test_disconnect():
    clientId = request.args.get('clientId')
    print('Disconnected:', clientId)
