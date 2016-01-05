var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
Promise.promisifyAll(request);

var _ = require("lodash");

function httpRequest(options) {
  return request(options)
    .spread(function (response, body) {
      var code = response.statusCode;
      if (code === 200) {
        return body;
      } else {
        throw new Error(JSON.stringify({statusCode: response.statusCode, body: body}));
      }
    });
}

function success(jsonObject) {

  if (_.isString(jsonObject)) {
    jsonObject = {message: jsonObject};
  }
  return _.merge({
    response: "ok"
  }, jsonObject);
}

function fail(errCode, errMessage, jsonObject) {
  return _.merge({
    response: "fail",
    code: errCode,
    message: errMessage
  }, jsonObject);
}

function postJSONObject(url, JSONObject, timeout) {
  var options = {
    uri: url,
    json: true,
    body: JSONObject,
    method: "post"
  };
  if (timeout) {
    options.timeout = timeout;
  }
  return httpRequest(options);
}

function postXML(url, xml) {
  var options = {
    uri: url,
    body: xml,
    headers: {
      'Content-Type': 'text/xml'
    },
    method: "post"
  };
  return httpRequest(options);
}

function get(url) {
  var options = {
    uri: url,
    method: "get"
  };
  return httpRequest(options);
}

function getJSON(url) {
  var options = {
    uri: url,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    method: "get"
  };
  return httpRequest(options);
}

function existsIn(sourceArray, itemsToMatch) {
  return sourceArray.some(function (sourceElement) {
    return itemsToMatch.some(function (matchElement) {
      return matchElement === sourceElement;
    });
  });
}

// Functions which will be available to external callers
module.exports.success = success;
module.exports.fail = fail;
module.exports.postJSONObject = postJSONObject;
module.exports.postXML = postXML;
module.exports.get = get;
module.exports.getJSON = getJSON;
module.exports.existsIn = existsIn;
