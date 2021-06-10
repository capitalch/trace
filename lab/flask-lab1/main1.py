from flask import Flask, render_template, jsonify
from flask.globals import request
from flask_socketio import SocketIO, emit
from werkzeug import debug
from werkzeug.exceptions import HTTPException
from jinja2 import TemplateNotFound
# from track.artifacts import trackApp
from flask_scss import Scss


from flask import Flask
from flask_socketio import SocketIO
import eventlet  # important for asyncronous working
import socketio
eventlet.monkey_patch(thread=False)  # thread=False resolves some problems

sio = socketio.Server(async_mode='eventlet')

store = {}

app = socketio.WSGIApp(sio)

eventlet.wsgi.server(eventlet.listen(('', 8000)), app)


# import app.socket

# from app import create_app, socketio

# app = create_app()

# Scss(app, asset_dir='assets', static_dir='static/css')

# app.register_blueprint(trackApp)

# @app.route('/')
# def hello():
#     html = render_template('index.html', companyName='Capital chowringhee pvt ltd',
#                            address1='12 J.L. Nehru road', address2='Kol - 700013')
#     return html

# @app.errorhandler(Exception)
# def handle_error(e):
#     code = 500
#     if isinstance(e, HTTPException):
#         code = e.code
#     elif isinstance(e, TemplateNotFound):
#         code = getattr(e, 'code', 500)
#     return jsonify(error=str(e)), code

# if __name__ == '__main__':
#     socketio.run(app)
