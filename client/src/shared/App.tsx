import React from 'react';
import { Outlet } from "react-router-dom";
import Header from './header';
export default function App(props: any) {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}