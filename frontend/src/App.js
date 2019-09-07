import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import { connect } from 'react-redux';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import EditProfile from './components/EditProfile';
import PasswordForget from './components/PasswordForget';
import Home from './components/Home';
import Landing from './components/Landing';
import ProgNavbar from './components/Navbar/ProgNavbar'
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AddQ from './components/AddQ';
import EditQ from './components/EditQ';
import TagPhotos from './components/TagPhotos';
import AddTags from './components/AddTags';
import EditPrivileges from './components/EditPrivileges';
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
            <PrivateRoute exact path={routes.EDIT_PROFILE} user={this.props.user} component={() => <EditProfile />} />
            <PrivateRoute exact path={routes.ADDQ} user={this.props.user} component={() => <AddQ />} />
            <PrivateRoute exact path={routes.EDITQ} user={this.props.user} component={() => <EditQ />} />
            <PrivateRoute exact path={routes.TAGQ} user={this.props.user} component={() => <TagPhotos />} />
            <PrivateRoute exact path={routes.ADDTAG} user={this.props.user} component={() => <AddTags />} />
            <PrivateRoute exact path={routes.EDIT_PRIVILEGES} user={this.props.user} component={() => <EditPrivileges />} />
          </Auth>
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    credits: state.user.credits,
    usertype: state.user.usertype,
  };
}

export default connect(mapStateToProps)(App);