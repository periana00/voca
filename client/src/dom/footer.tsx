import React from 'react';


export default function Footer(props: any) {
    const { focus, dispatch } = props;

    function onChange(e: any) {
        dispatch({ type:'change', value: +e.target.value });
    }

    function onClick(val: number) {
        return () => dispatch({ type: val > 0 ? 'down' : 'up'});       
    }

    function view() {
        const el = document.querySelector('.focused').querySelectorAll('td')[2]
        el.classList.toggle('hidden');
        setTimeout(() => {
            el.classList.toggle('hidden');
        }, 1000);

        const el2 = document.querySelector('audio');
        el2.src = el.dataset.src;
        el2.play();
    }
    function check() {
        document.querySelector('.focused').querySelectorAll('td')[1].click();
    }

    return <>
        <button onClick={onClick(-1)}>↑</button>
        <button onClick={onClick(1)}>↓</button>
        <button onClick={check}>체크</button>
        <button onClick={view}>뜻 보기</button>
        <input type="number" pattern="[0-9]*" value={focus} onChange={onChange} onFocus={(e) => e.target.select()} />
    </>
}
