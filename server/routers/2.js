import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express';

import sqlite3 from 'sqlite3';
sqlite3.verbose();

const router = express.Router();
const db = new sqlite3.Database('words2.db');

function execute(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

router.post('/api/check', async (req, res) => {
    const { id } = req.body;
    const row = (await execute('SELECT checked, passed FROM words WHERE id=?', [id]))[0];
    // await execute('UPDATE words SET checked=0, passed=0 WHERE id=?', [id]);
    if (!row.checked && !row.passed) {
        await execute('UPDATE words SET checked=1 WHERE id=?', [id]);
    } else if (row.checked) {
        await execute('UPDATE words SET checked=0, passed=1 WHERE id=?', [id]);
    } else if (row.passed) {
        await execute('UPDATE words SET passed=0 WHERE id=?', [id]);
    }
    const result = (await execute('SELECT id, word, mean, bundle, papago, checked, passed FROM words WHERE id=?', [id]))[0];

    res.send(result);
})

router.post('/api/reset', async (req, res) => {
    let params = req.body;
    await execute('UPDATE words SET checked=0, passed=0 WHERE chapter BETWEEN ? AND ?', [params.min, params.max]);
    params = req.cookies;
    const words = await getWords(params)
    res.send(words);
})

async function getWords(params) {
    const { min, max, random, checked, passed, sort, reset } = params;
    const chapters = min + '-' + max;
    let query = '';

    if (1*reset) {
        console.log(1);
        await execute('UPDATE words SET checked=0, passed=0 WHERE chapter BETWEEN ? AND ?', [min, max]);
    }

    if (1*random) {
        if (1*sort || !(await execute('SELECT * FROM seq WHERE chapters = ?', [ chapters ])).length) {
            // 정렬이 1이거나 seq 테이블에 해당 랜덤 정렬이 없는 경우
            await execute('DELETE FROM seq WHERE chapters=?', [ chapters ]);
            await execute(`
                INSERT INTO seq
                SELECT id, ?
                FROM words
                WHERE chapter BETWEEN ? AND ?
                ORDER BY random()
            `, [ chapters, min, max ]);
        }
        console.log('seq 단어 숫자: ', await execute('select count(*) from seq where chapters=?', [chapters]))
        query += `SELECT words.id, word, mean, bundle, papago, checked, passed, chapter
        FROM seq
        LEFT JOIN words
        ON seq.id = words.id
        WHERE chapters=?`;
        if (1*checked) query += ' AND checked=0';
        if (1*passed) query += ' AND passed=0';
        const words = await execute(query, [chapters])
        return words;
    } else {
        query += `SELECT id, word, mean, bundle, papago, checked , passed, chapter FROM words WHERE chapter BETWEEN ? AND ?`
        if (1*checked) query += ' AND checked=0';
        if (1*passed) query += ' AND passed=0';
        const words = await execute(query, [min, max])
        return words;
    }
}


router.get('/api/words', async (req, res) => {
    const params = req.cookies;
    const words = await getWords(params);
    console.log(params);
    res.cookie('sort', '0', {path: '/2'});
    res.cookie('reset', '0', {path: '/2'});
    res.send(words);
})

router.get('/', (req, res) => {
    res.cookie('path', '2', {path: '/2'});
    res.sendFile(path.join(__dirname, '../views/index.html'));
});


export default router;