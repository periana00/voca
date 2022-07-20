import React from "react";

import { Cookies, useCookies } from 'react-cookie';

export default function word301() {
    const [cookies, setCookies] = useCookies();
    console.log(cookies);

    return (
        <div>
            301
        </div>
    )
}