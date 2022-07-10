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
    const [src, setSrc] = useState(null)

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
        e.target.classList.add('active');
        setTimeout(() => {
            e.target.classList.remove('active');
        }, 1000);
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
    }

    return (
        <div className="words">
            <audio preload="true" id='tts'></audio>
            <table>
                <thead>
                    <tr>
                        <th><span>단어</span><button onClick={sortWords}>{config.random ? '🔀' : '⬇'}</button></th>
                        <th>의미</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map(row => <tr key={row.id}>
                        <td className={row.passed ? 'word checked passed' : row.checked ? 'word checked' : 'word'} onClick={check(row.id)}>{row.word}</td>
                        <td className='mean' onMouseDown={play(row.word)} onTouchStart={play(row.word)} onTouchEnd={e => e.preventDefault()}>{row.bundle}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default App;
