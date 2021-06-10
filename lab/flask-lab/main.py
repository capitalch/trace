from werkzeug import debug
from app import socketio, create_app
from app import track
import app.socket

app = create_app()

app.register_blueprint(track.trackApp)

@app.route('/test')
def handle_test():
    return({'status': 'ok'})

if __name__ == '__main__':
    socketio.run(app, debug=True)
