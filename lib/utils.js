/* global Promise */
var Promise = require('bluebird');
var request = require('request');
var _ = require('lodash');
var util = require('util');

/**
 * Checks if itemsToMatch exists in source
 * @param {array} source Source array
 * @param {array} itemsToMatch items that should exist in the source array
 * @returns {boolean}
 */
function existsIn(source, itemsToMatch) {
  if (!_.isArray(source)) {
    throw new Error('source is not an array');
  }
  if (!_.isArray(itemsToMatch)) {
    itemsToMatch = [itemsToMatch];
  }
  return source.some(function (sourceElement) {
    return itemsToMatch.some(function (matchElement) {
      return matchElement === sourceElement;
    });
  });
}

/**
 * Executes an HTTP request.
 *
 * @param {Object} options request options object. See
 * https://github.com/request/request#requestoptions-callback
 * @returns {Promise} returns a promise where the body is the data of the
 * request
 */
function httpRequest(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (err, response, body) {
      if (err) {
        return reject(err);
      }
      if (options.returnBody) {
        return resolve(body);
      } else {
        return resolve(response);
      }
    });
  });
}

/**
 * Sends a JSON object to and endpoint as an HTTP POST
 *
 * @alias postJSON
 * @param {string} url URL of the endpoint
 * @param {Object} objToSend Object to send
 * @param {integer} timeout Integer containing the number of milliseconds to
 * wait for a server to send response headers (and start the response body)
 * before aborting the request. Note that if the underlying TCP connection
 * cannot be established, the OS-wide TCP connection timeout will overrule the
 * timeout option (the default in Linux can be anywhere from 20-120 seconds).
 * @param {boolean} defaults to `true`. Instructs the function to return
 * body if true, or the response object response if false.
 * @returns {Promise} returns a promise where the body is the data of the
 * response if the param returnBody evaluates to true, or the response object
 * itself, if the returnBody parameter evaluates to false (like when not passed
 * at all)
 */
function postJSONObject(url, objToSend, timeout, returnBody) {
  if (!_.isBoolean(returnBody)) {
    returnBody = true;
  }
  var options = {
    uri: url,
    json: true,
    body: objToSend,
    header: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    returnBody: returnBody
  };
  if (_.isNumber(timeout)) {
    options.timeout = timeout;
  }
  return httpRequest(options);
}

/**
 * Get a JSON object from an endpoint as an HTTP GET
 * @param {string} url URL of the endpoint
 * @param {integer} timeout Integer containing the number of milliseconds to
 * wait for a server to send response headers (and start the response body)
 * before aborting the request. Note that if the underlying TCP connection
 * cannot be established, the OS-wide TCP connection timeout will overrule the
 * timeout option (the default in Linux can be anywhere from 20-120 seconds).
 * @param {boolean} defaults to `true`. Instructs the function to return
 * body if true, or request if false.
 * @returns {Promise} returns a promise where the body is the data of the
 * response if the param returnBody evaluates to true, or the response object
 * itself, if the returnBody parameter evaluates to false (like when not passed
 * at all)
 */
function getJSON(url, timeout, returnBody) {
  if (!_.isBoolean(returnBody)) {
    returnBody = true;
  }
  var options = {
    uri: url,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    returnBody: returnBody
  };
  if (_.isNumber(timeout)) {
    options.timeout = timeout;
  }
  return httpRequest(options);
}

/**
 * Promisifies a function that is not originally one
 * @param {function} originalFunction The original function to promisify
 * @return {function} The promisified function
 */
function promisifier(originalFunction) {
  // return a function
  return function promisified() {
    var args = [].slice.call(arguments);
    // Needed so that the original method can be called with the correct receiver
    var self = this;
    // which returns a promise
    return new Promise(function (resolve, reject) {
      try {
        resolve(originalFunction.apply(self, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
/**
 * Object To String. Converts an object to a string. By default it does it deeply
 * @param obj Object to transform into string
 * @param showHidden Show hidden fields. By default it's false
 * @param depth How deep you want it to be. By default, goes to the end!
 * @return String The string representation of the object
 */
function objectToString(obj, showHidden, depth) {
  if (!showHidden) {
    showHidden = false;
  }
  if (!depth) {
    depth = null;
  }
  return util.inspect(obj, {showHidden: showHidden, depth: depth});
}

// Functions which will be available to external callers
module.exports.existsIn = existsIn;
module.exports.httpRequest = httpRequest;
module.exports.postJSONObject = module.exports.postJSON = postJSONObject;
module.exports.getJSON = getJSON;
module.exports.promisifier = promisifier;
module.exports.objectToString = module.exports.ots = objectToString;
