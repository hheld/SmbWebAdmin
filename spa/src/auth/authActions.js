import request from 'superagent';

import { deleteCsrfToken } from '../utils/cookieHandling';
import { authenticatedGet } from '../utils/apiHelpers';

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTHENTICATING = 'AUTHENTICATING';
export const LOGOUT = 'LOGOUT';

export function loginUser(userName, pwd) {
    return (dispatch, getState) => {
        const isAuthenticated = getState().user.currentUser !== null;

        if (!isAuthenticated) {
            request
                .post('/token')
                .send({
                    userName: userName,
                    password: pwd
                })
                .end(function (err, res) {
                    if (err || !res.ok) {
                        dispatch({
                            type: AUTH_FAILURE,
                            err: err
                        });
                    } else {
                        dispatch(currentUserInfo()).catch(() => {
                            dispatch({ type: AUTH_FAILURE });
                        });
                    }
                });
        } else {
            // already authenticated; nothing to do!
        }
    };
}

export function currentUserInfo() {
    return (dispatch) => {
        const usrPromise = authenticatedGet('/api/userInfo', (res) => {
            const currentUser = JSON.parse(res.text);

            dispatch({
                type: AUTH_SUCCESS,
                userInfo: currentUser
            });
        }, (err) => {
            dispatch({
                type: AUTH_FAILURE,
                err: err
            });
        });
        
        dispatch({
            type: AUTHENTICATING
        });
        
        usrPromise.catch((err) => {
            dispatch({
                type: AUTH_FAILURE,
                err: err
            });
        });
        
        return usrPromise;
    };
}

export function logoutUser() {
    return (dispatch) => {
        request
            .get('/logout')
            .end((err, res) => {
                if(!err && res.ok) {
                    deleteCsrfToken();
                    dispatch({ type: LOGOUT });
                }
            });
    };
}
