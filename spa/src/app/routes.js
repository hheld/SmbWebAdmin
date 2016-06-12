import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './configureStore';
import requiresAuth from '../components/AuthenticatedComponent';

import LoginComponent from '../components/Login/LoginComponent';
import AdminComponent from '../components/Admin/AdminComponent';
import EditUsers from '../components/Admin/EditUsers/EditUsers';
import AddUser from '../components/Admin/AddUser/AddUser';
import ChangePwd from '../components/User/ChangePwd';
import SmbPwdChange from '../components/SmbPwdChange/SmbPwdChange';

export const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const routes = (
    <Router history={history}>
        <Route path=''>
            <Route path='/login' component={LoginComponent}></Route>
            <Route path='/smbPwdChange' component={SmbPwdChange} />
            
            <Route path='/'>
                <Route path='admin' component={requiresAuth(AdminComponent, { role: 'admin', redirectTo: '/login' })}>
                    <Route path='editUsers' component={EditUsers} />
                    <Route path='addUser' component={AddUser} />
                </Route>
                <Route path='changePwd' component={requiresAuth(ChangePwd, { role: 'user', redirectTo: '/login' })} />
            </Route>
        </Route>
    </Router>
);

export default routes;
