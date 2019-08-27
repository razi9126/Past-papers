import React from 'react';
import { connect } from 'react-redux';
import * as routes from '../constants/routes';
import { Link, withRouter } from 'react-router-dom';

class Account extends React.Component {
  render() {
    console.log(this.props.user)
    return (
      <div>
        <h1>Account: {this.props.user.email}</h1>
        <Link to={routes.PASSWORD_CHANGE}>Change password</Link>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}

export default withRouter(connect(mapStateToProps)(Account));