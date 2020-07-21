import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducers } from './store/reducers';
import * as serviceWorker from './serviceWorker';

import Layout from './hoc/Layout/Layout';
import Home from './containers/home/Home';
import Auth from './containers/auth/Auth';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
    }
}

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const app: JSX.Element = (
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Layout>
                    <Switch>
                        <Route path="/auth" component={Auth} />
                        <Route path="/" exact component={Home} />
                        <Redirect to="/" />
                    </Switch>
                </Layout>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
