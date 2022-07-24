import React, { useState, useEffect } from "react";
import './style/popup.scss';

export default function Popup(props: {
    children?: any, 
    onExit?: (e: React.MouseEvent) => any
}) {

    const exit = (e: React.MouseEvent) => {
        if (props.onExit) {
            props.onExit(e);
        }
    }

    return (
        <div className="popup-wrapper">
            <button className="popup-exit" onClick={exit}>X</button>
            <div className="popup-window">{props.children}</div>
        </div>
    )
}