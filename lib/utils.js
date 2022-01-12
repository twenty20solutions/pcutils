const request = require('request');
const _ = require('lodash');

/**
 * Executes an HTTP request.
 *
 * @param {Object} options request options object. See
 * https://github.com/request/request#requestoptions-callback
 * @returns {Promise} returns a promise where the body is the data of the
 * request
 */
async function httpRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, (reqErr, response, body) => {
      if (reqErr) {
        return reject(reqErr);
      }
      if (response.statusCode >= 400 && response.statusCode <= 599) { // eslint-disable-line no-magic-numbers
        let err = new Error(response.statusMessage);
        err.statusMessage = response.statusMessage;
        err.statusCode = response.statusCode;
        if (!options.returnBody) {
          err = _.merge(err, response);
        }
        return reject(err);
      }
      if (options.returnBody) {
        return resolve(body);
      }
      return resolve(response);
    });
  });
}

/**
 * Sends a JSON object to and endpoint as an HTTP POST
 *
 * @alias postJSON
 * @param {string} url URL of the endpoint
 * @param {Object} objToSend Object to send
 * @param {number} timeout Integer containing the number of milliseconds to
 * wait for a server to send response headers (and start the response body)
 * before aborting the request. Note that if the underlying TCP connection
 * cannot be established, the OS-wide TCP connection timeout will overrule the
 * timeout option (the default in Linux can be anywhere from 20-120 seconds).
 * @param {boolean} returnBody defaults to `true`. Instructs the function to return
 * body if true, or the response object response if false.
 * @returns {Promise} returns a promise where the body is the data of the
 * response if the param returnBody evaluates to true, or the response object
 * itself, if the returnBody parameter evaluates to false (like when not passed
 * at all)
 */
async function postJSON(url, objToSend, timeout, returnBody = true) {
  if (!_.isBoolean(returnBody)) {
    returnBody = true;
  }
  const options = {
    uri: url,
    json: true,
    body: objToSend,
    header: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    returnBody
  };
  if (_.isNumber(timeout)) {
    options.timeout = timeout;
  }
  return httpRequest(options);
}

/**
 * Get a JSON object from an endpoint as an HTTP GET
 * @param {string} url URL of the endpoint
 * @param {number} timeout Integer containing the number of milliseconds to
 * wait for a server to send response headers (and start the response body)
 * before aborting the request. Note that if the underlying TCP connection
 * cannot be established, the OS-wide TCP connection timeout will overrule the
 * timeout option (the default in Linux can be anywhere from 20-120 seconds).
 * @param {boolean} returnBody defaults to `true`. Instructs the function to return
 * body if true, or request if false.
 * @returns {Promise} returns a promise where the body is the data of the
 * response if the param returnBody evaluates to true, or the response object
 * itself, if the returnBody parameter evaluates to false (like when not passed
 * at all)
 */
async function getJSON(url, timeout, returnBody = true) {
  if (!_.isBoolean(returnBody)) {
    returnBody = true;
  }
  const options = {
    uri: url,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    returnBody
  };
  if (_.isNumber(timeout)) {
    options.timeout = timeout;
  }
  return httpRequest(options);
}

// Functions which will be available to external callers
module.exports.httpRequest = httpRequest;
module.exports.postJSONObject = postJSON;
module.exports.postJSON = postJSON;
module.exports.getJSON = getJSON;
