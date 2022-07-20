from flask import Flask, jsonify, request
from my_db import Word

w = Word()

app = Flask(__name__)

@app.route('/api/get')
def get() :
    path = request.referrer.split('/')[-1]
    return jsonify(w.get({'path':path}))

@app.route('/api/set', methods=['POST'])
def set() :
    path = request.referrer.split('/')[-1]
    params = request.get_json()
    params['path'] = path
    w.set(params)
    return jsonify(w.get(params))

@app.route('/api/sort')
def sort() :
    path = request.referrer.split('/')[-1]
    w.sort({'path':path})
    return jsonify(w.get({'path':path}))

@app.route('/api/reset')
def reset() :
    path = request.referrer.split('/')[-1]
    w.reset({'path':path})
    return jsonify(w.get({'path':path}))

@app.route('/api/check/<id>')
def check(id) :
    w.check(id)
    return 'ok'