import React from 'react';
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom';
import { connect } from 'react-redux';

import Navigation from './Navigation';
import SignUp from './SignUp';
import SignIn from './SignIn';
import PasswordChange from './PasswordChange';
import PasswordForget from './PasswordForget';
import Home from './Home';
import Account from './Account';
import Landing from './Landing';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import * as routes from '../constants/routes';
import Auth from './Auth';

import './app.css';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Auth>
            <h1><Link to={routes.HOME}>App</Link></h1>
            <Navigation />
            <hr/>

            <Route exact path={routes.HOME} component={() => {
              if (this.props.user === null) {
                return (
                  <Landing />
                )
              } else {
                return (
                  <Home />
                )
              }
            }} />
            <PublicRoute exact path={routes.SIGN_UP} user={this.props.user} component={() => <SignUp />} />
            <PublicRoute exact path={routes.SIGN_IN} user={this.props.user} component={() => <SignIn />} />
            <PublicRoute exact path={routes.PASSWORD_FORGET} user={this.props.user} component={() => <PasswordForget />} />
            <PrivateRoute exact path={routes.PASSWORD_CHANGE} user={this.props.user} component={() => <PasswordChange />} />
            <PrivateRoute exact path={routes.ACCOUNT} user={this.props.user} component={() => <Account />} />
          </Auth>
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}

export default connect(mapStateToProps)(App);