import React, { useState, useEffect } from "react";
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


export default function Choose_mean(props: any) {
    const { study, index, setIndex } = props;

    let lock = false;
    let timeout: any = null;

    useEffect(() => {
        return () => {
            clearTimeout(timeout);
            let el = document.querySelector('.no');
            if (el) el.classList.remove('no');
            el = document.querySelector('.yes');
            if (el) el.classList.remove('yes');
            el = document.querySelector('.over');
            if (el) el.classList.remove('over');
        }
    })

    const check = (ans: any, word: any) => (e: any) => {
        if (lock) return;
        lock=true;
        clearTimeout(timeout);
        if (ans.word != word.word) {
            e.target.classList.add('no');
            (document.querySelector('.ans') as Element).classList.add('over');
            (document.querySelector('.voice-mean') as HTMLAudioElement).play();
            timeout = setTimeout(() => {
                ans.status = 0;
                axios.get('api/reset/' + ans.id).then(data => {
                    const result = check_can_pass(index, study.data)
                    if (result) {
                        setIndex(index + result)
                    } else {
                        // 끝나고 결과 보여 줘야 함
                    }
                })
            }, 1000)
        }
        else {
            e.target.classList.add('yes');
            timeout = setTimeout(() => {
                if (ans.status < 2) {
                    ans.status += 1;
                    axios.get('api/check/' + ans.id).then(data => {
                        const result = check_can_pass(index, study.data)
                        if (result) {
                            setIndex(index + result)
                        } else {
                            // 끝나고 결과 보여 줘야 함
                        }
                    });
                } else {
                    const result = check_can_pass(index, study.data)
                    if (result) {
                        setIndex(index + result)
                    } else {
                        // 끝나고 결과 보여 줘야 함
                    }
                }
            }, 300)
        }
    }


    const {words, word} = study.data[index];

    timeout = setTimeout(() => {
        lock = true;
        (document.querySelector('.ans') as Element).classList.add('over');
        (document.querySelector('.voice-mean') as HTMLAudioElement).play();
        timeout = setTimeout(() => {
            word.status = 0;
            axios.get('api/reset/' + word.id).then(data => {
                const result = check_can_pass(index, study.data)
                if (result) {
                    setIndex(index + result)
                } else {
                    // 끝나고 결과 보여 줘야 함
                }
            })
        }, 1000)
    }, 2500)

    const move = (val: number) => (e:any) => {
        if (index + val >= 0 && index + val < study.data.length) {
            setIndex(index + val);
        }
    }


    return (
        <div className="content">
            <audio className="voice-word" style={{display:"none"}} src={'/media/word/' + word.word + '.mp3'} autoPlay={true}></audio>
            <audio className="voice-mean" style={{display:"none"}} src={word.bundle ? '/media/bundle/' + word.bundle + '.mp3' : '/media/mean/' + word.mean + '.mp3'} autoPlay={false}></audio>
            <div>
                <button onClick={move(-(index%10 || 10))}>이전</button>
                <button onClick={move(10-(index%10))}>다음</button>
            </div>
            <h2>{word.word}</h2>
            {words.map((v:any) => <h3 key={v.id} className={word.word == v.word ? 'ans' : undefined} onClick={check(word, v)}>{v.bundle || v.mean}</h3>)}
        </div>
    )
}