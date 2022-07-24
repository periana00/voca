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
con.commit()
con.close()

def dict_factory(cur, row) :
    dic = {}
    for idx, col in enumerate(cur.description) :
        dic[col[0]] = row[idx]
    return dic

def connect(cb) :
    def inner(self, params) :
        self.con = sqlite3.connect(DB_PATH)
        self.con.row_factory = dict_factory
        self.cur = self.con.cursor()
        try :
            result = cb(self, params)
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
            questions.append(self.question_antonym_get_words(word))
        return questions


    # 중심단어(답) 1, 반의어(문제, 오답) 1 + 3
    def question_antonym_get_words(self, word) :
        # 반의어 찾기(중심 단어가 답), 난이도 쉬움
        words = self.cur.execute('select * from words where class = :class and category != :category order by random() limit 4', word).fetchall()
        words.insert(random.randint(1, 4), word)
        return {'answer': word, 'words': words}