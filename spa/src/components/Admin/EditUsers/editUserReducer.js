import { SET_ALL_USERS } from './editUserActions';

const initialState = {
    allUsers: null
};

export default function editUserReducer(state = initialState, action) {
    switch(action.type) {
    case SET_ALL_USERS: {
        return Object.assign({}, state, {
            allUsers: action.allUsers
        });
    }
    default: {
        return state;
    }
    }
}
