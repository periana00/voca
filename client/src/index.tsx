import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './shared/App';
import Word101 from './routes/101';
import Word301 from './routes/301';
import Main from './routes/main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.scss';

const root = createRoot(document.querySelector('#root') as Element)
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/" element={<App />}>
                <Route path="101" element={<Word101 />} />
                <Route path="301" element={<Word301 />} />
            </Route>
        </Routes>
    </BrowserRouter>
)