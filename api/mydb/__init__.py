import sqlite3
import os
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

    def sort(self) :
        try :
            self.connect()
            self.cur.execute('DELETE FROM seq')
            self.cur.execute('''
            INSERT INTO seq (id) 
                SELECT id FROM (
                    SELECT bundle, row_number() OVER(ORDER BY random()) AS seq
                    FROM words
                    GROUP BY bundle
                    ) b
                LEFT JOIN words w
                ON b.bundle = w.bundle
                ORDER BY b.seq, random()
            ''').fetchall()
            self.con.commit()
            self.disconnect()
            return True
        except :
            self.con.rollback()
            self.disconnect()
            return False

    def get(self, subchapter_start, subchapter_end, random=0) :
        self.connect()
        print(self.cur.execute('select * from seq left join words on seq.id=words.id').fetchone())
        if random :
            param = '''
            SELECT s.id, chapter, subchapter, bundle, class, word, mean, checked, passed, count
            FROM seq s
            LEFT JOIN words w
            ON s.id = w.id
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
            print(dic)
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
