const mongoose = require('mongoose');
const SourceOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 10
  }
});
module.exports = mongoose.model('SourceOrder', SourceOrderSchema);