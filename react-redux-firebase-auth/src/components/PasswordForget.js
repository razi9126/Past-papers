import React from 'react';
import { connect } from 'react-redux';


import { auth } from '../firebase';

class PasswordForget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: null,
    };
  }
  
  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
      <div>
        <h1>PasswordForget</h1>
        <form onSubmit={ async (e) => {
          e.preventDefault();

          const { email } = this.state;

          try {
            await auth.doPasswordReset(email);
          } catch (error) {
            this.setState({
              error
            });
          }          
        }}>
          <input
            value={this.state.email}
            onChange={event => this.setState({
              email: event.target.value
            })}
            type="text"
            placeholder="Email Address"
          />
          <button disabled={isInvalid} type="submit">
            Reset My Password
          </button>

          { error && <p>{error.message}</p> }
        </form>
      </div>
    )
  }
}

export default connect()(PasswordForget);
