from flask import Blueprint

trackApp = Blueprint('track', __name__)
@trackApp.route('/test1')
def handle():
    return('Test1 ok')