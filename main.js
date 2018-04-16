import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import allReducers from './redux/reducers'
import App from './containers/App'

const store= createStore(allReducers);

if(typeof document !== "undefined"){
  document.addEventListener('DOMContentLoaded', function() {
    var app = document.getElementById('mount')
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
        app
    );
  });
}
