import './App.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const config = {
    get subchapter() {
        return cookies.get('subchapter')*1 || 1
    },
    set subchapter(val) {
        cookies.set('subchapter', val);
    },
}


function App() {
    const [words, setWords] = useState([]);
    let lock = false

    useEffect(() => {
        const { subchapter } = config
        axios.post('/api/get', { subchapter, sort:0 } ).then(res => {
            setWords(res.data.words);
        });
    },[])


    const check = id => e => {
        if (lock) return
        lock = true
        axios.get('/api/check/' + id).then(res => {
            if (res.status == 200) {
                if (e.target.classList.contains('checked')) {
                    if (e.target.classList.contains('passed')) {
                        e.target.classList.remove('checked', 'passed')
                    } else {
                        e.target.classList.add('passed')
                    }
                } else {
                    e.target.classList.add('checked')
                }
            }
            lock = false
        })
    }

    const play = word => e => {
        const a = document.querySelector('#tts')
        a.src = '/audio/' + word + '.mp3'
        a.play()
    }

    const sortWords = e => {
        if (lock) return
        lock = true
        const { subchapter } = config
        axios.post('/api/get', { subchapter, sort:1  }).then(res => {
            setWords(res.data.words);
            lock = false;
        })
    };

    const changeChapter = direction => e => {
        if (lock) return
        lock = true
        let { subchapter } = config;
        if (config.subchapter*1 + direction < 0) return 
        config.subchapter = subchapter*1 + direction
        axios.post('/api/get', { subchapter: subchapter*1 + direction, sort:0  }).then(res => {
            setWords(res.data.words);
            lock = false;
        });
    }

    let last = null
    let count = 0
    return (
        <div className="words">
            <audio preload="true" id='tts'></audio>
            <header>
                <span>챕터: {config.subchapter}</span>
                <button onClick={changeChapter(1)}>⬆️</button>
                <button onClick={changeChapter(-1)}>⬇️</button>
                <button onClick={sortWords}>🔃</button>
                <div>주제:{words.length ? words[0]['class'] : null}</div>
            </header>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>단어</th>
                        <th>의미</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map(row => {
                        // if (!last || last != row.bundle) count++
                        // const el = <tr key={row.id} className={!last || last != row.bundle ? 'first' : null}>
                        const el = <tr key={row.id}>
                            {/* {!last || last != row.bundle ? <td rowSpan={row.count}>{count}</td> : null} */}
                            <td>{++count}</td>
                            <td><button onClick={play(row.word)}><img src='image/speaker.png' /></button></td>
                            <td className={row.passed ? 'word checked passed' : row.checked ? 'word checked' : 'word'} onClick={check(row.id)}>{row.word}</td>
                            {/* {!last || last != row.bundle ? <td className='mean' rowSpan={row.count}>{row.bundle}</td> : null} */}
                            <td className='mean'>{row.bundle}</td>
                        </tr>
                        last = row.bundle
                        return el
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
