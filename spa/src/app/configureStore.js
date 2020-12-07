import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {createBrowserHistory} from "history";

import rootReducer from './reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);

const createStoreWithMiddleware = compose(applyMiddleware(
    thunk,
    router
), window.devToolsExtension && process.env.NODE_ENV !== 'production' ? window.devToolsExtension() : f => f)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState);
}
