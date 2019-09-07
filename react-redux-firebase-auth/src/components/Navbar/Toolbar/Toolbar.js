import React from 'react';
import { Link } from 'react-router-dom';
import DrawerToggleButton from './DrawerToggleButton';
import './Toolbar.css';
import SignOut from '../../SignOut';
import * as routes from '../../../constants/routes';


const loggedin_admin = (
    <ul>
        <li><Link to={routes.HOME}>Home</Link></li>
        <li><Link to={routes.ADDQ}>Add Questions</Link></li>
        <li><Link to={routes.EDITQ}>Edit Questions</Link></li>
        <li><Link to={routes.TAGQ}>Tag Questions</Link></li>
        <li><Link to={routes.ADDTAG}>Add Tags</Link></li>
        <li><Link to={routes.EDIT_PROFILE}>Edit Profile</Link></li>
        <li> <SignOut/> </li>
    </ul>

    )
const loggedin_student = (
    <ul>
        <li><Link to={routes.HOME}>Home</Link></li>
        <li><Link to={routes.EDITQ}>Edit Questions</Link></li>
        <li><Link to={routes.TAGQ}>Tag Questions</Link></li>
        <li><Link to={routes.EDIT_PROFILE}>Edit Profile</Link></li>
        <li> <SignOut/> </li>
    </ul>

    )

const loggedout = (
    <ul> 
        <li><Link to={routes.SIGN_IN}>Login</Link></li>
        <li><Link to={routes.SIGN_UP}>Sign Up</Link></li>
    </ul>
    )

const toolbar = props => (
  <header className="toolbar">
    <nav className="toolbar__navigation">
        <div className="toolbar__toggle-button">
            <DrawerToggleButton click={props.drawerClickHandler} />
        </div>
        <div className="toolbar__logo"><a href="/">THE LOGO</a></div>
        <div className="spacer" />
        <div className="toolbar_navigation-items">
     
            {
            // props.user.user !== null? loggedin_admin: loggedout
               (props.user.user !== null ? (props.user.usertype==='admin'? loggedin_admin: loggedin_student): loggedout)
            }
        </div>
    </nav>
  </header>
);


export default toolbar;
