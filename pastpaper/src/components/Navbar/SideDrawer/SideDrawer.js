import React from 'react'
import './SideDrawer.css'

const sideDrawer = props => {
  let drawerClasses = 'side-drawer'
  if (props.show) {
    drawerClasses = 'side-drawer open'
  }
  return (
    <nav className={drawerClasses}>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/AddQ">Add Questions</a></li>
        <li><a href="/TagPhotos">Tag Photos</a></li>
        <li><a href="/EditQ">Edit Questions</a></li>
        <li><a href="/AddTags">Add Tags</a></li>
      </ul>
    </nav>
  )
}

export default sideDrawer