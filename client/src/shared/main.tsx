import React, { useEffect } from "react";
import axios from "axios";
import './style/main.scss';

export default function Main(props: any) {
    let lock = false

    const { index } = props;

    
    useEffect(() => {
        const el = document.querySelector('.selected');
        el && el.scrollIntoView({ block: 'center' })
    }, [index])

    const check = (word:any) => (e:any) => {
        if (lock) return
        lock = true
        axios.get('api/check/' + word.id).then(data => {
            lock = false
            if (e.target.classList.contains('checked')) {
                e.target.classList.remove('checked');
                e.target.classList.add('passed');
            } else if (e.target.classList.contains('passed')) {
                e.target.classList.remove('checked');
                e.target.classList.remove('passed');
            } else {
                e.target.classList.add('checked');
            }
        })
    }

    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>단어</th>
                    <th>의미</th>
                </tr>
            </thead>
            <tbody>
                {props.words.map((v:any, i:number) => <tr key={v.id} className={index == i+1 ? 'selected': undefined}>
                    <td className="index">{i+1}</td>
                    <td className={v.status ? "word checked" : "word"} onClick={check(v)}>{v.word}</td>
                    <td className="mean blind">{v.bundle || v.mean}</td>
                </tr>)}
            </tbody>
        </table>
    )
}