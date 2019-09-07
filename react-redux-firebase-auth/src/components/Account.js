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
        <h3>Account type: {this.props.usertype}</h3>
        <h3>Account credits: {this.props.credits}</h3>
        <Link to={routes.EDIT_PROFILE}>Change password</Link>
      </div>
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
export default withRouter(connect(mapStateToProps)(Account));