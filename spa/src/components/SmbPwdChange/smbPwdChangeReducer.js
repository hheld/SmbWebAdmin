import { SMB_PWD_CHANGE_FAILURE, SMB_PWD_CHANGE_SUCCESS } from './smbPwdChangeActions';

const initialState = {
    msg: null,
    success: null
};

export default function smbPwdChangeReducer(state=initialState, action) {
    switch(action.type) {
    case SMB_PWD_CHANGE_SUCCESS: {
        return {
            msg: action.err,
            success: true
        };
    }
    case SMB_PWD_CHANGE_FAILURE: {
        return {
            msg: action.err,
            success: false
        };
    }
    default: {
        return state;
    }
    }
}
