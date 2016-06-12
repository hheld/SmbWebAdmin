export const ADD_USER = 'ADD_USER';

import { authenticatedPost } from '../../../utils/apiHelpers';
import { push } from 'react-router-redux';

export function addUser(user, pwd) {
    return (dispatch) => {
        authenticatedPost('/api/addUser', {
            User: user,
            Password: pwd
        }, () => {
            dispatch(push('/admin/editUsers'));
        });
    };
}
