import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Menu from './components/Menu';
import AddQ from './components/AddQ'
import EditQ from './components/EditQ'
import AddTags from './components/AddTags'
import TagPhotos from './components/TagPhotos'
import ProgNavbar from './components/ProgNavbar'

class App extends Component {
  render() {
    const App = () => (
      <div>
      <ProgNavbar/>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/Menu' component={Menu}/>
          <Route path='/AddQ' component={AddQ}/>
          <Route path='/EditQ' component={EditQ}/>
          <Route path='/AddTags' component={AddTags}/>
          <Route path='/TagPhotos' component={TagPhotos}/>
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
