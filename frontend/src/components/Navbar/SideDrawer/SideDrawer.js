import React from 'react'
import './SideDrawer.css'
import * as routes from '../../../constants/routes';
import SignOut from '../../SignOut';
import { Link } from 'react-router-dom';
import noicon from '../../no-icon.jpg'
 

const blue_in =props => (
    <Link to={routes.EDIT_PROFILE}>
    <div className = "loggedin">
        <div className="drawer-content-in">
            <img className ="avatar" src = {props.user.user.photoURL===undefined? noicon: props.user.user.photoURL} />
            <div className = "spacer-2"/>
            {props.user.user.username===undefined? props.user.user.displayName: props.user.user.username}
            <br/><small> {props.user.user.email}</small>
        </div>
    </div>
    </Link>
    )

const blue_out = (
    <div className = "loggedout">
    PUT LOGO HERE
    </div>
    )

const loggedin_admin = (
    <ul>
        <li><Link to={routes.HOME}>Home</Link></li>
        <li><Link to={routes.EDIT_PRIVILEGES}>Privileges</Link></li>
        <li> <SignOut/> </li>
    </ul>

    )

const loggedin_student = (
    <ul>
        <li><Link to={routes.HOME}>Home</Link></li>
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
      {(props.user.user !==null? blue_in(props): blue_out)}      
      {(props.user.user !== null ? (props.user.usertype==='admin'? loggedin_admin: (props.user.usertype==="teacher"? loggedin_teacher:loggedin_student)): loggedout)}
    </nav>
  )
}

export default sideDrawer