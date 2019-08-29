import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { auth, db } from '../firebase';
import * as routes from '../constants/routes';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      error: null,
    }
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      email === '';

    return (
      <div>
        <h1>SignUp</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const {
            username,
            email,
            passwordOne,
          } = this.state;

          const {
            history,
          } = this.props;

          try {
            const authUser = await auth.doCreateUserWithEmailAndPassword(email, passwordOne);
            await db.doCreateUser(authUser.user.uid, username, email, 10, 'student');
            history.push(routes.HOME);
          } catch (error) {
            this.setState({
              error
            });
          }
        }}>
          <input
            value={username}
            onChange={event => this.setState({
              username: event.target.value
            })}
            type="text"
            placeholder="Full Name"
          />
          <input
            value={email}
            onChange={event => this.setState({
              email: event.target.value
            })}
            type="text"
            placeholder="Email Address"
          />
          <input
            value={passwordOne}
            onChange={event => this.setState({
              passwordOne: event.target.value
            })}
            type="password"
            placeholder="Password"
          />
          <input
            value={passwordTwo}
            onChange={event => this.setState({
              passwordTwo: event.target.value
            })}
            type="password"
            placeholder="Confirm Password"
          />
          <button disabled={isInvalid} type="submit">
            Sign Up
          </button>

          { error && <p>{error.message}</p> }
        </form>
      </div>
    )
  }
}

export default withRouter(connect()(SignUp));