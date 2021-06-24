from doAllTransfers import doAllTransfers
from datetime import datetime

sourceConnString = 'DSN=capi2020'
destConnString = 'DSN=capi2021'

# sourceConnString = 'UID=dba;PWD=sql;EngineName=server;DatabaseName=capi2020;CommLinks=TCPIP(HOST=DELL-PC);Driver=C:\Program Files\SQL Anywhere 11\Bin64\dbodbc11.dll'
# destConnString = 'UID=dba;PWD=sql;EngineName=server;DatabaseName=capi2021;CommLinks=TCPIP(HOST=DELL-PC);Driver=C:\Program Files\SQL Anywhere 11\Bin64\dbodbc11.dll'
startTime = datetime.now()
doAllTransfers(sourceConnString, destConnString)
delta = (datetime.now() - startTime) / 60
print('Time taken to execute: ', delta, ' minutes')
