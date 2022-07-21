import React, { useState } from "react";
import './index.scss';
import axios from 'axios';


function check_can_pass(index: number, data: any) {
    // 10번째 단어가 아니고 마지막 단어도 아닌 경우 1 증가
    if (index % 10 != 9 && index != data.length - 1) return 1;
    const start = index - index % 10;
    const end = index + 1;
    for (let {word} of data.slice(start, end)) {
        // 못 맞춘 단어가 있는 경우 10으로 나눈 나머지만큼 감소
        if (!word.status) return -(index%10);
    }
    // 다 맞춘 경우 1 증가, 마지막이면 false 반환
    return index == data.length - 1 ? false : 1;
}


export default function Study(props: any) {
    const {study, setStudy} = props;
    const [index, setIndex]: any = useState(0);
    let lock = false;
    let timeout: any = null;

    const check = (ans: any, word: any) => (e: any) => {
        if (lock) return;
        lock=true;
        clearTimeout(timeout);
        if (ans.word != word.word) {
            e.target.classList.add('no');
            (document.querySelector('.ans') as Element).classList.add('over');
            timeout = setTimeout(() => {
                ans.status = 0;
                axios.get('api/reset/' + ans.id).then(data => {
                    (document.querySelector('.ans') as Element).classList.remove('over');
                    e.target.classList.remove('no');
                    const result = check_can_pass(index, study.data)
                    if (result) {
                        setIndex(index + result)
                    } else {
                        // 끝나고 결과 보여 줘야 함
                    }
                })
            }, 500)
        }
        else {
            e.target.classList.add('yes');
            timeout = setTimeout(() => {
                if (ans.status < 2) {
                    ans.status += 1;
                    axios.get('api/check/' + ans.id).then(data => {
                        e.target.classList.remove('yes');
                        const result = check_can_pass(index, study.data)
                        if (result) {
                            setIndex(index + result)
                        } else {
                            // 끝나고 결과 보여 줘야 함
                        }
                    });
                } else {
                    e.target.classList.remove('yes');
                    const result = check_can_pass(index, study.data)
                    if (result) {
                        setIndex(index + result)
                    } else {
                        // 끝나고 결과 보여 줘야 함
                    }
                }
            }, 500)
        }
    }


    const exit = (e:any) => {
        clearTimeout(timeout);
        setStudy([]);
    }

    if (study.type == '뜻 고르기') {
        const {words, word} = study.data[index];

        timeout = setTimeout(() => {
            lock = true;
            (document.querySelector('.ans') as Element).classList.add('over');
            timeout = setTimeout(() => {
                word.status = 0;
                axios.get('api/reset/' + word.id).then(data => {
                    (document.querySelector('.ans') as Element).classList.remove('over');
                    const result = check_can_pass(index, study.data)
                    if (result) {
                        setIndex(index + result)
                    } else {
                        // 끝나고 결과 보여 줘야 함
                    }
                })
            }, 500)
        }, 2500)

        return (
            <div className="study">
                <button onClick={exit}>종료</button>
                <div className="board">
                    <div className="progress"><div style={{width: index / study.data.length * 100 + '%'}}></div></div>
                    <div><span>{index + 1} / {study.data.length}</span></div>
                    <div>
                        <button>이전</button>
                        <button>다음</button>
                    </div>
                    <h2>{word.word}</h2>
                    {words.map((v:any) => <h3 key={v.id} className={word.word == v.word ? 'ans' : undefined} onClick={check(word, v)}>{v.bundle || v.mean}</h3>)}
                </div>
            </div>
        )
    } else return null
}