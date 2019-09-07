import React from 'react';
import { connect } from 'react-redux';
import { auth } from '../firebase';

import "./PasswordForget.css"
import background from './blue_bg.jpg'
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
      // email,
      error,
    } = this.state;

    const no_rec_db = "There is no user record corresponding to this identifier. The user may have been deleted."
    const no_rec_a = "No User exists with this Email Address"
    return (
      <div className ="full-fgt-pw">
        <img className= "bkg" src = {background} />
        <form className = "main_container1" onSubmit={ async (e) => {
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

            <section>
              <div className = "reset-container" >
                <h1 tabindex="-1" className = "reset-heading">
                  <div className= "reset-text">
                    Reset Password
                  </div>
                </h1>
              </div>

              <div className="body-text">
                Enter the email address associated with your account, and we’ll email you a link to reset your password.
              </div>

              <div className = "reset-container">
                <div className = "control-group space-1">
                  <input required className="pwf icon_signin signup-login-form__btn-xl" value={this.state.email} onChange={event => this.setState({email: event.target.value })} type="email" placeholder="Email Address"/>
                </div>
                <button className="block1 signup-login-form__btn-xl" type="submit">
                  Reset Password
                </button>
              </div>
              <br/><div className = "control-group space-2"/>
              
          </section>
          <div className={error? "error_msg":null}>
            { error && <p>{error.message === no_rec_db? no_rec_a: error.message}</p> }
          </div>
        </form>
      </div>
    )
  }
}

export default connect()(PasswordForget);
