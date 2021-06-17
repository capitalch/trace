from flask.globals import request
# from flask_socketio import join_room, leave_room
import jwt
# from . import socketio
from . import store
from loadConfig import cfg


# def getRoom():
#     def getClientId(token):
#         secret = cfg.get('jwt').get('secret')
#         algorithm = cfg.get('jwt').get('algorithm')
#         payload = jwt.decode(token, secret, algorithm)
#         return payload.get('clientId')
#     token = request.args.get('token')
#     roomPart = request.args.get('roomPart')
#     clientId = getClientId(token)
#     room = str(clientId)+roomPart
#     return(room)

# def voucherUpdatedSocket(ctx):
#     room = getRoomFromCtx(ctx)
#     socketio.emit('SC-VOUCHER-UPDATED', 'Update done', to=room)

# def getRoomFromCtx(ctx):
    # clientId, buCode, finYearId, branchId = ctx.get('clientId'), ctx.get(
    #     'buCode'), ctx.get('finYearId'), ctx.get('branchId')
    # room = f'{str(clientId)}:{buCode}:{finYearId}:{branchId}'
    # return(room)


# @socketio.on('connect')
# def do_connect():
#     socketId = request.args.get('socketId')
#     store[socketId] = request.sid  # sid is socket session id which is unique
#     print('Connected:', socketId)

# @socketio.on('join')
# def do_join(data):
#     room = getRoom()
#     join_room(room)
#     print('joined room:', room)

# @socketio.on('leave')
# def do_leave():
#     currentRoom = getRoom()
#     leave_room(currentRoom)
#     print('left room:', currentRoom)

# @socketio.on('disconnect')
# def do_disconnect():
#     socketId = request.args.get('socketId')  # socketId is generated at client
#     store.pop(socketId, None)
#     print('Disconnected:', socketId)

