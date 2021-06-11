import sys, os, logging
logger=logging.getLogger()
logging.debug('This message should go to the log file')

appFolderName = 'TraceServer'
userPath = os.path.expanduser('~')
path = os.path.join(userPath, 'ROOT')
#logger.warning(path)
if path not in sys.path:
    sys.path.append(path)
virtenv = os.path.join(path, 'virtenv') # os.path.expanduser('~') + '/ROOT/TraceServer/virtenv/'
virtualenv = os.path.join(virtenv, 'bin/activate_this.py')
try:
    exec(compile(open(virtualenv, "rb").read(), virtualenv, 'exec'), dict(__file__=virtualenv))
    appFolderPath = os.path.join(path, appFolderName)
    logger.warning('appFolderPath:' + appFolderPath)
    os.chdir(appFolderPath)
    if appFolderPath not in sys.path:
        sys.path.append(appFolderPath)
    from TraceServer import traceServer
    application = traceServer.app
except Exception as e:
    logger.error(e)












