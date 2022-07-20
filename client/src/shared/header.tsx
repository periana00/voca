import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return <header>
        <nav>
            <Link to="/">HOME</Link>
        </nav>
    </header>
}