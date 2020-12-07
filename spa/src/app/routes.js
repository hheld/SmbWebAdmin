import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {createBrowserHistory} from "history";

import configureStore from './configureStore';
import requiresAuth from '../components/AuthenticatedComponent';

import LoginComponent from '../components/Login/LoginComponent';
import AdminComponent from '../components/Admin/AdminComponent';
import EditUsers from '../components/Admin/EditUsers/EditUsers';
import AddUser from '../components/Admin/AddUser/AddUser';
import ChangePwd from '../components/User/ChangePwd';
import SmbPwdChange from '../components/SmbPwdChange/SmbPwdChange';

export const store = configureStore();

const history = createBrowserHistory();

const routes = (
    <Router history={history}>
        <Route path=''>
            <Route path='/login' component={LoginComponent}/>
            <Route path='/smbPwdChange' component={SmbPwdChange}/>

            <Route path='/admin' component={requiresAuth(AdminComponent, {role: 'admin', redirectTo: '/login'})}/>
            <Route path='/admin/editUsers' component={EditUsers}/>
            <Route path='/admin/addUser' component={AddUser}/>
            <Route path='/changePwd' component={requiresAuth(ChangePwd, {role: 'user', redirectTo: '/login'})}/>
        </Route>
    </Router>
);

export default routes;
