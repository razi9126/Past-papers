import React, { Component } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
  MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
  import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
  import Home from './Home';
  import Menu from './Menu';
  import AddQ from './AddQ'
  import EditQ from './EditQ'
  import RUI from './ReactUploadImage'
  import AddTags from './AddTags'
  import TagPhotos from './TagPhotos'

  class NavbarPage extends Component {
    // state = {
    //   isOpen: false
    // };

    // toggleCollapse = () => {
    //   this.setState({ isOpen: !this.state.isOpen });
    // }
// navbar navbar-dark bg-dark
    render() {
      return (
        <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/AddQ">Add Questions</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/TagPhotos">Tag Photos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/EditQ">Edit Questions</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/AddTags">AddTags</a>
              </li>
              
            </ul>
          </div>
        </nav>
        </div>
        );
    }
  }

  export default NavbarPage;