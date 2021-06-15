import sys, os

path = '/var/www/webroot/ROOT'
if path not in sys.path:
    sys.path.append(path)
path1 = '/var/www/webroot/ROOT/TraceServer'
if path1 not in sys.path:
    sys.path.append(path1)
os.chdir(path1)
print('path:', path)
from TraceServer.traceServer import app
application = app