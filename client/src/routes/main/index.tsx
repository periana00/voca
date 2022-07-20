import React from "react";
import { Link } from "react-router-dom";
import './index.scss';

export default function Nav() {
    return (
        <div className="main">
            <nav>
                <Link to="101">101, 201, 401</Link>
                <Link to="301">301</Link>
            </nav>
        </div>
    )
}