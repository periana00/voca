from flask import Flask, jsonify, request
from my_db import Word

w = Word()

app = Flask(__name__)

@app.route('/api/get')
def get() :
    path = request.referrer.split('/')[-1]
    return jsonify(w.get({'path':path}) if path == '101' else w.get_301_bundle({'path':path}))

@app.route('/api/get_301')
def get_301() :
    path = request.referrer.split('/')[-1]
    return jsonify(w.get_301_bundle({'path':path}))

@app.route('/api/set', methods=['POST'])
def set() :
    path = request.referrer.split('/')[-1]
    params = request.get_json()
    params['path'] = path
    w.set(params)
    return jsonify(w.get({'path':path}) if path == '101' else w.get_301_bundle({'path':path}))

@app.route('/api/sort')
def sort() :
    path = request.referrer.split('/')[-1]
    w.sort({'path':path})
    return jsonify(w.get({'path':path}) if path == '101' else w.get_301_bundle({'path':path}))

@app.route('/api/reset')
def reset() :
    path = request.referrer.split('/')[-1]
    w.reset({'path':path})
    return jsonify(w.get({'path':path}) if path == '101' else w.get_301_bundle({'path':path}))

@app.route('/api/check/<id>')
def check(id) :
    w.check(id)
    return 'ok'
@app.route('/api/check1/<id>')
def check1(id) :
    w.check1(id)
    return 'ok'
@app.route('/api/check2/<id>')
def check2(id) :
    w.check2(id)
    return 'ok'

@app.route('/api/reset/<id>')
def reset_word(id) :
    w.reset_word(id)
    return 'ok'

@app.route('/api/choose_mean')
def choose_mean() :
    path = request.referrer.split('/')[-1]
    return jsonify(w.choose_mean({'path': path}))

@app.route('/api/antonym_word')
def antonym_word() :
    path = request.referrer.split('/')[-1]
    return jsonify(w.antonym_word({'path': path}))


@app.route('/api/log')
def get_log() :
    path = request.referrer.split('/')[-1]
    return jsonify(w.get_log({ 'path': path}))

@app.route('/api/log/<spent>')
def set_log(spent) :
    path = request.referrer.split('/')[-1]
    return jsonify(w.set_log({ 'path': path }, spent))
