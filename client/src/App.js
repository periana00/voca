import './App.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const config = {
    get random() {
        return cookies.get('random')*1 || 0
    },
    get start() {
        return cookies.get('start')*1 || 1
    },
    get end() { 
        return cookies.get('end')*1 || 1
    },
    set random(val) {
        cookies.set('random', val);
    },
    set start(val) {
        cookies.set('start', val);
    },
    set end(val) {
        cookies.set('end', val);
    }
}


function App() {
    const [words, setWords] = useState([]);

    useEffect(() => {
        const { start, end, random } = config
        axios.post('/api/get', { start, end, random, sort:0 } ).then(res => {
            setWords(res.data.words);
        });
    },[])

    const check = id => e => {
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
        })
    }

    const play = word => e => {
        const a = document.querySelector('#tts')
        a.src = '/audio/' + word + '.mp3'
        a.play()
    }

    let sortLock = false
    const sortWords = e => {
        if (sortLock) return
        sortLock = true
        if (e.target.textContent == '⬇') {
            config.random = 1;
            const { start, end, random} = config
            axios.post('/api/get', { start, end, random, sort:1  }).then(res => {
                setWords(res.data.words);
                sortLock = false
                e.target.textContent = '🔀';
            })
        } else if (e.target.textContent == '🔀') {
            config.random = 0;
            const { start, end, random } = config;
            axios.post('/api/get', { start, end, random, sort:0 }).then(res => {
                setWords(res.data.words);
                sortLock = false
                e.target.textContent = '⬇'
            })
        }
    };

    const changeStart = e => {
        config.start = e.target.value*1
    }
    const changeEnd = e => {
        config.end = e.target.value*1
    }

    

    const reload = e => {
        if (sortLock) return
        sortLock = true
        const { start, end, random } = config
        axios.post('/api/get', { start, end, random, sort:0  }).then(res => {
            setWords(res.data.words);
            sortLock = false;
        });
    }

    console.log(words);

    let last = null
    let count = 0
    return (
        <div className="words">
            <audio preload="true" id='tts'></audio>
            <div>
                <input defaultValue={config.start} onChange={changeStart} onBlur={reload}></input>
                <input defaultValue={config.end} onChange={changeEnd} onBlur={reload}></input>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th><span>단어</span><button onClick={sortWords}>{config.random ? '🔀' : '⬇'}</button></th>
                        <th>의미</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map(row => {
                        if (!last || last != row.bundle) count++
                        const el = <tr key={row.id} className={!last || last != row.bundle ? 'first' : null}>
                            {!last || last != row.bundle ? <td rowSpan={row.count}>{count}</td> : null}
                            <td><button onClick={play(row.word)}><img src='image/speaker.png' /></button></td>
                            <td className={row.passed ? 'word checked passed' : row.checked ? 'word checked' : 'word'} onClick={check(row.id)}>{row.word}</td>
                            {!last || last != row.bundle ? <td className='mean' rowSpan={row.count}>{row.bundle}</td> : null}
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
