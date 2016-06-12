import { AUTH_SUCCESS, AUTH_FAILURE, AUTHENTICATING, LOGOUT } from './authActions';

const initialState = {
    currentUser: null,
    authenticating: false
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
    case AUTH_SUCCESS: {
        const { userInfo } = action;
        return Object.assign({}, state, {
            currentUser: userInfo,
            authenticating: false
        });
    }
    case AUTH_FAILURE: {
        return initialState;
    }
    case AUTHENTICATING: {
        return Object.assign({}, state, {
            authenticating: true
        });
    }
    case LOGOUT: {
        return initialState;
    }
    default: {
        return state;
    }
    }
}
