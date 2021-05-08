from flask import Flask, render_template, jsonify
from werkzeug.exceptions import HTTPException
from jinja2 import TemplateNotFound
from track.artifacts import trackApp
from flask_scss import Scss
import os


app = Flask(__name__, static_folder='static', static_url_path='')
# print('template_folder:', app.template_folder,
#       ', static_url_path:', app.static_url_path, ', static_folder:', app.static_folder)
app.register_blueprint(trackApp)
Scss(app, asset_dir='assets', static_dir='static/css')


@app.route('/')
def hello():
    html = render_template('index.html', companyName='Capital chowringhee pvt ltd',
                           address1='12 J.L. Nehru road', address2='Kol - 700013')
    return html


@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    elif isinstance(e, TemplateNotFound):
        code = getattr(e, 'code', 500)
    return jsonify(error=str(e)), code


# import sys
# import track.artifacts
# from flask.helpers import send_from_directory
# from flask_scss import Scss
# from flask_weasyprint import HTML, render_pdf

# @app.errorhandler(Exception)
# def handler(error):
#     exc = sys.exc_info()
#     adict = vars(exc)
#     return(adict, 403)
    # return(error.args, 403)
