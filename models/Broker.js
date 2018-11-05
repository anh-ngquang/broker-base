const mongoose = require('mongoose');
const commonUtils = require('../server/utils/common');

const BrokerSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    phone_1: { type: String, default: '' },
    email: { type: String, default: '' },
    areas: [String],
    areas_lowercase: [String],
    address: { type: String, default: '' },
    address_lowercase: { type: String, default: '' },
    sell_properties: [String],
    sell_properties_lowercase: [String],
    rent_properties: [String],
    rent_properties_lowercase: [String],
    transfer_properties: [String],
    transfer_properties_lowercase: [String],
    other_properties: [String],
    other_properties_lowercase: [String],
    all_properties: [String],
    all_properties_lowercase: [String],
    sources: [String],
    created_date: Date,
    updated_date: Date,
    import_batch_code: { type: String, default: '' }
});

BrokerSchema.methods.fromSiteExelRow = function (sitename, rowData) {
    console.log(sitename);

    // common import fields
    this.sources.push(sitename)

    switch (sitename) {
        case 'batdongsan.com.vn':
            try {
                var siteBroker = new BDSCOMVNBroker(rowData);

                this.name = siteBroker.name;
                this.email = siteBroker.email;
                this.phone = siteBroker.phone;
                this.address = siteBroker.address;

                // TODO: get properties from BDSCOMVNBroker

            } catch (e) {
                console.log(e);
                throw "Parse error";
            }
            break;

        case 'alonhadat.com.vn':
            try {
                var siteBroker = new AlonhadatBroker(rowData);

                this.name = siteBroker.name;
                this.phone = siteBroker.phone;
                this.address = siteBroker.address;
                this.address_lowercase = siteBroker.address.toLowerCase();
                this.areas.push(siteBroker.area);
                this.areas_lowercase.push(siteBroker.area.toLowerCase());

                var properties = JSON.parse(siteBroker.properties);
                if (properties.length > 0) {
                    properties.forEach((property) => {
                        this.all_properties.push(property.properties);
                        this.all_properties_lowercase.push(property.properties.toLowerCase());
                    });
                }

                console.log(siteBroker);
            } catch (e) {
                console.log(e);
                throw "Parse error";
            }
            break;

        case 'mangnhadat.com.vn':
            try {
                var siteBroker = new MangnhadatBroker(rowData);
                console.log(siteBroker);

                // check broker from Hanoi?
                var bAddressLower = siteBroker.address.toLowerCase();
                var bSellPropsLower = siteBroker.sell_properties.toLowerCase();
                var bRentPropsLower = siteBroker.rent_properties.toLowerCase();
                var bTransferPropsLower = siteBroker.transfer_properties.toLowerCase();
                var hanoiText = "hà nội";

                if (!(bAddressLower.includes(hanoiText)
                    || bSellPropsLower.includes(hanoiText)
                    || bRentPropsLower.includes(hanoiText)
                    || bTransferPropsLower.includes(hanoiText))) {
                    throw "Broker not at Hanoi";
                }

                this.name = siteBroker.name;
                this.phone = siteBroker.phone;
                this.email = siteBroker.email;
                this.address = siteBroker.address;
                this.address_lowercase = siteBroker.address.toLowerCase();

                var sell_properties = JSON.parse(siteBroker.sell_properties);
                if (sell_properties.length > 0) {
                    sell_properties.forEach((sell_property) => {
                        var sell = sell_property.sell;

                        this.sell_properties.push(sell);
                        this.sell_properties_lowercase.push(sell.toLowerCase());

                        this.all_properties.push(sell);
                        this.all_properties_lowercase.push(sell.toLowerCase());
                    });
                }

                var rent_properties = JSON.parse(siteBroker.rent_properties);
                if (rent_properties.length > 0) {
                    rent_properties.forEach((rent_property) => {
                        var rent = rent_property.rent;

                        this.rent_properties.push(rent);
                        this.rent_properties_lowercase.push(rent.toLowerCase());

                        this.all_properties.push(rent);
                        this.all_properties_lowercase.push(rent.toLowerCase());
                    });
                }

                var transfer_properties = JSON.parse(siteBroker.transfer_properties);
                if (transfer_properties.length > 0) {
                    transfer_properties.forEach((transfer_property) => {
                        var transfer = transfer_property.transfer;

                        this.transfer_properties.push(transfer);
                        this.transfer_properties_lowercase.push(transfer.toLowerCase());

                        this.all_properties.push(transfer);
                        this.all_properties_lowercase.push(transfer.toLowerCase());
                    });
                }
            } catch (e) {
                console.log(e);
                throw "Parse error";
            }
            break;

        case 'homedy.com':
            try {
                var siteBroker = new HomedyBroker(rowData);
                console.log(siteBroker);

                this.name = siteBroker.name;
                this.phone = siteBroker.phone;
                this.email = siteBroker.email;

                this.areas.push(siteBroker.area);
                this.areas_lowercase.push(siteBroker.area.toLowerCase());

                if (siteBroker.sell_properties) {

                    var sell_properties = JSON.parse(siteBroker.sell_properties);
                    if (sell_properties.length > 0) {
                        sell_properties.forEach((sell_property) => {
                            var sell = sell_property.property_items;

                            this.sell_properties.push(sell);
                            this.sell_properties_lowercase.push(sell.toLowerCase());

                            this.all_properties.push(sell);
                            this.all_properties_lowercase.push(sell.toLowerCase());
                        });
                    }

                } else if (siteBroker.rent_properties) {

                    var rent_properties = JSON.parse(siteBroker.rent_properties);
                    if (rent_properties.length > 0) {
                        rent_properties.forEach((rent_property) => {
                            var rent = rent_property.property_items;

                            this.rent_properties.push(rent);
                            this.rent_properties_lowercase.push(rent.toLowerCase());

                            this.all_properties.push(rent);
                            this.all_properties_lowercase.push(rent.toLowerCase());
                        });
                    }

                }
            } catch (e) {
                console.log(e);
                throw "Parse error";
            }
            break;
        default:
            break;
    }
}

