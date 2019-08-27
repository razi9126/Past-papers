import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {}
    };
  }

  render() {
    const { users } = this.state;

    return (
      <div>
        <h1>Home</h1>
        <div>
          <h2>List of Usernames of Users</h2>
          {Object.keys(users).map(key =>
            <div key={key}>{users[key].username}</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}

export default withRouter(connect(mapStateToProps)(Home));