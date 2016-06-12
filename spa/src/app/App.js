
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import routes, { store } from './routes';
import { currentUserInfo } from '../auth/authActions';

// run initial actions #################################################################################################
store.dispatch(currentUserInfo()).catch(() => {});
// #####################################################################################################################

const RootComponent = () => {
    return (
        <Provider store={store}>
            {routes}
        </Provider>
    );
};

ReactDOM.render(
    <RootComponent />,
    document.getElementById('mount-point')
);
