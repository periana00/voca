import React, { useState, useEffect } from "react";
import { getIndex, useConfig, } from "../../utils";
import { Bar, BarContainer } from '../bar';
import axios from 'axios';

export default function Choose_mean(props: any) {
    const { data, config, setConfig } = props;
    const { answer, words } = config.index == -1 ? data[0] : data[config.index];

    // 처음 화면(실행) -> 답 보여줌 -> 다음 화면(실행) -> 답 보여줌 -> 다음 화면(실행) -> ....
    useEffect(() => {
        if (config.index == -1) return () => clearTimeout(config.timeout);
        config.timeout = setTimeout(async () => {
            if (config.toggle) { 
                if (!config.corrected[config.index] && config.correct)
                    await axios.get('/api/check/' + answer.id);
                else if (!config.correct) {
                    await axios.get('/api/reset/' + answer.id);
                }
                config.corrected[config.index] = config.correct;
            }
            const newIndex = getIndex(config.corrected, config.index, 1, config.recall);
            setConfig({
                index: config.toggle ? newIndex : config.index,
                toggle: !config.toggle,
                interval: config.toggle ? 3000 : 1500,
                src: config.toggle ? '/media/word/' + data[newIndex == -1 ? 0 : newIndex].answer.word + '.mp3' :
                        answer.bundle ? '/media/bundle/' + answer.bundle + '.mp3' : 
                            '/media/mean/' + answer.mean.replace(';', ',') + '.mp3',
                yes: -1,
                no: -1,
                over: config.toggle ? -1 : words.findIndex((v:any) => v.word == answer.word),
                corrected: config.corrected,
                correct: false,
            });
        }, config.interval);
        return () => clearTimeout(config.timeout);
    })

    // 기본 화면, 이걸 안해주면 아이폰에서 오디오가 재생되질 않음
    if (config.index == -1) {
        clearTimeout(config.timeout);
        let numTrue, numFalse;
        if (config.corrected) {
            numTrue = config.corrected.filter((e:boolean) => e === true).length;
            numFalse = config.corrected.filter((e:boolean) => e === false).length;
        }
        let recall = 0;
        return <div className="content">
            {config.corrected ? <div>
                <span className="left-box">{numTrue}</span>
                <span> / </span>
                <span className="right-box">{numFalse}</span>
            </div> : null}
            <span>반복 구간</span>
            <input type="number" onChange={(e:any) => { recall = e.target.value }} />
            <div>
                <button onClick={(e:any) => setConfig({
                    index: 0,
                    toogle: false,
                    interval: 3000,
                    recall,
                    src: '/media/word/' + data[0].answer.word + '.mp3',
                    corrected: config.corrected || new Array(data.length),
                })}>시작</button>
            </div>
        </div>
    }

    const check = (choosed: any) => (e:any) => { // 색 바꾸기
        const correct = answer.word == choosed.word;
        setConfig({
            toggle: true,
            interval: correct ? 500 : 1500,
            src: !correct ?
                        answer.bundle ? 
                            '/media/bundle/' + answer.bundle + '.mp3' : 
                            '/media/mean/' + answer.mean.replace(';', ',') + '.mp3' :
                        null,
            yes: correct ? words.findIndex((v: any) => v.word == choosed.word) : -1,
            no: correct ? -1 : words.findIndex((v: any) => v.word == choosed.word),
            over: correct ? -1 : words.findIndex((v: any) => v.word == answer.word),
            correct,
        });
    }

    const move = (index: number) => (e: any) => { // 인덱스 바꾸기
        const newIndex = getIndex(config.corrected, config.index, index, config.recall);
        setConfig({
            toggle: false,
            interval: 3000,
            index: newIndex,
            recall: config.recall,
            corrected: config.corrected,
            src: '/media/word/' + data[newIndex == 1 ? 0 : newIndex].answer.word + '.mp3',
        }, {create:true})
    }

    let numTrue = config.corrected.filter((e:boolean) => e === true).length;
    let numFalse = config.corrected.filter((e:boolean) => e === false).length;
    let correct = config.corrected[config.index]

    return (
        <div className="content">
            <audio src={config.src} autoPlay={true} style={{display: 'none'}} />
            <BarContainer>
                <Bar max={data.length} defaultValue={config.index+1} />
                <Bar 
                    key={Date.now()}
                    max={config.interval}
                    type="time"
                    colorCallback={(val, max) => {
                        return `rgb(${val / max * 255}, ${255 - val**2 / max**2 * 255}, 0)`
                    }}
                />
            </BarContainer>
            <div><span>{config.index + 1} / {data.length}</span></div>
            <div>
                <span className="left-box">{numTrue}</span>
                <span> / </span>
                <span className="right-box">{numFalse}</span>
            </div>
            <div className="left-button" onClick={move(-10)}>{'<<'}</div>
            <div className="right-button" onClick={move(10)}>{'>>'}</div>
            <h2 style={{color: correct === true ? 'green' : correct === false ? 'red' : 'black' }}>{answer.word}</h2>
            {words.map( (word: any, i: number) => 
            <h3
                key={word.id}
                onClick={check(word)}
                className={config.yes == i ? 'yes' : config.no == i ? 'no' : config.over == i ? 'over' : undefined }
            >
                {word.bundle || word.mean}
            </h3> )}
            <div>
                <button onClick={move(-1)}>이전</button>
                <button onClick={move(1)}>다음</button>
            </div>
        </div>
    )
}