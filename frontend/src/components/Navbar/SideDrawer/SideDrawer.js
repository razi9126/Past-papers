import React from 'react'
import './SideDrawer.css'
import * as routes from '../../../constants/routes';
import SignOut from '../../SignOut';
import { Link } from 'react-router-dom';

const loggedin_admin = (
    <ul>
        <li><Link to={routes.HOME}>Home</Link></li>
        <li><Link to={routes.EDIT_PRIVILEGES}>Privileges</Link></li>
        <li><Link to={routes.EDIT_PROFILE}>Edit Profile</Link></li>
        <li> <SignOut/> </li>
    </ul>

    )

const loggedin_student = (
    <ul>
        <li><Link to={routes.HOME}>Home</Link></li>
        <li><Link to={routes.EDIT_PROFILE}>Edit Profile</Link></li>
        <li> <SignOut/> </li>
    </ul>

    )

const loggedin_teacher = (
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

const loggedout = (
    <ul> 
        <li><Link to={routes.SIGN_IN}>Login</Link></li>
        <li><Link to={routes.SIGN_UP}>Sign Up</Link></li>
    </ul>
  )

const sideDrawer = props => {
  let drawerClasses = 'side-drawer'
  if (props.show) {
    drawerClasses = 'side-drawer open'
  }
  return (
    <nav className={drawerClasses}>
      {(props.user.user !== null ? (props.user.usertype==='admin'? loggedin_admin: (props.user.usertype==="teacher"? loggedin_teacher:loggedin_student)): loggedout)}
    </nav>
  )
}

export default sideDrawer