import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import { connect } from 'react-redux';

import Navigation from './components/Navigation';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PasswordChange from './components/PasswordChange';
import PasswordForget from './components/PasswordForget';
import Home from './components/Home';
import Account from './components/Account';
import Landing from './components/Landing';
import ProgNavbar from './components/Navbar/ProgNavbar'
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import * as routes from './constants/routes';
import Auth from './components/Auth';
import './App.css';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Auth>
            <ProgNavbar/>
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