import React from 'react';

import { auth } from '../firebase';

class PasswordChange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordOne: '',
      passwordTwo: '',
      error: null,
    };
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <form onSubmit={ async (e) => {
        e.preventDefault();
        const { passwordOne } = this.state;

        try {
          await auth.doPasswordUpdate(passwordOne);
        } catch (error) {
          this.setState({
            error
          });
        }
      }}>
        <input
          value={passwordOne}
          onChange={event => this.setState({
            passwordOne: event.target.value
          })}
          type="password"
          placeholder="New Password"
        />
        <input
          value={passwordTwo}
          onChange={event => this.setState({
            passwordTwo: event.target.value
          })}
          type="password"
          placeholder="Confirm New Password"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

export default PasswordChange;