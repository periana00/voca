import React, { useEffect, useState } from "react";
import axios from 'axios';
// import './index.scss';
import { useOutletContext } from "react-router-dom";

export default function word101(props: any) {
    const [words, setWords, study, setStudy]: any = useOutletContext();
    useEffect(() => {
        console.log('301 useEffect once');
        axios.get('api/get').then(({data}) => {
            console.log(data);
            setWords(data)
        })
    }, []);

    const choose = (e:any) => {
        axios.get('/api/choose_mean').then(({data}) => {
            setStudy({ type:'뜻 고르기', data });
        })
    }
    const antonym = (e:any) => {
        axios.get('/api/antonym_word').then(({data}) => {
            setStudy({ type:'반의어 찾기', data});
        })
    }

    return (
        <>
            <button onClick={choose}>뜻 고르기</button>
            <button onClick={antonym}>반의어 찾기</button>
        </>
    )
}