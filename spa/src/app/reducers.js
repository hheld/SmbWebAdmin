import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from '../auth/authReducer';
import editUserReducer from '../components/Admin/EditUsers/editUserReducer';
import changePwdReducer from '../components/User/changePwdReducer';
import smbAdminReducer from '../components/Admin/SmbAdmin/smbAdminReducer';
import smbPwdChangeReducer from '../components/SmbPwdChange/smbPwdChangeReducer';

const rootReducer = combineReducers({
    user: authReducer,
    editUser: editUserReducer,
    routing: routerReducer,
    pwdChange: changePwdReducer,
    smbAdmin: smbAdminReducer,
    smbPwdChange: smbPwdChangeReducer
});

export default rootReducer;
