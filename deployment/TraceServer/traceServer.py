import requests
import sys, os
from flask_cors import CORS
from traceMain import app

CORS(app, expose_headers='SELECTION-CRITERIA')
@app.route('/contacts')
def contacts():
    r = requests.get('http://chisel.cloudjiffy.net/contacts/short')
    return (r.text)

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
    