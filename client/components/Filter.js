import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import Select from 'react-select';
import { areaOptions, brokerTypeOptions, propertyTypeOptions } from '../utils/constant';
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
            <FormGroup controlId="formInlineArea">
              <ControlLabel>Khu vực: </ControlLabel>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={areaOptions}
                placeholder="Chọn..."
              />
            </FormGroup>
            <FormGroup controlId="formInlineBrokerType">
              <ControlLabel>Loại hình môi giới: </ControlLabel>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={brokerTypeOptions}
                placeholder="Chọn..."
              />
            </FormGroup>
            <FormGroup controlId="formInlinePropertyType">
              <ControlLabel>Loại hình BĐS: </ControlLabel>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={propertyTypeOptions}
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