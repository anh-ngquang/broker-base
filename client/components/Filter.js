import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import Select from 'react-select';
import { areaOptions, brokerTypeOptions, propertyTypeOptions, sourceOptions } from '../utils/constant';
import {
  getFromStorage,
} from '../utils/storage';
import BootstrapTable from 'react-bootstrap-table-next';

import '../css/Filter.css';
import '../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: '',
      filterArea: [],
      filterBrokerType: [],
      filterPropertyType: [],
      filterSource: []
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

  handleFilterAreaChange = (selectedOption) => {
    this.setState({ filterArea: selectedOption });
  }

  handleFilterBrokerTypeChange = (selectedOption) => {
    this.setState({ filterBrokerType: selectedOption });
  }

  handleFilterPropertyTypeChange = (selectedOption) => {
    this.setState({ filterPropertyType: selectedOption });
  }

  handleFilterSourceChange = (selectedOption) => {
    this.setState({ filterSource: selectedOption });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  render() {
    const {
      isLoading,
      token
    } = this.state;

    const brokers = [];
    const columns = [{
      dataField: 'name',
      text: 'Tên'
    }, {
      dataField: 'phone',
      text: 'Số điện thoại'
    }, {
      dataField: 'email',
      text: 'Email'
    }, {
      dataField: 'areas',
      text: 'Khu vực'
    }, {
      dataField: 'sources',
      text: 'Nguồn'
    }];

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (<Redirect to="/signin" />);
    }

    return (
      <div className="Filter">
        <div className="header">
          <h1>Danh bạ môi giới</h1>
        </div>

        <Col md={3}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup controlId="filterArea">
              <ControlLabel>Khu vực: </ControlLabel>
              <Select
                value={this.state.filterArea}
                onChange={this.handleFilterAreaChange}
                closeMenuOnSelect={false}
                isMulti
                options={areaOptions}
                placeholder="Chọn..."
              />
            </FormGroup>
            <FormGroup controlId="filterBrokerType">
              <ControlLabel>Loại hình môi giới: </ControlLabel>
              <Select
                value={this.state.filterBrokerType}
                onChange={this.handleFilterChange}
                closeMenuOnSelect={false}
                isMulti
                options={brokerTypeOptions}
                placeholder="Chọn..."
              />
            </FormGroup>
            <FormGroup controlId="filterPropertyType">
              <ControlLabel>Loại hình BĐS: </ControlLabel>
              <Select
                value={this.state.filterPropertyType}
                onChange={this.handleFilterChange}
                closeMenuOnSelect={false}
                isMulti
                options={propertyTypeOptions}
                placeholder="Chọn..."
              />
            </FormGroup>
            <FormGroup controlId="filterSource">
              <ControlLabel>Nguồn: </ControlLabel>
              <Select
                value={this.state.filterSource}
                onChange={this.handleFilterChange}
                closeMenuOnSelect={false}
                isMulti
                options={sourceOptions}
                placeholder="Chọn..."
              />
            </FormGroup>
            <Button
              block
              bsSize="large"
              type="submit"
              disabled={this.state.isLoading}
            >
              Lọc
          </Button>
          </Form>
        </Col>
        <Col md={9}>
          <BootstrapTable wrapperClasses={"brokerTable"} keyField='id' data={brokers} columns={columns} />
        </Col>

      </div>
    );
  }
}

export default Filter;