// Site's broker model

// Batdongsan.com.vn
function BDSCOMVNBroker(excelRowData) {
    try {
        // console.log(excelRowData);
        this.name = excelRowData[0];
        this.address = excelRowData[1];
        this.phone = commonUtils.convertPhoneNumberToTenDigits(commonUtils.convertToPhoneNumber(excelRowData[2]));
        this.properties = excelRowData[3];
        this.email = excelRowData[4];

        if (!commonUtils.isPhoneNumber(this.phone)) {
            throw "Phone number invalid";
        }

    } catch (e) {
        console.log('error: ', e);
        throw "Parse data error";
    }
}

// Alonhadat.com.vn
function AlonhadatBroker(excelRowData) {
    try {
        console.log(excelRowData);
        this.name = excelRowData[2];
        this.address = excelRowData[4];
        this.phone = commonUtils.convertPhoneNumberToTenDigits(commonUtils.convertToPhoneNumber(excelRowData[3]));
        this.area = excelRowData[4];
        this.properties = excelRowData[8];

        if (!commonUtils.isPhoneNumber(this.phone)) {
            throw "Phone number invalid";
        }

    } catch (e) {
        console.log('error: ', e);
        throw "Parse data error";
    }
}

// Mangnhadat.com.vn
function MangnhadatBroker(excelRowData) {
    try {
        console.log(excelRowData);
        this.name = excelRowData[2];
        this.address = excelRowData[3];
        this.email = excelRowData[4];
        this.phone = commonUtils.convertPhoneNumberToTenDigits(commonUtils.convertToPhoneNumber(excelRowData[5]));
        this.sell_properties = excelRowData[8];
        this.rent_properties = excelRowData[9];
        this.transfer_properties = excelRowData[10];

        if (!commonUtils.isPhoneNumber(this.phone)) {
            throw "Phone number invalid";
        }

    } catch (e) {
        console.log('error: ', e);
        throw "Parse data error";
    }
}

// Homedy.com
function HomedyBroker(excelRowData) {
    try {
        console.log(excelRowData);
        this.name = excelRowData[3];
        this.email = excelRowData[7];
        this.area = excelRowData[2];

        var phoneString = excelRowData[4];
        this.phone = commonUtils.convertPhoneNumberToTenDigits(commonUtils.convertToPhoneNumber(phoneString.substring(4))); // phoneString format from scraped data: "tel:0123..."
        if (!commonUtils.isPhoneNumber(this.phone)) {
            throw "Phone number invalid";
        }

        var properties_type_string = excelRowData[9];
        if (properties_type_string.includes("Bán")) {
            this.sell_properties = excelRowData[11];
        } else if (properties_type_string.includes("Thuê")) {
            this.rent_properties = excelRowData[11];
        }

    } catch (e) {
        console.log('error: ', e);
        throw "Parse data error";
    }
}

module.exports = mongoose.model('Broker', BrokerSchema);