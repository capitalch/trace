
from flask.globals import request
from flask_socketio import emit, join_room, send, leave_room
# from . import socketio
from . import sio
from . import store

@sio.on('connect')
def test_connect():
    socketId = request.args.get('socketId')
    room = request.args.get('room')
    store[socketId] = request.sid
    join_room(room)
    print('Connected:', socketId)


@sio.on('disconnect')
def test_disconnect():
    socketId = request.args.get('socketId')
    # leave_room('room1')
    store.pop(socketId, None)
    print('Disconnected:', socketId)

@sio.on('room-test')
def room_test(message):
    sid = request.sid
    print('room-test', ' ', 'socketId:', message.get('socketId'))
    emit('sc-room-test','Response from server against room test', to='room2')

@sio.on('room-change')
def room_change(message):
    sid = request.sid
    room = message.get('room')
    join_room(room)
    leave_room('room1')

# @socketio.on('join')
# def on_join(data):
#     room = 'room1'
#     join_room(room)
#     send('has entered the room.', to=room)