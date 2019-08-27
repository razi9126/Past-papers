import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

class Landing extends React.Component {
  render() {
    return (
      <div>
        <h1>Landing</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}

export default withRouter(connect(mapStateToProps)(Landing));