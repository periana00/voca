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
        print(params)
        if params['sort'] :
            w.sort(params['start'], params['end'])
        return {'words': w.get(params['start'], params['end'], params['random']), 'time': time.time() - start}

    @app.route('/api/check/<id>')
    def check(id) :
        w.check(id)
        return 'ok'

    return app

