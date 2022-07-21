import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useOutletContext } from "react-router-dom";

export default function word101(props: any) {
    const [words, setWords, study, setStudy]: any = useOutletContext();
    useEffect(() => {
        console.log('101 useEffect once');
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

    const answer = (e:any) => {
        setStudy({ type:'뜻 맞추기', data:words.words });
    }

    return (
        <>
            <button onClick={choose}>뜻 고르기</button>
            <button onClick={answer}>뜻 맞추기</button>
        </>
    )
}