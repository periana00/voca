import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import { Header, Main, Footer, Study } from './components';
import { useConfig } from './utils';

export default function App(props: any) {
    const [words, setWords]: any = useState({config: {start:1, end:1}, words: []});
    const [index, setIndex]: [number, Function] = useState(1);
    const [study, setStudy]: any = useConfig({});
    const [audio] = useState(new Audio());

    return (
        <>
            <Study study={study} setStudy={setStudy} setWords={setWords} />
            <Header config={words.config} setWords={setWords}>
                <Outlet context={[ words, setWords, study, setStudy ]} />
            </Header>
            <Main words={words.words} config={words.config} index={index} />
            <Footer audio={audio} words={words.words} index={index} setIndex={setIndex} />
        </>
    )
}