import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useOutletContext } from "react-router-dom";
import { Popup, Timer } from '../components';
import { useConfig } from '../utils';
import './101.scss';

function ConfigWindow(props: any) {
    const { study, setStudy, config, setConfig, configWindow, setConfigWindow, words } = props;

    
    const answer = (newWord: boolean) => (e:any) => {
        setConfigWindow('');
        const data = !newWord ? study[configWindow].data : words.words
        config.src = '/media/word/' + data[0].word + '.mp3';
        config.corrected = new Array(data.length);
        config.interval = config.defaultInterval;
        setStudy({ toggle: '뜻 맞추기', '뜻 맞추기': { data, config } });
    }


    return (
        <Popup onExit={(e) => { setConfigWindow('') }}>
            <div className="config">
                <div>
                    <label htmlFor="unit">반복 단위: </label> 
                    <input 
                        id="unit" 
                        type="number" 
                        style={{width: "3em"}}
                        value={config.recall} 
                        onChange={e => { setConfig({ recall: +e.target.value }) }} 
                    />
                </div>
                <div>
                    <label htmlFor="unit">제한 시간: </label> 
                    <input 
                        id="unit" 
                        type="number"
                        style={{width: "5em"}}
                        value={config.defaultInterval} 
                        onChange={e => { setConfig({ defaultInterval: +e.target.value }) }} 
                    />
                </div>
                <div>
                    <span>옵션: </span>
                    <input 
                        id="option1" 
                        type="checkbox" 
                        checked={config.erase} 
                        onChange={(e: any) => { setConfig({ erase: !config.erase } )}}
                    />
                    <label htmlFor="option1">지우기</label>
                </div>
                <div>
                    <button disabled={configWindow in study ? false : true} onClick={answer(false)}>기존 단어</button>
                    <button onClick={answer(true)}>새로운 단어</button>
                </div>
            </div> 
        </Popup>
    )
}

export default function word101(props: any) {
    const [words, setWords, study, setStudy]: any = useOutletContext();
    const [configWindow ,setConfigWindow] = useState('');
    const [logWindow, setLogWindow] = useState([]);
    const [config, setConfig] = useConfig({
        index: 0,
        toggle: false,
        recall: 0,
        erase: false,
        defaultInterval: 2000,
    })
    useEffect(() => {
        axios.get('api/get').then(({data}) => {
            console.log(data);
            setWords(data)
        })
    }, []);

    const showPopup = (type: string) => (e: any) => {
        setConfigWindow(type);
    }

    return (
        <>
            {configWindow ? <ConfigWindow
                study={study}
                setStudy={setStudy}
                config={config} 
                setConfig={setConfig}
                configWindow={configWindow}
                setConfigWindow={setConfigWindow}
                words={words}
            /> : null}
            {logWindow.length ? <Popup onExit={e => setLogWindow([])}>
                <div className="config">
                    <table>
                        <thead>
                            <tr>
                                <th>기록</th>
                                <th>시작</th>
                                <th>종료</th>
                                <th>시간</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logWindow.map((v:any, i:number) => <tr key={v.time}>
                                <td>{i+1}</td>
                                <td>{v.start}</td>
                                <td>{v.end}</td>
                                <td><Timer stop={true} defaultTime={v.spent}/></td>
                            </tr>)}
                            <tr>
                                <td>합계</td>
                                <td>{logWindow.reduce((pre: any, val: any) => pre > val.start ? pre : val.start, 0)}</td>
                                <td>{logWindow.reduce((pre: any, val: any) => pre < val.end ? pre : val.end, 100)}</td>
                                <td><Timer stop={true} defaultTime={logWindow.reduce((pre: any, val: any) => pre + val.spent, 0)} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Popup> : null}
            <button onClick={showPopup('뜻 맞추기')}>뜻 맞추기</button>
            <button onClick={() => { axios.get('/api/log').then(({ data }) => setLogWindow(data)) }}>기록</button>
        </>
    )
}