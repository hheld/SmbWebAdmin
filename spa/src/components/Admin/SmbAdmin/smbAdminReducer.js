import { SET_VERIFICATION_SHARE } from './smbAdminActions';

const initialState = {
    share: ''
};

export default function smbAdminReducer(state = initialState, action) {
    switch(action.type) {
    case SET_VERIFICATION_SHARE: {
        return {
            share: action.share
        };
    }
    default: {
        return state;
    }
    }
}
