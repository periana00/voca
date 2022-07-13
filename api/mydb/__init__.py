import sqlite3
import os
import random

DB_PATH = os.path.join(os.path.dirname(__file__), '301.db')

def dict_factory(cur, row) :
    dic = {}
    for idx, col in enumerate(cur.description) :
        dic[col[0]] = row[idx]
    return dic


class Word: 
    def connect(self) :
        self.con = sqlite3.connect(DB_PATH)
        self.con.row_factory = dict_factory
        self.cur = self.con.cursor()
    def disconnect(self) :
        if self.cur :
            self.cur.close()
            self.cur = None
        if self.con :
            self.con.close()
            self.con = None

    def sort(self, start, end) :
        if start == end : end = start + 1
        try :
            self.connect()
            # self.cur.execute('DELETE FROM seq')
            # self.cur.execute('''
            # INSERT INTO seq (id) 
            #     SELECT id FROM (
            #         SELECT bundle, row_number() OVER(ORDER BY random()) AS seq, class
            #         FROM words
            #         GROUP BY class, bundle
            #         ) b
            #     LEFT JOIN words w
            #     ON b.bundle = w.bundle AND b.class = w.class
            #     ORDER BY b.seq, random()
            # ''').fetchall()
            self.cur.execute('DELETE FROM seq')
            for row in self.cur.execute('SELECT class, bundle, count FROM words GROUP BY class, bundle ORDER BY random()').fetchall() :
                noise = self.cur.execute('SELECT id, chapter, subchapter, word, mean, bundle, class, checked, passed, ? as count FROM words WHERE class != ? AND bundle != ? AND subchapter BETWEEN ? AND ? ORDER BY random() LIMIT 1', (row['count'] + 1, row['class'], row['bundle'], start, end)).fetchone()
                noise['bundle'] = f'{row["bundle"]}<br>{noise["word"]}: {noise["bundle"]}'
                words = self.cur.execute('SELECT id, chapter, subchapter, word, mean, ? as bundle, class, checked, passed, ? as count FROM words WHERE class = ? AND bundle = ? ORDER BY random()', (noise['bundle'], row['count'] + 1, row['class'], row['bundle'])).fetchall()
                words.insert(random.randint(0, row['count']), noise)
                words = [list(word.values()) for word in words]
                self.cur.executemany('INSERT INTO seq values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', words)
            self.con.commit()
            self.disconnect()
            return True
        except :
            self.con.rollback()
            self.disconnect()
            return False

    def get(self, subchapter_start, subchapter_end, random=0) :
        self.connect()
        if random :
            param = '''
            SELECT id, chapter, subchapter, bundle, class, word, mean, checked, passed, count
            FROM seq
            WHERE subchapter BETWEEN ? AND ?
            '''
        else :
            param = '''
            SELECT id, chapter, subchapter, bundle, class, word, mean, checked, passed, count
            FROM words
            WHERE subchapter BETWEEN ? AND ?
            '''
        self.cur.execute(param, (subchapter_start, subchapter_end))
        result = self.cur.fetchall()
        self.disconnect()
        return result

    def check(self, id) :
        try :
            self.connect()
            dic = self.cur.execute('SELECT checked, passed FROM words WHERE id=?', (id, )).fetchone()
            if dic['checked'] :
                if dic['passed'] :
                    self.cur.execute('UPDATE words SET checked=0, passed=0 WHERE id=?', (id, ))
                else :
                    self.cur.execute('UPDATE words SET passed=1 WHERE id=?', (id, ))
            else :
                self.cur.execute('UPDATE words SET checked=1 WHERE id=?', (id, ))
            self.con.commit()
            self.disconnect()
            return True
        except :
            self.con.rollback()
            self.disconnect()
            return False
