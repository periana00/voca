import React, { useEffect, useState } from "react";
import axios from 'axios';
// import './index.scss';
import { useOutletContext } from "react-router-dom";

export default function word101(props: any) {
    const [words, setWords, study, setStudy]: any = useOutletContext();
    useEffect(() => {
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
    const antonym = (e:any) => {
        if ('반의어 찾기' in study && !confirm('기존의 단어가 존재합니다. 새로운 단어를 불러오시겠습니까?')) {
            setStudy({ toggle: '반의어 찾기' });
        } else {
            axios.get('/api/antonym_word').then(({data}) => {
                setStudy({ toggle: '반의어 찾기', '반의어 찾기': { data, config: { index: -1, toggle: false, }} });
            });
        }
    }

    return (
        <>
            <button onClick={choose}>뜻 고르기</button>
            <button onClick={antonym}>반의어 찾기</button>
        </>
    )
}