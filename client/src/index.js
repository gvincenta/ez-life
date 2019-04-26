import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlei1saWZlIiwic3ViIjoiNWNhZWU0OTZlY2EzMTI1NzAxYzk2NjM0IiwiaXNzdWVkQXQiOjE1NTU3MzgyOTA5MDAsImV4cCI6MTU1NTgyNDY5MDkwMCwiaWF0IjoxNTU1NzM4MjkwfQ.xiG-nnntH-srSwylzmNCZhwCXzgmwFqLVQJCvqoD3Vs";

 
  ReactDOM.render( <BrowserRouter>
    <App token= {token}/>
    </BrowserRouter>, document.getElementById("root"));




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
