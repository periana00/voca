import React, { useState, useEffect } from "react";
import { getIndex, useConfig } from "../../utils";
import { Bar, BarContainer } from "../bar";
import Timer from "../timer";
import axios from 'axios';

export default function Antonym_word(props: any) {
    const { data, config, setConfig } = props;
    let { answer, words } = data[config.index];
    const question = words[0];
    words = words.slice(1);


    // 처음 화면(실행) -> 답 보여줌 -> 다음 화면(실행) -> 답 보여줌 -> 다음 화면(실행) -> ....
    useEffect(() => {
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
                interval: config.toggle ? config.defaultInterval : 1500,
                src: config.toggle ? 
                    '/media/word/' + data[newIndex].words[0].word + '.mp3':
                    '/media/word/' + answer.word + '.mp3',
                yes: -1,
                no: -1,
                over: config.toggle ? -1 : words.findIndex((v:any) => v.word == answer.word),
                corrected: config.corrected,
                correct: false,
            })
        }, config.interval);
        return () => clearTimeout(config.timeout);
    });

    const check = (choosed: any) => (e:any) => {
        const correct = answer.word == choosed.word;
        setConfig({
            toggle: true,
            interval: correct ? 500 : 2000,
            src: !correct ? '/media/word/' + answer.word + '.mp3' : null,
            yes: answer.word == choosed.word ? words.findIndex((v: any) => v.word == choosed.word) : -1,
            no: answer.word == choosed.word ? -1 : words.findIndex((v: any) => v.word == choosed.word),
            over: answer.word == choosed.word ? -1 : words.findIndex((v: any) => v.word == answer.word),
            correct,
        });
    }

    const move = (index: number) => (e: any) => {
        const newIndex = getIndex(config.corrected, config.index, index, config.recall);
        setConfig({
            toggle: false,
            interval: config.defaultInterval,
            index: newIndex,
            recall: config.recall,
            corrected: config.corrected,
            src: '/media/word/' + data[newIndex].words[0].word + '.mp3',
        })
    }

    let numTrue = config.corrected.filter((e:boolean) => e === true).length;
    let numFalse = config.corrected.filter((e:boolean) => e === false).length;

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
            <Timer onExit={time => {
                axios.get(`/api/log/${time}`)
            }}/>
            <div className="left-button" onClick={move(-1)}>{'<<'}</div>
            <div className="right-button" onClick={move(1)}>{'>>'}</div>
            <div><span>{config.index + 1} / {data.length}</span></div>
            <div>
                <span className="left-box">{numTrue}</span>
                <span> / </span>
                <span className="right-box">{numFalse}</span>
            </div>
            <h2>{config.toggle ? question.word + ': ' + question.bundle : question.word}</h2>
            {words.map( (el: any, i: number) => 
            <h3
                key={el.id}
                onClick={check(el)}
                className={!config.toggle ? undefined : config.yes == i ? 'yes' : config.no == i ? 'no' : config.over == i ? 'over' : undefined }
            >
                {config.toggle ? el.word + ': ' + el.bundle : el.word}
            </h3> )}
        </div>
    )
}