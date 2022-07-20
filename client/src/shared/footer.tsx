import React, { useEffect } from "react";
import './style/footer.scss';
import axios from "axios";


export default function Footer(props: any) {
    const { words, index, setIndex } = props;
    let lock = false

    const move = (offset:number) => (e:any) => {
        const newIndex = index + offset;
        console.log(words.length)
        if (newIndex > words.length || newIndex < 1) return
        setIndex(newIndex);
    }

    const check = (e:any) => {
        if (lock) return;
        lock = true;
        axios.get('api/check/' + words[index-1].id).then(data => {
            lock = false;
            const el = document.querySelector('tr.selected .word') as Element;
            if (el.classList.contains('checked')) {
                el.classList.remove('checked');
                el.classList.add('passed');
            } else if (el.classList.contains('passed')) {
                el.classList.remove('checked');
                el.classList.remove('passed');
            } else {
                el.classList.add('checked');
            }
        })
    }

    const look = (e:any) => {
        const audio = document.createElement('audio');
        audio.src = '/media/' + words[index-1].chapter + '/' + words[index-1].id + '.mp3';
        audio.play();
    }

    return (
        <footer className="controller">
            <div>
                <button onClick={move(-1)}>상</button>
                <button onClick={move(1)}>하</button>
            </div>
            <button onClick={check}>체크</button>
            <button onClick={look}>뜻 보기</button>
            <input key={index + 'selecter'} type="number" defaultValue={index} />
        </footer>
    )
}