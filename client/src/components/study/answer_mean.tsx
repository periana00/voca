import React, { useState, useEffect } from "react";
import { getIndex, useConfig } from "../../utils";
import { Bar, BarContainer } from "../bar";
import Timer from "../timer";
import axios from 'axios';

export default function Answer_mean(props: any) {
    const { data, config, setConfig } = props;
    const answer = data[config.index];
    // 처음 화면(실행) -> 답 보여줌 -> 다음 화면(실행) -> 답 보여줌 -> 다음 화면(실행) -> ....
    useEffect(() => {
        config.timeout = setTimeout(async () => {
            if (config.toggle) { 
                if (!config.corrected[config.index] && config.correct)
                    await axios.get(`/api/check${(config.erase ? 2 : 1)}/${answer.id}`);
                else if (!config.correct) {
                    await axios.get(`/api/reset/${answer.id}`);
                }
                config.corrected[config.index] = config.correct;
            }
            const newIndex = getIndex(config.corrected, config.index, 1, config.recall);
            setConfig({
                index: config.toggle ? newIndex : config.index,
                toggle: !config.toggle,
                interval: config.toggle ? config.defaultInterval : 1500,
                src: config.toggle ? '/media/word/' + data[newIndex].word + '.mp3' : '/media/mean/' + answer.mean.replace(';', ',') + '.mp3',
                corrected: config.corrected,
                correct: false,
            });
        }, config.interval);
        return () => clearTimeout(config.timeout);
    })

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
            interval: config.defaultInterval,
            index: newIndex,
            corrected: config.corrected,
            recall: config.recall,
            src: '/media/word/' + data[newIndex].word + '.mp3',
        })
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
                    max={config.interval}
                    type="time"
                    colorCallback={(val, max) => {
                        return `rgb(${val / max * 255}, ${255 - (val / max)**4 * 255}, 0)`
                    }}
                />
            </BarContainer>
            <Timer onExit={time => {
                axios.get(`/api/log/${time}`)
            }}/>
            <div><span>{config.index + 1} / {data.length}</span></div>
            <div>
                <span className="left-box">{numTrue}</span>
                <span> / </span>
                <span className="right-box">{numFalse}</span>
            </div>
            <div className="left-button" onClick={move(-1)}>{'<<'}</div>
            <div className="right-button" onClick={move(1)}>{'>>'}</div>
            <h2 onClick={check(answer)} style={{color: correct === true ? 'green' : correct === false ? 'red' : 'black' }}>{!config.toggle ? answer.word : answer.mean}</h2>
            <button onClick={go(true)} style={{ color: 'green' }}>맞음</button>
            <button onClick={go(false)} style={{ color: 'red' }}>틀림</button>
        </div>
    )
}