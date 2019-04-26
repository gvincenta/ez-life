import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import LogIn from './LogIn';


const Routes = () => (
<BrowserRouter >
    <Switch>
    <Route exact path="/" component={LogIn}/>
   </Switch>
</BrowserRouter>
);
export default Routes;