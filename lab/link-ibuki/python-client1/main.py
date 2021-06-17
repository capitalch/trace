from link_client import connectToLinkServer, ibukiEmit, ibukiFilterOn, joinRoom, onReceiveData, onReceiveDataFromPoint


serverUrl = 'https://node70059-develop.cloudjiffy.net/' 
# serverUrl = 'http://localhost:5001'
subject, sio = connectToLinkServer(serverUrl, 'pythonClient1')

subject.subscribe(
    lambda d:
        print(d)
)

ibukiEmit('PYTHON-MESSAGE1', {'foo': 'ABCD'})
ibukiFilterOn('REACT-APP1-MESSAGE', lambda data: print(data))
joinRoom('room1')
onReceiveData(lambda message, data:
              print((message, data)))
onReceiveDataFromPoint(lambda message, data, sourcePointId:
                       print((message, data, sourcePointId)))

sio.wait
