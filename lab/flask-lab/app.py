from flask import Flask, render_template, templating, jsonify
from werkzeug.exceptions import HTTPException
from jinja2 import TemplateNotFound
from track.artifacts import trackApp
# import sys
# import track.artifacts
# from flask.helpers import send_from_directory
# from flask_scss import Scss
# from flask_weasyprint import HTML, render_pdf

app = Flask(__name__, static_url_path='',
            static_folder='build/static', template_folder='templates')
app.register_blueprint(trackApp)    
# Scss(app)


@app.route('/')
def hello():
    # a = 1/0
    return render_template('bills/bill1.html', companyName='Capital chowringhee pvt ltd', address1='12 J.L. Nehru road', address2='Kol - 700013')

@app.route('/bill')
def bill():
    html = render_template('bills/bill.html', companyName='Capital chowringhee pvt ltd',
                           address1='12 J.L. Nehru road', address2='Kol - 700013')
    # return render_pdf(HTML(string=html))
    return html

# @app.errorhandler(Exception)
# def handler(error):
#     exc = sys.exc_info()
#     adict = vars(exc)
#     return(adict, 403)
    # return(error.args, 403)

@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    elif isinstance(e, TemplateNotFound):
        code = getattr(e, 'code', 500 )
    return jsonify(error=str(e)), code

@app.route('/lab')
def lab():
    return('abc')
