import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import '../css/SignIn.css';

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      signInError: '',
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {

    event.preventDefault();

    // Grab state
    const {
      username,
      password,
    } = this.state;

    console.log('password', password);

    this.setState({
      isLoading: true,
    });
    // Post request to backend
    axios.post('/api/account/signin', {
      username: username,
      password: password,
    })
      .then(function (response) {
        console.log('response', response);
      })
      .catch(function (error) {
        console.log('error', error);
      });
    
  }

  render() {

    const {
      isLoading,
      signInError,
      username,
      password
    } = this.state;

    return (
      <div className="SignIn">
        {
          (signInError) ? (
            <p>{signInError}</p>
          ) : (null)
        }
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={isLoading && !this.validateForm()}
            type="submit"
          >
            Sign In
            </Button>
        </form>
      </div>
    );
  }
}