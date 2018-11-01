var express = require('express');
var router = express.Router();

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
        success: true
      });
});

module.exports = router;