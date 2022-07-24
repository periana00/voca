import React, { useState, useEffect } from "react";
import { getIndex, useConfig, Bar, BarContainer } from "../../utils";
import axios from 'axios';

export default function Answer_mean(props: any) {
    const { data, config, setConfig } = props;
    const answer = config.index == -1 ? data[0] : data[config.index];
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
                interval: config.toggle ? 2000 : 1500,
                src: config.toggle ? '/media/word/' + data[newIndex == -1 ? 0 : newIndex].word + '.mp3' : '/media/mean/' + answer.mean.replace(';', ',') + '.mp3',
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
                    interval: 2000,
                    recall,
                    src: '/media/word/' + data[0].word + '.mp3',
                    corrected: config.corrected || new Array(data.length),
                })}>시작</button>
            </div>
        </div>
    }

    const check = (choosed: any) => (e:any) => { // 색 바꾸기
        if (e.target.textContent == choosed.mean) {
            e.target.textContent = choosed.word;
        } else {
            e.target.textContent = choosed.mean;
        }
    }

    const move = (index: number) => (e: any) => { // 인덱스 바꾸기
        const newIndex = getIndex(config.corrected, config.index, index, 0);
        setConfig({
            toggle: false,
            interval: 2000,
            index: newIndex,
            corrected: config.corrected,
            recall: config.recall,
            src: '/media/word/' + data[newIndex == -1 ? 0 : newIndex].word + '.mp3',
        }, {create:true})
    }

    const go = (correct: boolean) => (e: any) => {
        if (config.toggle) return;
        setConfig({
            toggle: true,
            interval: correct ? 300 : 1500,
            corrected: config.corrected,
            src: correct ? null : '/media/mean/' + answer.mean.replace(';', ',') + '.mp3',
            correct,
        });
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
                    effectCallback={(setVal => {
                        let index = 0;
                        const d = Date.now();
                        const step = () => {
                            setVal([Date.now() - d, config.interval]);
                            index = requestAnimationFrame(step);
                        }
                        index = requestAnimationFrame(step);
                        return () => cancelAnimationFrame(index);
                    })}
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
            <div className="left-button" onClick={move(-1)}>{'<<'}</div>
            <div className="right-button" onClick={move(1)}>{'>>'}</div>
            <h2 onClick={check(answer)} style={{color: correct === true ? 'green' : correct === false ? 'red' : 'black' }}>{!config.toggle ? answer.word : answer.mean}</h2>
            <button onClick={go(true)}>맞음</button>
            <button onClick={go(false)}>틀림</button>
        </div>
    )
}