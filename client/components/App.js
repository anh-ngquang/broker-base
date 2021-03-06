import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import Routes from '../routes.js';
import SignIn from './SignIn';
import '../css/App.css';
import {
  setInStorage
} from '../utils/storage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isAuthenticated: false
    };
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = event => {
    setInStorage('broker_base', { token: '' });
    this.userHasAuthenticated(false);
    this.props.history.push("/signin");
  }

  render() {

    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    const {
      isLoading,
      isAuthenticated
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    return (
      <div className="App">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">YTM Realty - Broker Base</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          {isAuthenticated 
          ? <Navbar.Collapse>
          <Nav pullRight>
            <IndexLinkContainer to="/">
              <NavItem>Danh bạ</NavItem>
            </IndexLinkContainer>
            <IndexLinkContainer to="/import">
              <NavItem>Nhập dữ liệu</NavItem>
            </IndexLinkContainer>
            <NavDropdown title="Công cụ" id="basic-nav-dropdown">
              <IndexLinkContainer to="/excelToSmsList">
                <MenuItem>Excel -> SMS List</MenuItem>
              </IndexLinkContainer>
            </NavDropdown>
            <NavItem onClick={this.handleLogout}>Đăng xuất</NavItem>
          </Nav>
        </Navbar.Collapse>
        : <Navbar.Toggle/>
        }
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
