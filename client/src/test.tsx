import React, { useState } from "react";
import { Popup, BarContainer, Bar } from "./components";

export default function Test() {
    const [toggle, setToggle] = useState(true);
    if (!toggle) return null;
    return (
        <Popup onExit={(e => setToggle(false))}>
            <BarContainer>
                <Bar 
                    max={2000}
                    type="time"
                    colorCallback={(val, max) => {
                        return `rgb(${val / max * 255}, ${255 - val**2 / max**2 * 255}, 0)`
                    }}
                ></Bar>
            </BarContainer>
            <div>안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕</div>
        </Popup>
    )
}