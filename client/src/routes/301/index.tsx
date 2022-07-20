import React, { useEffect, useState } from "react";
import axios from 'axios';
// import './index.scss';
import { useOutletContext } from "react-router-dom";

export default function word101(props: any) {
    const [words, setWords]: any = useOutletContext();
    useEffect(() => {
        axios.get('api/get').then(({data}) => {
            console.log(data);
            setWords(data)
        })
    }, []);

    return (
        <div className="word-301">
            
        </div>
    )
}