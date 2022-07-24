import React, { useState } from "react";
import './index.scss';
import axios from 'axios';
import Choose_mean from './choose_mean';
import Answer_mean from './answer_mean';
import Antonym_word from './antonym_word';
import { useConfig } from '../../utils';

export default function Study(props: any) {
    const {study, setStudy, setWords} = props;

    const exit = (e:any) => {
        axios('/api/get').then(({data}) => {
            setStudy({ toggle: null });
            setWords(data);
        })
    }

    const setConfig = (obj: any, options: { create? : boolean } = {}) => {
        let newConfig = options.create ? {} : Object.assign({}, study[study.toggle].config);
        for (let key in obj)
            newConfig[key] = obj[key];
        study[study.toggle].config = newConfig;
        setStudy(study)
    }

    if (study.toggle == '뜻 고르기') {
        return (
            <div className="study">
                <div className="board">
                    <Choose_mean data={study[study.toggle].data} config={study[study.toggle].config} setConfig={setConfig} />
                </div>
                <button className="exit" onClick={exit}>종료</button>
            </div>
        )
    } else if (study.toggle == '뜻 맞추기') {
        return (
            <div className="study">
                <div className="board">
                    <Answer_mean data={study[study.toggle].data} config={study[study.toggle].config} setConfig={setConfig} />
                </div>
                <button className="exit" onClick={exit}>종료</button>
            </div>
        )
    } else if (study.toggle == '반의어 찾기') {
        return (
            <div className="study">
                <div className="board">
                    <Antonym_word data={study[study.toggle].data} config={study[study.toggle].config} setConfig={setConfig} />
                </div>
                <button className="exit" onClick={exit}>종료</button>
            </div>
        ) 
    }
    
    else return null
}