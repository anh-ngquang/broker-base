var express = require('express');
var router = express.Router();
var Broker = require('../../models/Broker.js');
var SourceOrder = require('../../models/SourceOrder.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Express REST API');
});

// Batch import site's broker data into DB
router.post('/import', async function (req, res, next) {
  const { body } = req;
  const {
    siteName,
    rowsData,
    batchCode
  } = body;

  // if (rowsData.length > 0) {
  //   var importBroker = new Broker();
  //   try {
  //     importBroker.fromSiteExelRow(siteName, rowsData[5]);
  //     console.log("Import Broker: ", importBroker);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  var importedRowCount = 0;
  var currentRow = 0;
  var importError;

  // for each row:
  for (var rowData of rowsData) {
    currentRow++;

    // convert rowData to Broker model
    var importBroker = new Broker();
    importBroker.import_batch_code = batchCode;
    try {
      importBroker.fromSiteExelRow(siteName, rowData);
    } catch (e) {
      console.log(e);
      continue;
    }

    // check db for existing record based on Phone number
    var dbBrokers;
    await Broker.find({ phone: importBroker.phone }, function (err, docs) {
      if (err) {
        importError = err;
        return;
      }

      dbBrokers = docs;
    });

    if (importError) break;

    if (!dbBrokers || dbBrokers.length == 0) {
      // if not exists
      // INSERT NEW RECORD
      importBroker.created_date = new Date();
      await importBroker.save(function (err) {
        if (err) {
          importError = err;
          return;
        }
      });
      if (importError) break;

    } else {
      // if exists
      // get Broker model from db
      var dbBroker = dbBrokers[0];

      // update imported model info into current model
      // do not update: name, phone

      if (dbBroker.email == '') {
        dbBroker.email = importBroker.email;
      }

      if (dbBroker.address == '') {
        dbBroker.address = importBroker.address;
        dbBroker.address_lowercase = importBroker.address_lowercase;
      }

      if (importBroker.areas && importBroker.areas.length > 0 && !dbBroker.areas.includes(importBroker.areas[0])) {
        dbBroker.areas.push(importBroker.areas[0]);
        dbBroker.areas_lowercase.push(importBroker.areas_lowercase[0]);
      }

      if (dbBroker.import_batch_code != importBroker.import_batch_code) {
        // different import_batch_code => clear all current Properties and insert again
        dbBroker.sell_properties = [];
        dbBroker.sell_properties_lowercase = [];
        dbBroker.rent_properties = [];
        dbBroker.rent_properties_lowercase = [];
        dbBroker.transfer_properties = [];
        dbBroker.transfer_properties_lowercase = [];
        dbBroker.other_properties = [];
        dbBroker.other_properties_lowercase = [];
        dbBroker.all_properties = [];
        dbBroker.all_properties_lowercase = [];
      }

      for (var property of importBroker.sell_properties) {
        dbBroker.sell_properties.push(property);
      }
      for (var property of importBroker.sell_properties_lowercase) {
        dbBroker.sell_properties_lowercase.push(property);
      }
      for (var property of importBroker.rent_properties) {
        dbBroker.rent_properties.push(property);
      }
      for (var property of importBroker.rent_properties_lowercase) {
        dbBroker.rent_properties_lowercase.push(property);
      }
      for (var property of importBroker.transfer_properties) {
        dbBroker.transfer_properties.push(property);
      }
      for (var property of importBroker.transfer_properties_lowercase) {
        dbBroker.transfer_properties_lowercase.push(property);
      }
      for (var property of importBroker.other_properties) {
        dbBroker.other_properties.push(property);
      }
      for (var property of importBroker.other_properties_lowercase) {
        dbBroker.other_properties_lowercase.push(property);
      }
      for (var property of importBroker.all_properties) {
        dbBroker.all_properties.push(property);
      }
      for (var property of importBroker.all_properties_lowercase) {
        dbBroker.all_properties_lowercase.push(property);
      }

      if (importBroker.sources && importBroker.sources.length > 0 && !dbBroker.sources.includes(importBroker.sources[0])) {
        dbBroker.sources.push(importBroker.sources[0]);
      }

      dbBroker.updated_date = new Date();
      dbBroker.import_batch_code = importBroker.import_batch_code;

      // UPDATE DB
      Broker.update({ _id: dbBroker._id }, dbBroker, function (err, result) {
        if (err) {
          importError = err;
          return;
        }
      });
      if (importError) break;
    }

    importedRowCount++;
  }
  // response
  if (importError) {
    return res.send({
      success: false,
      error: importError
    });
  }

  return res.send({
    success: true,
    totalUploadedRows: rowsData.length - 1,
    totalImportedRows: importedRowCount
  });
});

