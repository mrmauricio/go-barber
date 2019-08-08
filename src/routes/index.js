// pasta routes em vez de arquivo.js pois terão configurações adicionais
import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/register" component={SignUp} />

            <Route path="/dashboard" component={Dashboard} isPrivate />
            <Route path="/profile" component={Profile} isPrivate />

            {/* rota 404 de exemplo que retorna quando rota inexsitente
            é chamada */}
            <Route path="/" component={() => <h1>404</h1>} />
        </Switch>
    );
}
