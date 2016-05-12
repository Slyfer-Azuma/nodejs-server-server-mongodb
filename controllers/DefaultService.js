'use strict';

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

var MONGODB_URI = 'mongodb://localhost:27017/IoT';
var db;
var IoTCollection;

mongodb.MongoClient.connect(MONGODB_URI, function(err, database) {
  if(err) throw err;
 
  db = database;
  IoTCollection = db.collection('IoTCollection');
});


exports.messagesPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * message (Message)
  **/
  // no response value expected for this operation

  var IoTDocument = {'_id': args['message']['value']['id'], 'id': args['message']['value']['id'], 'timestamp': args['message']['value']['timestamp'], 'sensorType': args['message']['value']['sensorType'], 'value': args['message']['value']['value']};
  
  IoTCollection.insertOne(IoTDocument, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        //console.log('Inserted:', result['ops'][0]['_id']);
      }
    });

  res.end();
}

exports.messagesSynthesisGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * timestamp (Date)
  * duration (Integer)
  **/

  console.log(args['timestamp']['originalValue']);
  db.collection('IoTCollection').group(
    {
        "sensorType": true
    },{/*"timestamp": args['timestamp']['originalValue']*/},
       {
        "sumforaverageaveragevalue": 0,
        "countforaverageaveragevalue": 0
    },
    function(obj, prev) {
        prev.minValue = isNaN(prev.minValue) ? obj.value : Math.min(prev.minValue, obj.value);
        prev.maxValue = isNaN(prev.maxValue) ? obj.value : Math.max(prev.maxValue, obj.value);
        prev.sumforaverageaveragevalue += obj.value;
        prev.countforaverageaveragevalue++;
    },
    function(prev) {
        prev.mediumValue = (prev.sumforaverageaveragevalue / prev.countforaverageaveragevalue).toFixed();
        delete prev.sumforaverageaveragevalue;
        delete prev.countforaverageaveragevalue;
    }, function(err, results){
      results.sort(function(a, b){return a.sensorType - b.sensorType;});
      var response = {};
      response['application/json'] = results;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response[Object.keys(response)[0]] || {}, null, 2));
    }
  );
  //res.end();
}

