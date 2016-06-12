import { PWD_CHANGE_SUCCESS, PWD_CHANGE_FAIL, PWD_CHANGE_WAITING } from './changePwdActions';

const initialState = {
    waiting: false,
    err: null
};

export default function changePwdReducer(state = initialState, action) {
    switch (action.type) {
    case PWD_CHANGE_SUCCESS: {
        return {
            waiting: false,
            err: null
        };
    }
    case PWD_CHANGE_FAIL: {
        return {
            waiting: false,
            err: action.err
        };
    }
    case PWD_CHANGE_WAITING: {
        return {
            waiting: true,
            err: null
        };
    }
    default: {
        return state;
    }
    }
}
