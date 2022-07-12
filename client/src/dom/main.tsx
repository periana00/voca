import React, {useEffect, useRef, useState, useReducer } from 'react';
import Cookie from '../utils';
import { wordsReducer } from './reducer';
import Footer from './footer';
import Header from './header';

const cookie = new Cookie();

function Word(props: any) {
    const { id, passed, checked, children, dispatch } = props;

    function check() {
        fetch(window.location.href + '/api/check', {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => dispatch({ type: 'checkWord', word: data }));
    }

    return <td className={passed ? 'passed' : checked ? 'checked' : null} onClick={check}>{children}</td>
}

export default function Main() {
    const [{ words, focus }, dispatchWords]: [{words: any[], focus: number}, Function] = useReducer(wordsReducer, {words: [], focus:cookie.get().focus});

    // 맨 처음 단어 로딩    
    useEffect(() => {
        fetch(window.location.href + '/api/words').then(res => res.json()).then(data => dispatchWords({ type: 'setWords', words: data }));
    }, []);

    useEffect(() => {
        const el = document.querySelector('.focused');
        el && el.scrollIntoView({ block: 'center' });
    }, [focus]);

    return <>
        <header>
            <Header dispatch={dispatchWords} cookie={cookie} />
        </header>
        <div className='main'>
            <audio style={{display:'none'}} preload="none" />
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>단어</th>
                        <th>의미</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map((row, index) => 
                    <tr 
                        key={row.id}
                        className={[
                            focus == index + 1 ? 'focused' : null,
                            index % 20 >= 10 ? 'theme' : null,
                        ].join(' ').trim()}>
                            <td>
                                {index + 1}
                            </td>
                            <Word id={row.id} checked={row.checked} passed={row.passed} dispatch={dispatchWords}>{row.word}</Word>
                            <td className="hidden" data-src={`/media/${cookie.get().path}/${row.chapter}/${row.id}.mp3`}>{row.bundle ? row.bundle : row.mean}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
        <footer>
            <Footer focus={focus} dispatch={dispatchWords} />
        </footer>
    </>
}