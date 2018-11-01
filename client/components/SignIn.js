import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {
  setInStorage
} from '../utils/storage';
import '../css/SignIn.css';

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      signInError: '',
      username: "",
      password: "",
      isSignedIn: false
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
      .then(response => {

        console.log('response data: ', response.data);

        if (response.data.success) {
          setInStorage('broker_base', { token: response.data.token });
          this.setState({
            signInError: response.data.message,
            isLoading: false,
            token: response.data.token,
            isSignedIn: true
          });

        } else {
          this.setState({
            signInError: response.data.message,
            isLoading: false,
          });
        }

      })
      .catch(error => {

        this.setState({
          isLoading: false,
        });

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

    if (this.state.isSignedIn === true) {
      return <Redirect to='/' />
    }

    return (
      <div className="SignIn">
        <form onSubmit={this.handleSubmit}>
        {
          (signInError) ? (
            <p className="text-danger">{signInError}</p>
          ) : (null)
        }
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
            disabled={isLoading || !this.validateForm()}
            type="submit"
          >
            Sign In
            </Button>
        </form>
      </div>
    );
  }
}