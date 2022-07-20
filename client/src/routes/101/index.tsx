import React, { useEffect, useState } from "react";
import axios from 'axios';
import Header from './header';
import Main from './main';
import './index.scss';

export default function word101() {
    const [words, setWords] = useState({config: {start:1, end:1}, words: []});
    useEffect(() => {
        axios.get('api/get').then(({data}) => {
            console.log(data);
            setWords(data)
        })
    }, []);

    return (
        <div className="word-101">
            <Header config={words.config} setWords={setWords}/>
            <Main words={words.words}/>
        </div>
    )
}