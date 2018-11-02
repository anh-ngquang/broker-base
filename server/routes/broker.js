var express = require('express');
var router = express.Router();
var Broker = require('../../models/Broker.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express REST API');
});

// Batch import site's broker data into DB
router.post('/import', function(req, res, next) {
  const { body } = req;
  const {
    siteName,
    rowsData,
    batchCode
  } = body;

  if (rowsData.length > 0) {
    var importBroker = new Broker();
    try {
      importBroker.fromSiteExelRow(siteName, rowsData[1]);
    } catch (e) {
      console.log(e);
    }
  }

  var importedRowCount = 0;
  var currentRow = 0;
  
  // for each row:

  // convert rowData to Broker model

  // check db for existing record based on Phone number

    // if not exists
      // INSERT NEW RECORD

      // response

    // if exists
      // get Broker model from db

      // update imported model info into current model
      // check for same source and import_batch_code => if true: do not update Properties
      // areas + lowercase
      // properties + lowercase
      // sources
      // updated_date
      // import_batch_code

      // UPDATE DB

      // response
  
      return res.send({
        success: true,
        totalUploadedRows: rowsData.length
      });
});

module.exports = router;