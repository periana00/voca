import React, { useEffect, useState } from 'react';

export const useAudio = () => {
    const [audio] = useState(new Audio());
    const [src, setSrc] = useState('');

    useEffect(() => {
        console.log(decodeURIComponent(src));
        audio.src = src;
        audio.play();
    }, [src])

    return [setSrc]
}


export const useConfig = (obj: any) => {
    const [config, setConfig] = useState(obj);

    const wapper = (obj: any, options: { create? : boolean } = {}) => {
        let newConfig = options.create ? {} : Object.assign({}, config);
        for (let key in obj)
            newConfig[key] = obj[key];
        setConfig(newConfig);
    }

    return [config, wapper];
}

export const BarContainer = (props: any) => {
    return (
        <div 
            className='progressbar-wrapper'
            style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
            }}
        >
            {props.children}
        </div>
    )
}

export const Bar = (props: {
    max?: number, 
    defaultValue?: number,
    effectCallback?: (setVal: React.Dispatch<React.SetStateAction<number[]>>) => () => any,
    colorCallback?: (val: number, max:number) => string
}) => {
    const { max, defaultValue, effectCallback, colorCallback } = props;
    const [ val, setVal ] = useState([0, max || 1]);

    useEffect(() => {
        if (effectCallback) return effectCallback(setVal);
    }, [])

    useEffect(() => {
        if (defaultValue) setVal([defaultValue, max as number]);
    }, [defaultValue])
    
    return (
        <div 
            className="progressbar"
            style={{
                width:'100%',
                height:'4px',
                backgroundColor: 'inherit',
                position: 'relative',
            }}
        >
            <div style={{
                width: val[0] / val[1] * 100 + '%',
                height: '100%',
                maxWidth: '100%',
                backgroundColor: colorCallback ? colorCallback(val[0], val[1]) : 'cyan',
            }}></div>
        </div>
    )
}

export const getIndex = (corrected: boolean[], index: number, val: number, recall: number) => {
    const newIndex = index + val
    if (newIndex < 0) { // 0보다 작으면 첫번째 인덱스로 가기, 원래 인덱스가 0이면 첫 화면으로
        return index == 0 ? -1 : 0;
    } else { // 해당 없으면 그냥 반환
        if (recall && val == 1 && (newIndex % recall == 0 || newIndex == corrected.length )) {
            for (let val of corrected.slice(index - index % recall, newIndex)) {
                if (!val) return index - index % recall;
            }
        } else if (newIndex >= corrected.length) { // 최대 인덱스보다 크면 최대 인덱스, 원래 인덱스가 최대 인덱스인 경우 false
            return index == corrected.length - 1 ? -1 : corrected.length - 1;
        }
        return newIndex;
    }
}