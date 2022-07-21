import React, { useState } from "react";
import './index.scss';
import axios from 'axios';
import Choose_mean from './choose_mean';
import Answer_mean from './answer_mean';
import Antonym_word from './antonym_word';

export default function Study(props: any) {
    const {study, setStudy, setWords} = props;
    const [index, setIndex]: any = useState(0);

    

    const exit = (e:any) => {
        axios('/api/get').then(({data}) => {
            setIndex(0);
            setStudy({type: null, data: []});
            setWords(data);
        })
    }

    if (study.type == '뜻 고르기') {
        return (
            <div className="study">
                <button onClick={exit}>종료</button>
                <div className="board">
                    <div className="progress"><div style={{width: index+1 / study.data.length * 100 + '%'}}></div></div>
                    <div><span>{index + 1} / {study.data.length}</span></div>
                    <Choose_mean study={study} index={index} setIndex={setIndex} />
                </div>
            </div>
        )
    } else if (study.type == '뜻 맞추기') {
        return (
            <div className="study">
                <button onClick={exit}>종료</button>
                <div className="board">
                    <div className="progress"><div style={{width: index+1 / study.data.length * 100 + '%'}}></div></div>
                    <div><span>{index + 1} / {study.data.length}</span></div>
                    <Answer_mean study={study} index={index} setIndex={setIndex} />
                </div>
            </div>
        )
    } else if (study.type == '반의어 찾기') {
        return (
            <div className="study">
                <button onClick={exit}>종료</button>
                <div className="board">
                    <div className="progress"><div style={{width: index+1 / study.data.length * 100 + '%'}}></div></div>
                    <div><span>{index + 1} / {study.data.length}</span></div>
                    <Antonym_word study={study} index={index} setIndex={setIndex} />
                </div>
            </div>
        ) 
    }
    
    else return null
}