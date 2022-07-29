import React, { useState, useEffect, useRef } from "react";
import './style/timer.scss';

export default function Timer(props: {
    onExit?: (time:number) => any,
    stop?: boolean,
    defaultTime?: number,
}) {
    const {onExit,stop, defaultTime} = props;
    const [time, setTime] = useState(defaultTime || 0);

    useEffect(() => {
        if (!stop) {
            let frame = 0;
            const start = Date.now();
            const step = () => {
                const newVal = Date.now() - start;
                if (newVal - time >= 1000) {
                    setTime(newVal);
                }
                frame = requestAnimationFrame(step);
            }
            frame = requestAnimationFrame(step);
            return () => {
                const newVal = Date.now() - start;
                cancelAnimationFrame(frame);
                onExit && onExit(newVal);
            }
        }
    }, [])
    
    return <div>
        {`${(Math.floor(time / 1000 / 60 / 60) % 24).toString().padStart(2, '0')}:${(Math.floor(time / 1000 / 60) % 60).toString().padStart(2, '0')}:${(Math.floor(time / 1000) % 60).toString().padStart(2, '0')}`}
    </div>

}