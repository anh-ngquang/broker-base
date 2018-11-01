import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  getFromStorage,
} from '../utils/storage';

class Filter extends Component {
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

            this.props.userHasAuthenticated(true);

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

    if (!token) {
      return (<Redirect to="/signin" />);
    }

    return (
      <div>
        FILTER
      </div>
    );
  }
}
  
  export default Filter;