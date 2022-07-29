import React, { useEffect, useState } from "react";
import './style/bar.scss';

export const BarContainer = (props: any) => {
    return (
        <div className='bar-wrapper'>
            {props.children}
        </div>
    )
}

export const Bar = (props: {
    max: number, 
    type?: string,
    defaultValue?: number,
    colorCallback?: (val: number, max:number) => string
}) => {
    const { max, defaultValue, colorCallback, type } = props;
    const [ val, setVal ] = useState(0);
    // time
    useEffect(() => {
        if (type === 'time') {
            let frame = 0;
            let stop = false;
            const start = Date.now();
            const step = () => {
                if (stop) return;
                if (Date.now() - start > max) stop = true;
                setVal(Date.now() - start);
                frame = requestAnimationFrame(step);
                
            }
            frame = requestAnimationFrame(step);
            return () => cancelAnimationFrame(frame);
        }
    }, [])
    return (
        <div className="bar">
            <div style={{
                width: (defaultValue || val) / max * 100 + '%',
                height: '100%',
                maxWidth: '100%',
                backgroundColor: colorCallback ? colorCallback(val, max) : 'cyan',
            }}></div>
        </div>
    )
}
