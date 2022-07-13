from flask import Flask, request
from mydb import Word
import time
w = Word()

def create_app() :
    import mydb
    app = Flask(__name__)

    @app.route('/api/get', methods=['POST'])
    def get() :
        start = time.time()
        params = request.get_json()
        if params['sort'] :
            w.sort()
        return {'words': w.get(params['subchapter']), 'time': time.time() - start}

    @app.route('/api/check/<id>')
    def check(id) :
        w.check(id)
        return 'ok'

    @app.route('/api/reset', methods=['POST'])
    def reset() :
        start = time.time()
        params = request.get_json()
        w.sort(False)
        w.reset(params['subchapter'])
        return {'words': w.get(params['subchapter']), 'time': time.time() - start}

    return app

