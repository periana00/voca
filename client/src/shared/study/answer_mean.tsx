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
        }
    });

    const move = (val: number) => (e:any) => {
        if (index + val >= 0 && index + val < study.data.length) {
            setIndex(index + val);
        }
    };

    const toggle = (word: string, mean: string) => (e: any) => {
        e.target.textContent = e.target.textContent == word ? mean : word;
    }

    const check = (type: boolean) => (e:any) => {
        if (lock) return
        lock = true
        if (type) {
            if (study.data[index].status < 2) {
                axios.get('api/check/' + study.data[index].id).then(data => {
                    study.data[index].status += 1
                    const result = check_can_pass(index, study.data);
                    if (result) {
                        setIndex(index + result)
                    }
                })
            } else {
                const result = check_can_pass(index, study.data);
                if (result) {
                    setIndex(index + result)
                }
            }
        } else {
            axios.get('api/reset/' + study.data[index].id).then(data => {
                const result = check_can_pass(index, study.data);
                if (result) {
                    setIndex(index + result)
                }
            })
        }
    }

    timeout = setTimeout(() => {
        if (lock) return;
        lock = true;
        (document.querySelector('.content h2') as Element).textContent = study.data[index].bundle || study.data[index].mean;
        timeout = setTimeout(() => {
            lock = false;
            (document.querySelector('.content .wrong') as HTMLButtonElement).click();
        }, 500)
    }, 3000);

    return (
        <div className="content">
            <div>
                <button onClick={move(-(index%10 || 10))}>이전</button>
                <button onClick={move(10-(index%10))}>다음</button>
            </div>
            <h2 onClick={toggle(study.data[index].word, study.data[index].bundle || study.data[index].mean)}>{study.data[index].word}</h2>
            <button onClick={check(true)}>맞음</button>
            <button className="wrong" onClick={check(false)}>틀림</button>
        </div>
    )
}