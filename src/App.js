import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import RouterIndex from './router';
import {Provider} from 'react-redux';
import store from './store/store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RouterIndex></RouterIndex>
      </Provider>
    );
  }
}

export default App;
