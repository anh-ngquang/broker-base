import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import readXlsxFile from 'read-excel-file';
import axios from 'axios';

import '../css/Import.css';

class Import extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fromSite: "batdongsan.com.vn",
            importBatchCode: "",
            importRows: [],
            isLoading: false
        };
    }

    validateForm() {
        return this.state.importRows.length > 0 && this.state.importBatchCode.length > 0;
    }

    handleSubmit = event => {
        event.preventDefault() // Stop form submit

        const {
            fromSite,
            importBatchCode,
            importRows
        } = this.state;

        axios.post('/api/broker/import', {
            siteName: fromSite,
            rowsData: importRows,
            batchCode: importBatchCode
        }).then(response => {

            console.log('response data: ', response.data);

            if (response.data.success) {
                this.setState({
                    isLoading: false
                });

            } else {
                this.setState({
                    isLoading: false,
                });
            }

        }).catch(error => {
            this.setState({
                isLoading: false,
            });

            console.log('error', error);
        });
    }

    handleFileChange = event => {
        readXlsxFile(event.target.files[0]).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            this.setState({
                importRows: rows
            });
            console.log(this.state.importRows);
        })
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {

        return (
            <div className="Import">
                <form onSubmit={this.handleSubmit}>
                    <h1>Import Broker List</h1>
                    <br />
                    <FormGroup controlId="file" bsSize="large">
                        <ControlLabel>File to import:</ControlLabel>
                        <FormControl
                            onChange={this.handleFileChange}
                            type="file"
                        />
                    </FormGroup>
                    <FormGroup controlId="fromSite">
                        <ControlLabel>From site:</ControlLabel>
                        <FormControl onChange={this.handleInputChange} componentClass="select" placeholder="select">
                            <option value="batdongsan.com.vn">Batdongsan.com.vn</option>
                            <option value="mangnhadat.com.vn">Mangnhadat.com.vn</option>
                            <option value="alonhadat.com.vn">Alonhadat.com.vn</option>
                            <option value="homedy.com">Homedy.com</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="importBatchCode">
                        <ControlLabel>Import Batch Code:</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.importBatchCode}
                            onChange={this.handleInputChange}
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        type="submit"
                        disabled={this.state.isLoading || !this.validateForm()}
                    >
                        Import
                     </Button>
                </form>
            </div>
        );
    }
}

export default Import;