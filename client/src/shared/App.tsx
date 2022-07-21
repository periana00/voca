import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import Header from './header';
import Main from './main';
import Footer from './footer';
import Study from './study';

export default function App(props: any) {
    const [words, setWords]: any = useState({config: {start:1, end:1}, words: []});
    const [index, setIndex]: [number, Function] = useState(1);
    const [study, setStudy]: any = useState({type: null, data: []});

    return (
        <>
            <Study study={study} setStudy={setStudy} />
            <Header config={words.config} setWords={setWords} setStudy={setStudy}/>
            <Main words={words.words} index={index} />
            <Footer words={words.words} index={index} setIndex={setIndex} />
            <Outlet context={[words, setWords]} />
        </>
    )
}