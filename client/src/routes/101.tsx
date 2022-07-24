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
        if ('뜻 고르기' in study && !confirm('기존의 단어가 존재합니다. 새로운 단어를 불러오시겠습니까?')) {
            setStudy({  toggle: '뜻 고르기' });
        } else {
            axios.get('/api/choose_mean').then(({data}) => {
                setStudy({ toggle: '뜻 고르기', '뜻 고르기': { data, config: { index: -1, toggle: false, }} });
            });
        }
    }

    const answer = (e:any) => {
        if ('뜻 맞추기' in study && !confirm('기존의 단어가 존재합니다. 새로운 단어를 불러오시겠습니까?')) {
            setStudy({ toggle: '뜻 맞추기' });
        } else {
            setStudy({ toggle: '뜻 맞추기', '뜻 맞추기': { data: words.words, config: { index: -1, toggle: false, } } } );
        }
    }

    return (
        <>
            <button onClick={choose}>뜻 고르기</button>
            <button onClick={answer}>뜻 맞추기</button>
        </>
    )
}