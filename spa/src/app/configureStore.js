import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

import rootReducer from './reducers';

const router = routerMiddleware(browserHistory);

const createStoreWithMiddleware = compose(applyMiddleware(
    thunk,
    router
), window.devToolsExtension && process.env.NODE_ENV!=='production' ? window.devToolsExtension() : f => f)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState);
}
