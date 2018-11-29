import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import readXlsxFile from 'read-excel-file';

import '../css/ExcelToSmsList.css';

class ExcelToSmsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            numberList: [],
            numberPerSms: 10,
            smsList: "",
            isLoading: false
        };
    }

    handleFileChange = event => {
        readXlsxFile(event.target.files[0]).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.

            this.setState({
                numberList: rows,
            });

            this.convert();
        })
    }

    handleConvert = event => {
        this.convert();
    }

    convert = () => {
        var currentRow = 0;
        const {
            numberList
        } = this.state;

        var smsListText = "";
        var smsListSegmentArray = [];

        for (var row of numberList) {
            currentRow++;

            let number = row[0];
            smsListSegmentArray.push(number);

            // if current segment have (numberPerSms) numbers or this is the last number
            if (smsListSegmentArray.length == this.state.numberPerSms || currentRow == numberList.length) {
                smsListText += smsListSegmentArray.join(', ') + "\n\n";
                smsListSegmentArray = [];
            }
        }

        this.setState({
            smsList: smsListText
        });
    }

    handleInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {

        return (
            <div className="ExcelToSmsList">
                <h1>Chuyển File Excel Sdt sang Danh sách số nhắn tin SMS</h1>
                <form>
                    <br />
                    <FormGroup controlId="file" bsSize="large">
                        <ControlLabel>File danh sách số:</ControlLabel>
                        <FormControl
                            onChange={this.handleFileChange}
                            type="file"
                        />
                    </FormGroup>
                    <FormGroup controlId="numberPerSms">
                        <ControlLabel>Số lượng số mỗi SMS:</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.numberPerSms}
                            onChange={this.handleInputChange}
                        />
                    </FormGroup>
                    <Button
                        onClick={this.handleConvert}
                    >
                        Chuyển đổi
                     </Button>
                    <hr />
                    <FormGroup controlId="listSms">
                        <ControlLabel>Danh sách số nhắn tin SMS:</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            rows={20}
                            value={this.state.smsList}
                        />
                    </FormGroup>
                </form>
            </div>
        );
    }
}

export default ExcelToSmsList;