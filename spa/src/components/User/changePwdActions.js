export const PWD_CHANGE_SUCCESS = 'PWD_CHANGE_SUCCESS';
export const PWD_CHANGE_FAIL = 'PWD_CHANGE_FAIL';
export const PWD_CHANGE_WAITING = 'PWD_CHANGE_WAITING';

import { authenticatedPost } from '../../utils/apiHelpers';

export function changePwd(userName, currentPwd, newPwd) {
    return (dispatch) => {
        authenticatedPost('/api/changePwd', {
            UserName: userName,
            NewPwd: newPwd,
            CurrentPwd: currentPwd
        }, (res) => {
            const response = JSON.parse(res.text);

            if (response.Success) {
                dispatch({ type: PWD_CHANGE_SUCCESS });
            } else {
                dispatch({ type: PWD_CHANGE_FAIL, err: 'The password could not be changed on the server.' });
            }

        }, (err) => {
            dispatch({ type: PWD_CHANGE_FAIL, err: err });
        });

        dispatch({ type: PWD_CHANGE_WAITING });
    };
}
