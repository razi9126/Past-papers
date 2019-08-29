import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import '../App.css'
import logo from '../logo.svg';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {},

    };
  }

  render() {
    console.log(this.state)
    const { users } = this.state;
    console.log(this.props)

    return (
      <div>
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" /><br/>
            <h1> YOU ARE AT THE HOME PAGE </h1>
        </header>
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("state",state)
  return {
    user: state.user.user,
    credits: state.user.credits,
    usertype: state.user.usertype,
  };
}

export default withRouter(connect(mapStateToProps)(Home));


// <div>
//   <h2>List of Usernames of Users</h2>
//   {Object.keys(users).map(key =>
//     <div key={key}>{users[key].username}</div>
//   )}
// </div>