import React, { useState, useEffect } from "react";
import axios from 'axios';

function check_can_pass(index: number, data: any) {
    // 10번째 단어가 아니고 마지막 단어도 아닌 경우 1 증가
    if (index % 10 != 9 && index != data.length - 1) return 1;
    const start = index - index % 10;
    const end = index + 1;
    for (let word of data.slice(start, end)) {
        // 못 맞춘 단어가 있는 경우 10으로 나눈 나머지만큼 감소
        if (!word.status) return -(index%10);
    }
    // 다 맞춘 경우 1 증가, 마지막이면 false 반환
    return index == data.length - 1 ? false : 1;
}

export default function Answer_mean(props: any) {
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
    });

    const move = (val: number) => (e:any) => {
        if (index + val >= 0 && index + val < study.data.length) {
            setIndex(index + val);
        }
    };


    const words = study.data[index];

    const check = (q: any, a: any) => (e: any) => {
        if (lock) return
        lock = true
        if (q.category == a.category) { // 반의어가 아니므로 오답
            e.target.classList.add('no');        
            (document.querySelector('.ans') as Element).classList.add('over');
            timeout = setTimeout(() => {
                axios.get('api/reset/' + a.id).then(data => {
                    const result = check_can_pass(index, study.data);
                    if (result) {
                        setIndex(index + result)
                    }
                })
            }, 500);
        } else {
            e.target.classList.add('yes');
            timeout = setTimeout(() => {
                axios.get('api/check/' + a.id).then(data => {
                    const result = check_can_pass(index, study.data);
                    if (result) {
                        setIndex(index + result)
                    }
                })
            }, 500);
        }
    };

    
    timeout = setTimeout(() => {
        if (lock) return;
        lock = true;
        (document.querySelector('.ans') as Element).classList.add('over');
        timeout = setTimeout(() => {
            let a = words.find((v:any) => v.category != words[0].category);
            axios.get('api/reset/' + a.id).then(data => {
                const result = check_can_pass(index, study.data);
                if (result) {
                    setIndex(index + result)
                }
            })
        }, 500);
    }, 3000);

    return (
        <div className="content">
            <div>
                <button onClick={move(-(index%10 || 10))}>이전</button>
                <button onClick={move(10-(index%10))}>다음</button>
            </div>
            <h2>{words[0].word}</h2>
            {words.slice(1).map((v:any) => <h3 key={v.id} className={words[0].category != v.category ? 'ans' : undefined} onClick={check(words[0], v)}>{v.word}</h3>)}
        </div>
    )
}