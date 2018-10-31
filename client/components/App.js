import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import Routes from '../routes.js';
import SignIn from './SignIn';
import '../css/App.css';
import {
  setInStorage,
  getFromStorage,
} from '../utils/storage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: ''
    };
  }

  componentDidMount() {
    const obj = getFromStorage('broker_base');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {

    const {
      isLoading,
      token
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
          {token 
          ? <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="/filter">Filter</NavItem>
            <NavItem href="/">Import</NavItem>
            <NavDropdown title="Tools" id="basic-nav-dropdown">
              <MenuItem href="/">Action</MenuItem>
              <MenuItem>Another action</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        : <Navbar.Toggle />
        }
        </Navbar>
        {token 
          ? <Routes />
          : <SignIn />
        }
      </div>
    );
  }
}

export default App;
