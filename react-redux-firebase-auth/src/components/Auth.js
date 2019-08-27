import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { firebase } from '../firebase';
import { signedIn, signOut } from '../actions/user'

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticating: true
        }

    }
    componentWillMount() {
        firebase.auth.onAuthStateChanged(authUser => {
            this.setState({
                isAuthenticating: false
            });
            if (authUser !== null) {
                this.props.dispatch(signedIn(authUser));         
            } else {
                this.props.dispatch(signOut());
            }
        });
    }

    render() {
        if (this.state.isAuthenticating) {
            return (
                <div>
                    isLoading
                </div>
            )
        }
        return (
            this.props.children
        )
    }
}


export default withRouter(connect()(Auth));