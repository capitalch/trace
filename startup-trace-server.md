cd C:\projects\trace\dev\link-server && npm start

cd C:\projects\trace\dev\trace-client && npm start

cd C:\projects\trace && env\scripts\activate && cd dev\traceServer && set FLASK_APP=traceServer
flask run
