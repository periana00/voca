import sqlite3
import os
import random
DB_PATH = os.path.join(os.path.dirname(__file__), 'word.db')

con = sqlite3.connect(DB_PATH)
cur = con.cursor()
cur.execute('''
DROP TABLE IF EXISTS config 
''')
cur.execute('''
CREATE TABLE IF NOT EXISTS config (
    path TEXT,
    start NUMBER,
    end NUMBER
)
''')
if len(cur.execute('select * from config').fetchall()) == 0 :
    cur.execute("INSERT INTO config VALUES ('101', 1, 1)")
    cur.execute("INSERT INTO config VALUES ('301', 1, 1)")
cur.execute('''
CREATE TABLE IF NOT EXISTS log (
    path TEXT,
    start NUMBER,
    end NUMBER,
    spent NUMBER,
    time DATETIME DEFAULT (datetime('now', 'localtime', '+9 hours'))
)
''')
con.commit()
con.close()

def dict_factory(cur, row) :
    dic = {}
    for idx, col in enumerate(cur.description) :
        dic[col[0]] = row[idx]
    return dic

def connect(cb) :
    def inner(self, *params) :
        self.con = sqlite3.connect(DB_PATH)
        self.con.row_factory = dict_factory
        self.cur = self.con.cursor()
        try :
            result = cb(self, *params)
            self.con.commit()
            self.con.close()
            return result
        except Exception as e:
            print(e)
            self.con.rollback()
            self.con.close()
            return False
    return inner


