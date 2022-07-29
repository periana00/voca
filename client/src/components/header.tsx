import React, { useEffect } from "react";
import axios from "axios";
import './style/header.scss'

export default function Header(props: any) {
    const {config, setWords, setStudy, children} = props

    const load = (type: string) => (e: any) => {
        const dict: { [key: string]: number } = {}
        dict[type] = +e.target.value
        axios.post('/api/set', dict).then(({data}) => {
            setWords(data);
        })
    }
    const sort = (e:any) => {
        axios.get('/api/sort').then(({data}) => {
            setWords(data);
        })
    }
    const reset = (e:any) => {
        axios.get('/api/reset').then(({data}) => {
            setWords(data);
        })
    }

    return <header>
        <input key={config.start + 'start'} type="number" defaultValue={config.start} onBlur={load('start')}></input>
        <input key={config.end + 'end'} type="number" defaultValue={config.end} onBlur={load('end')}></input>
        <button onClick={sort}>섞기</button>
        <button onClick={reset}>초기화</button>
        {children}
    </header>
}