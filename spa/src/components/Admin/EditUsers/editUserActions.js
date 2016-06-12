import { authenticatedGet, authenticatedPost } from '../../../utils/apiHelpers';
import { currentUserInfo } from '../../../auth/authActions';

export const GET_ALL_USERS = 'GET_ALL_USERS';
export const SET_ALL_USERS = 'SET_ALL_USERS';

export function getAllUsers() {
    return (dispatch) => {
        const allUsrPromise = authenticatedGet('/api/allUsers', (res) => {
            dispatch({
                type: SET_ALL_USERS,
                allUsers: JSON.parse(res.text)
            });
        });
        
        allUsrPromise.catch(() => {});
        
        return allUsrPromise;
    };
}

export function updateUser(oldInfo, newInfo) {
    return (dispatch) => {
        authenticatedPost('/api/updateUser', {
            OldData: oldInfo,
            NewData: newInfo
        }, () => {
            dispatch(getAllUsers());
            dispatch(currentUserInfo());
        });
    };
}

export function deleteUser(userName) {
    return (dispatch) => {
        authenticatedPost('/api/deleteUser', {
            UserName: userName
        }, () => {
            dispatch(getAllUsers());
        });
    };
}