class Word :
    con: sqlite3.Connection
    cur: sqlite3.Cursor

    @connect
    def get(self, params) :
        params = self.cur.execute('SELECT * FROM config WHERE path=:path', params).fetchone()
        chapter = 'subchapter' if params['path'] == '301' else 'chapter'
        query = f'SELECT * FROM seq WHERE {chapter} BETWEEN :start AND :end AND status<2'
        result = self.cur.execute(query, params).fetchall()
        return {'config': params, 'words': result}

    @connect
    def set(self, params) :
        if 'start' in params :
            self.cur.execute('UPDATE config SET start=:start WHERE path=:path', params)
        if 'end' in params :
            self.cur.execute('UPDATE config SET end=:end WHERE path=:path', params)
        return True

    @connect
    def sort(self, params) :
        start = 1 if params['path'] == '101' else 61
        end = 60 if params['path'] == '101' else 1000
        self.cur.execute('DELETE FROM seq WHERE chapter BETWEEN ? AND ?', (start, end))
        self.cur.execute('INSERT INTO seq SELECT * FROM words WHERE chapter BETWEEN ? AND ? ORDER BY random()', (start, end))
        return True

    @connect
    def reset(self, params) :
        params = self.cur.execute('SELECT * FROM config WHERE path=:path', params).fetchone()
        chapter = 'subchapter' if params['path'] == '301' else 'chapter'
        self.cur.execute(f'UPDATE words SET status=0 WHERE {chapter} BETWEEN :start AND :end', params)
        self.cur.execute(f'DELETE FROM seq WHERE {chapter} BETWEEN :start AND :end', params)
        self.cur.execute(f'INSERT INTO seq SELECT * FROM words WHERE {chapter} BETWEEN :start AND :end', params)
        return True

    @connect
    def check(self, id) :
        self.cur.execute('UPDATE words SET status=(case when(status==2) then 0 else status+1 end) WHERE id=?', (id, ))
        self.cur.execute('UPDATE seq SET status=(case when(status==2) then 0 else status+1 end) WHERE id=?', (id, ))
        return True
    @connect
    def check1(self, id) :
        self.cur.execute('UPDATE words SET status=1 WHERE id=?', (id, ))
        self.cur.execute('UPDATE seq SET status=1 WHERE id=?', (id, ))
        return True
    @connect
    def check2(self, id) :
        self.cur.execute('UPDATE words SET status=2 WHERE id=?', (id, ))
        self.cur.execute('UPDATE seq SET status=2 WHERE id=?', (id, ))
        return True

    def get_wrong_means(self, params, word) :
        chapter = 'chapter' if params['path'] == '101' else 'subchapter'
        mean = 'mean' if params['path'] == '101' else 'bundle'
        wordmean = word['mean'] if params['path'] == '101' else word['bundle']
        words = self.cur.execute(f'''
        SELECT * FROM words 
        WHERE 
            {chapter} BETWEEN ? AND ?
            AND 
            {mean} != ?
            AND
            status<2
        GROUP BY {mean}
        ORDER BY random() 
        LIMIT 4''', (params['start'], params['end'], wordmean)).fetchall()
        words.insert(random.randint(0, len(words)), word)
        return {'answer': word, 'words': words}

    @connect
    def choose_mean(self, params) :
        params = self.cur.execute('SELECT * FROM config WHERE path=:path', params).fetchone()
        chapter = 'chapter' if params['path'] == '101' else 'subchapter'
        result = []
        words = self.cur.execute(f'SELECT * FROM seq WHERE {chapter} BETWEEN :start AND :end AND status<2', params).fetchall()
        for word in words :
            result.append(self.get_wrong_means(params, word))
        return result

    @connect
    def reset_word(self, id) :
        self.cur.execute('UPDATE words SET status=0 WHERE id=?', (id,))
        self.cur.execute('UPDATE seq SET status=0 WHERE id=?', (id,))
        return True

    @connect
    def antonym_word(self, params) :
        params = self.cur.execute('SELECT * FROM config WHERE path=:path', params).fetchone()
        chapter = 'chapter' if params['path'] == '101' else 'subchapter'
        words = self.cur.execute(f'SELECT * FROM seq WHERE {chapter} BETWEEN :start AND :end AND status<2', params).fetchall()
        questions = []
        # 추후 섞기에 대한 확인 필요?
        random.shuffle(words)
        for word in words :
            questions.append(self.make_antonym_set(word))
        return questions


    # 중심단어(답) 1, 반의어(문제, 오답) 1 + 3
    def question_antonym_get_words(self, word) :
        # 반의어 찾기(중심 단어가 답), 난이도 쉬움
        words = self.cur.execute('select * from words where class = :class and category != :category order by random() limit 4', word).fetchall()
        words.insert(random.randint(1, 4), word)
        return {'answer': word, 'words': words}

    # 1 반의어(문제), 3 반의어 및 반의어의 유의어, 1 답 
    def make_antonym_set(self, word) :
        # word: 답, antonym: 반의어, 문제
        # antonyms = self.cur.execute('select * from words where class = :class and category = -( :category ) order by random() limit 4', word).fetchall()
        # word['antonyms'] = len(antonyms)
        # others = self.cur.execute('select * from words where class = :class and case when :category > 0 then category = -1 else category = 1 end order by random() limit 4 - :antonyms', word).fetchall()
        # question = antonyms.pop(0) if antonyms else others.pop(0)
        # words = antonyms + others
        # random.shuffle(words)
        # words.insert(0, question)
        # words.insert(random.randint(1, 4), word)

        question = self.cur.execute('SELECT * FROM words WHERE class = :class AND category != :category ORDER BY random() LIMIT 1', word).fetchone()
        synonyms = self.cur.execute('SELECT * FROM words WHERE class = :class AND bundle = :bundle AND word != :word LIMIT 3', question).fetchall()
        question['synonyms'] = len(synonyms)
        others = self.cur.execute('SELECT * FROM words WHERE class = :class AND category = :category AND bundle != :bundle ORDER BY random() LIMIT 3 - :synonyms', question).fetchall()
        words = synonyms + others + [word]
        random.shuffle(words)
        words.insert(0, question)

        return {'answer': word, 'words': words}

    @connect
    def get_301_bundle(self, params) :
        params = self.cur.execute('SELECT * FROM config WHERE path=:path', params).fetchone()
        bundles = self.cur.execute('SELECT DISTINCT bundle FROM seq WHERE subchapter BETWEEN :start AND :end', params).fetchall()
        pack = []
        for row in bundles :
            words = self.cur.execute('SELECT * FROM seq WHERE bundle=:bundle AND status < 2', row).fetchall()
            if words :
                pack.append(words)
        return {'config': params, 'words': pack}

    @connect
    def set_log(self, params, spent) :
        params = self.cur.execute('SELECT * FROM config WHERE path=:path', params).fetchone()
        params['spent'] = spent
        self.cur.execute('INSERT INTO log (path, start, end, spent) VALUES (:path, :start, :end, :spent)', params)
        return True

    @connect
    def get_log(self, params) :
        results = self.cur.execute('''SELECT * FROM log WHERE time >= date('now', 'localtime', '+9 hours') AND path=:path''', params).fetchall()
        return results
