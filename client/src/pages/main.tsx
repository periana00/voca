import React from "react";
import { Link } from "react-router-dom";
import './main.scss';

export default function Nav() {
    return (
        <div className="main">
            <nav>
                <Link to="101">일반 단어</Link>
                <Link to="301">동의어</Link>
            </nav>
        </div>
    )
}