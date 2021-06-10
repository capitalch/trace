from flask import Blueprint
from . import socketio
from . import store

trackApp = Blueprint('track', __name__)

@trackApp.route('/test1')
def handle_test1():
    return('Test1 ok')

@socketio.on('myEvent1')
def test_message(message):
    print('myEvent')
    sid = store['12345678']
    socketio.emit('hello', 'Test data', room=sid)
