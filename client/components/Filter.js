import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import Select from 'react-select';
import { areaOptions, brokerTypeOptions, propertyTypeOptions, sourceOptions } from '../utils/constant';
import {
  getFromStorage,
} from '../utils/storage';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';

import '../css/Filter.css';
import '../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../../node_modules/react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isFiltering: false,
      token: '',
      filterArea: [],
      filterBrokerType: [],
      filterPropertyType: [],
      filterSource: [],
      brokers: [],
      didFilter: false
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

    this.setState({
      isFiltering: true,
      brokers: []
    });

    const {
      filterArea,
      filterBrokerType,
      filterPropertyType,
      filterSource
    } = this.state;

    axios.post('/api/broker/filter', {
      filterArea: filterArea,
      filterBrokerType: filterBrokerType,
      filterPropertyType: filterPropertyType,
      filterSource: filterSource
    }).then(response => {

      console.log('response data: ', response.data);
      this.setState({
        isFiltering: false,
        brokers: response.data.brokers,
        didFilter: true
      });

    }).catch(error => {
      this.setState({
        isFiltering: false,
        didFilter: true
      });
      console.log('error', error);
    });
  }

  render() {
    const {
      isLoading,
      isFiltering,
      token,
      brokers
    } = this.state;

    const columns = [{
      dataField: 'name',
      text: 'Tên'
    }, {
      dataField: 'phone',
      text: 'Số điện thoại'
    }, {
      dataField: 'email',
      text: 'Email',
      headerStyle: { width: '30%' },
      style: { 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'textOverflow': 'ellipsis' }
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

    var filterBtnTitle = (this.state.isFiltering == true) ? "Đang lọc ..." : "Lọc";
    var resultCountLabel = (this.state.didFilter == true && this.state.isFiltering == false) ? "(" + brokers.length + " kết quả)" : "";

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
                onChange={this.handleFilterBrokerTypeChange}
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
                onChange={this.handleFilterPropertyTypeChange}
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
                onChange={this.handleFilterSourceChange}
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
              disabled={this.state.isFiltering}
            >
              {filterBtnTitle}
            </Button>
          </Form>
          <div>
            <h4>{resultCountLabel}</h4>
            {brokers.length > 0 && (
              <Button
                block
                bsSize="large"
                bsStyle="primary"
                type="submit"
              >
                Xuất CSV
            </Button>
            )}
          </div>
        </Col>
        <Col md={9}>
          <BootstrapTable wrapperClasses={"brokerTable"} keyField='phone' data={brokers} columns={columns} pagination={paginationFactory()} />
        </Col>

      </div>
    );
  }
}

export default Filter;