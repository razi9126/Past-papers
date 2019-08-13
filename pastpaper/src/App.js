import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Upload from './components/Upload';
import AddQ from './components/AddQ'
import DelQ from './components/DelQ'
import RUI from './components/ReactUploadImage'

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/Upload' component={Upload}/>
          <Route path='/AddQ' component={AddQ}/>
          <Route path='/DelQ' component={DelQ}/>
          <Route path='/RUI' component={RUI}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
