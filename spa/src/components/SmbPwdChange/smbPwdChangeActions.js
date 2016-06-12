export const SMB_PWD_CHANGE_SUCCESS = 'SMB_PWD_CHANGE_SUCCESS';
export const SMB_PWD_CHANGE_FAILURE = 'SMB_PWD_CHANGE_FAILURE';

import request from 'superagent';

export function changeSmbPwd(userName, currentPwd, newPwd) {
    return (dispatch) => {
        request
            .post('/api/changeSmbPwd')
            .send({
                UserName: userName,
                CurrentPwd: currentPwd,
                NewPassword: newPwd
            })
            .end((err, res) => {
                if(err || !res.ok) {
                    dispatch({ type: SMB_PWD_CHANGE_FAILURE, err: 'Could not change the password!' });
                } else {
                    dispatch({ type: SMB_PWD_CHANGE_SUCCESS, err: 'Password changed successfully!' });
                }
            });
    };
}
