import React from 'react'
import './SideDrawer.css'
import * as routes from '../../../constants/routes';
import SignOut from '../../SignOut';
import { Link } from 'react-router-dom';

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


const sideDrawer = props => {
  let drawerClasses = 'side-drawer'
  if (props.show) {
    drawerClasses = 'side-drawer open'
  }
  return (
    <nav className={drawerClasses}>
      {props.user !== null? loggedin: loggedout}
    </nav>
  )
}

export default sideDrawer