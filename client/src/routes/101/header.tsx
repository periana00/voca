import React, { useEffect } from "react";
import axios from "axios";

export default function Header(props: any) {
    const load = (type: string) => (e: any) => {
        const dict: { [key: string]: number } = {}
        dict[type] = +e.target.value
        axios.post('/api/set', dict).then(({data}) => {
            props.setWords(data);
        })
    }
    const sort = (e:any) => {
        axios.get('/api/sort').then(({data}) => {
            props.setWords(data);
        })
    }
    const reset = (e:any) => {
        axios.get('/api/reset').then(({data}) => {
            props.setWords(data);
        })
    }

    return <header>
        <input key={props.config.start + 'start'} type="number" defaultValue={props.config.start} onBlur={load('start')}></input>
        <input key={props.config.end + 'end'} type="number" defaultValue={props.config.end} onBlur={load('end')}></input>
        <button onClick={sort}>섞기</button>
        <button onClick={reset}>초기화</button>
    </header>
}