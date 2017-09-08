import React from 'react'
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import Main from './Main.jsx'


render((
    <BrowserRouter>
        <Main dataToRender={dataToRender} isLoggedIn={isLoggedIn} error={error} />
    </BrowserRouter>),
document.getElementById("App"));

