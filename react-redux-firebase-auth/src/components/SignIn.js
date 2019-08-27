import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestSignIn, signedIn } from '../actions/user'
import { auth } from '../firebase';
import * as routes from '../constants/routes';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null
    };
  }

  render() {
    const { email, password, error, } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div>
        <h1>SignIn</h1>
        <form onSubmit={ async (e) => {
          e.preventDefault();
          const { email, password, } = this.state;
          const {history,} = this.props;

          this.props.dispatch(requestSignIn());

          try {
            const response = await auth.doSignInWithEmailAndPassword(email, password);
            this.props.dispatch(signedIn(response.user));
            if (response.user === undefined) {
              history.push(routes.SIGN_IN);
            } else {
              history.push(routes.HOME);
            }
          } catch (error) {
            this.setState({
              error
            });
          }
        }}>
          <input
            value={email}
            onChange={event => this.setState({
              email: event.target.value
            })}
            type="text"
            placeholder="Email Address"
          />
          <input
            value={password}
            onChange={event => this.setState({
              password: event.target.value
            })}
            type="password"
            placeholder="Password"
          />
          <button disabled={isInvalid} type="submit">
            Sign In
          </button>

          { error && <p>{error.message}</p> }
        </form>
        <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
        <Link to={routes.SIGN_UP}>Sign Up</Link>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}

export default withRouter(connect(mapStateToProps)(SignIn));