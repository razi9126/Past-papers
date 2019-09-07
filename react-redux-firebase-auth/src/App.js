import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import { connect } from 'react-redux';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import EditProfile from './components/EditProfile';
import PasswordForget from './components/PasswordForget';
import Home from './components/Home';
import Account from './components/Account';
import Landing from './components/Landing';
import ProgNavbar from './components/Navbar/ProgNavbar'
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AddQ from './components/AddQ';
import EditQ from './components/EditQ';
import TagPhotos from './components/TagPhotos';
import AddTags from './components/AddTags';
import EditAccount from './components/edit-account-type';
import AddCredit from './components/edit-credit';
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
              // console.log("props",this.props)
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
            <PrivateRoute exact path={routes.ACCOUNT} user={this.props.user} component={() => <Account />} />
            <PrivateRoute exact path={routes.ADDQ} user={this.props.user} component={() => <AddQ />} />
            <PrivateRoute exact path={routes.EDITQ} user={this.props.user} component={() => <EditQ />} />
            <PrivateRoute exact path={routes.TAGQ} user={this.props.user} component={() => <TagPhotos />} />
            <PrivateRoute exact path={routes.ADDTAG} user={this.props.user} component={() => <AddTags />} />
            <PrivateRoute exact path={routes.EDIT_ACCOUNT_TYPE} user={this.props.user} component={() => <EditAccount />} />
            <PrivateRoute exact path={routes.EDIT_CREDIT} user={this.props.user} component={() => <AddCredit />} />
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