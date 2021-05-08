from flask import Flask, jsonify, render_template
from flask.helpers import send_from_directory
from flask_scss import Scss
from werkzeug.exceptions import HTTPException

app = Flask(__name__,template_folder='build', static_url_path='') # , static_folder='build',template_folder='build',  static_url_path=''
Scss(app, asset_dir='assets', static_dir='static')


@app.route('/')
def serveStatic():
    return render_template('index.html')

@app.route('/static/<path:path>')
def static_dir(path):
    return send_from_directory('build/static', path)

@app.route('/<path>')
def serve_other(path):
    return send_from_directory('build', path)

@app.route('/hello')
def hello():
    return('Hello')

@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return (jsonify(error=str(e)), code)

if __name__ == '__main__':
    app.run(debug=True, threaded=True)