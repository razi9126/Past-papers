import React from 'react';
import { Link } from 'react-router-dom';
import DrawerToggleButton from './DrawerToggleButton';
import './Toolbar.css';
import SignOut from '../../SignOut';
import * as routes from '../../../constants/routes';


const loggedin = (
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/AddQ">Add Questions</a></li>
        <li><a href="/TagPhotos">Tag Photos</a></li>
        <li><a href="/EditQ">Edit Questions</a></li>
        <li><a href="/AddTags">Add Tags</a></li>
        <li> <SignOut/> </li>
    </ul>

    )

const loggedout = (
    <ul> 
        <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
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
            {props.user !== null? loggedin: loggedout}
        </div>
    </nav>
  </header>
);


export default toolbar;
