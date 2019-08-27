import React from 'react';
import { auth } from '../firebase';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class SignOut extends React.Component {
  render() {
    return (
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          auth.doSignOut();
        }}
      >
        Sign Out
      </a>
    )
  }
}

export default withRouter(connect()(SignOut));
