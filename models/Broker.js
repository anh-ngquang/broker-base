const mongoose = require('mongoose');

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

}

// Site's broker model

// Batdongsan.com.vn
function BDSCOMVNBroker(excelRowData) {
    
}

module.exports = mongoose.model('Broker', BrokerSchema);