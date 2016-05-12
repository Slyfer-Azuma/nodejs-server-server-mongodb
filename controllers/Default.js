'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.messagesPOST = function messagesPOST (req, res, next) {
  Default.messagesPOST(req.swagger.params, res, next);
};

module.exports.messagesSynthesisGET = function messagesSynthesisGET (req, res, next) {
  Default.messagesSynthesisGET(req.swagger.params, res, next);
};
