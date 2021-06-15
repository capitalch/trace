from zest_client import initLink, ibukiEmit, ibukiFilterOn, joinRoom, onReceiveData, onReceiveDataFromPoint

sio = initLink('http://localhost:5000', 'pythonClient1')
ibukiEmit(sio,'PYTHON-MESSAGE1', {'foo': 'ABCD'})
ibukiFilterOn(sio, 'REACT-APP1-MESSAGE', lambda data: print(data))
joinRoom(sio, 'room1')
onReceiveData(sio, lambda message, data:
              print((message, data)))
onReceiveDataFromPoint(sio, lambda message, data, sourcePointId:
                       print((message, data, sourcePointId)))

sio.wait()