
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', function() {
  var app = document.getElementById('mount')
  ReactDOM.render(<App/>,app);
});
