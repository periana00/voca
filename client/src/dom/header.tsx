import React from 'react';


export default function Header(props: any) {
    const { dispatch, cookie } = props;

    function onChange(type: string) {
        return async (e: any) => {
            let val = e.target.value;
            if (!val || val < 1) val = 0;
            const cookies = cookie.get();
            cookies[type] = val;
            // if (cookies.min > cookies.max) return;
            cookie.set(cookies);
            const res = await fetch(window.location.href + '/api/words');
            const data = await res.json();
            dispatch({ type: 'setWords', words: data });
        }
    }

    function onclick(type: string) {
        return async (e: any) => {
            const cookies = cookie.get();
            cookies[type] = +cookies[type] ? 0 : 1;
            cookie.set(cookies);
            const res = await fetch(window.location.href + '/api/words');
            const data = await res.json();
            dispatch({ type: 'setWords', words: data });
        }
    }

    return <>
        <input type="number" pattern="[0-9]*" value={cookie.get().min} onChange={onChange('min')} onFocus={(e) => e.target.select()} />
        <input type="number" pattern="[0-9]*" value={cookie.get().max} onChange={onChange('max')} onFocus={(e) => e.target.select()} />
        <button className={cookie.get().random ? 'selected' : null} onClick={onclick('random')}>랜덤</button>
        <button onClick={onclick('sort')}>섞기</button>
        <button className={cookie.get().checked ? 'selected' : null} onClick={onclick('checked')}>체크필터</button>
        <button className={cookie.get().passed ? 'selected' : null} onClick={onclick('passed')}>패스필터</button>
        <button onClick={onclick('reset')}>초기화</button>
    </>
}