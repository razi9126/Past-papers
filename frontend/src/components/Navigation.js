import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SignOut from './SignOut';
import * as routes from '../constants/routes';

class Navigation extends React.Component {
  render() {
    console.log(this.props.user)
    if (this.props.user !== null) {
      return (
        <ul>
          <li><Link to={routes.HOME}>Home</Link></li>
          <li><Link to={routes.ACCOUNT}>Account</Link></li>
          <li><SignOut /></li>
        </ul>
      )
    } else {
      return (
        <ul>
          <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
        </ul>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}

export default connect(mapStateToProps)(Navigation);
