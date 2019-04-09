import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import mainReducer from './Reducers/Reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(mainReducer, composeWithDevTools());

console.log(store);


ReactDOM.render(

    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
, document.getElementById('root'));