// Filter broker from DB
router.post('/filter', async function (req, res, next) {
  const { body } = req;

  const {
    filterArea,
    filterBrokerType,
    filterPropertyType,
    filterSource
  } = body;

  // console.log(body);
  let findQuery = {}

  // AREA FILTER
  if (filterArea && filterArea.length > 0) {
    let areaRegexText = filterArea.map(e => e.value).join("|");
    findQuery.areas_lowercase = { $regex: areaRegexText }
  }

  // BROKER TYPE AND PROPERTY TYPE FILTER
  let brokerTypeListRegexText = '';
  if (filterBrokerType && filterBrokerType.length > 0) {
    brokerTypeListRegexText = filterBrokerType.map(e => e.value).join("|");
  }

  let propertyTypeListRegexText = '';
  if (filterPropertyType && filterPropertyType.length > 0) {
    propertyTypeListRegexText = filterPropertyType.map(e => e.value).join("|");
  }

  let brokerAndPropertyRegexText = '';
  if (brokerTypeListRegexText != '') {
    brokerAndPropertyRegexText += '(?=.*?(' + brokerTypeListRegexText + '))';
  }
  if (propertyTypeListRegexText != '') {
    brokerAndPropertyRegexText += '(?=.*?(' + propertyTypeListRegexText + '))';
  }
  //console.log("brokerAndPropertyRegexText: ", brokerAndPropertyRegexText);
  if (brokerAndPropertyRegexText != '') {
    findQuery.all_properties_lowercase = { $regex: brokerAndPropertyRegexText }
  }

  // SOURCE FILTER
  if (filterSource && filterSource.length > 0) {
    let sourceRegexText = filterSource.map(e => e.value).join("|");
    findQuery.sources = { $regex: sourceRegexText }
  }

  await Broker.find(findQuery, async function (err, brokers) {

    if (err) {
      return res.send({
        success: false,
        error: err
      });
    }

    console.log("Broker counts: ", brokers.length);

    // order brokers by Source and property count
    await SourceOrder.find({}, function (err, sourceOrders) {
      if (err) {
        return res.send({
          success: false,
          error: err
        });
      }

      let brokerViewModelArray = brokers.map(function (e) {
        return {
          name: e.name,
          phone: e.phone,
          email: e.email,
          areas: e.areas.join(' | '),
          sources: e.sources.join(' | '),
          source_order: getSourceOrder(e.sources, sourceOrders),
          property_count: e.all_properties.length
        };
      });

      brokerViewModelArray.sort(function(a,b){
        if(a.source_order == b.source_order){
          return a.property_count < b.property_count ? 1 : a.property_count > b.property_count ? -1 : 0;
        }
      
        return a.source_order > b.source_order ? 1 : -1;
      });
  
      return res.send({
        success: true,
        brokers: brokerViewModelArray
      });

    });
  });
});

function getSourceOrder(sources, sourceOrders) {
  let minSourceOrder = 100000;
  sources.forEach(source => {
    let sourceOrder = sourceOrders.find(x => x.name === source).order;
    if (sourceOrder < minSourceOrder) {
      minSourceOrder = sourceOrder
    }
  });
  return minSourceOrder;
};

module.exports = router;