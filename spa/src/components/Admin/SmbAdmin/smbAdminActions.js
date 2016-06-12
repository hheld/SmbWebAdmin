import { authenticatedPost, authenticatedGet } from '../../../utils/apiHelpers';

export const SET_VERIFICATION_SHARE = 'SET_VERIFICATION_SHARE';

export function setVerificationShare(share) {
    return (dispatch) => {
        authenticatedPost('/api/setLocalShareForVerification', {
            LocalShare: share
        }, () => {
            dispatch(getVerificationShare());
        });
    };
}

export function getVerificationShare() {
    return (dispatch) => {
        authenticatedGet('/api/localShareForVerification', (res) => {
            if (res.text) {
                const share = JSON.parse(res.text);

                dispatch({
                    type: SET_VERIFICATION_SHARE,
                    share: share.LocalShare
                });
            }
        });
    };
}
