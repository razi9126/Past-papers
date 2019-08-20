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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/AddQ">Add Questions</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/TagPhotos">Tag Photos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/EditQ">Edit Questions</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/AddTags">AddTags</a>
              </li>
              
            </ul>
          </div>
        </nav>
        </div>
        );
    }
  }

  export default NavbarPage;