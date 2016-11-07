var pu = require('../lib/utils');
var _ = require('lodash');
var chai = require("chai");
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

createEchoServer = function (port, delay) {
  delay = delay || 0;
  var http = require('http');
  var s = http.createServer(function (req, resp) {
    var dataToSendBack = '';
    req.on('data', function (chunk) {
      dataToSendBack += chunk;
    });
    req.on('end', function () {
      if (req.method === 'GET') {
        dataToSendBack = {a: 'sample', object: 'here'};
      }
      _.delay(function () {
        resp.writeHead(200, {'content-type': 'application/json'});
        resp.write(JSON.stringify({
          url: req.url,
          method: req.method,
          headers: req.headers,
          result: dataToSendBack
        }));
        resp.end();
      }, delay);
    });
  });
  s.port = port;
  s.url = 'http://localhost:' + port;
  s.protocol = 'http';
  return s;
};

describe('existsIn', function () {
  it('should work with two arrays', function (done) {
    if (pu.existsIn([1, 2, 3], [1, 2])) {
      done();
    } else {
      done(new Error('Failed'));
    }
  });
  it('should work with an array and a value', function (done) {
    if (pu.existsIn([1, 2, 3], 1)) {
      done();
    } else {
      done(new Error('Failed'));
    }
  });

  it('should now work with a non array', function (done) {
    try {
      pu.existsIn(1, 1);
      done(new Error('Should not work!'));
    } catch (e) {
      done();
    }
  });

  it('should not find the element', function (done) {
    if (pu.existsIn([1, 2, 3], [4])) {
      done(new Error('Should not find it!'));
    } else {
      done();
    }
  });

});

describe('httpRequest', function () {

  var s = createEchoServer(6789);
  var o = {
    uri: 'http://127.0.0.1:6789'
  };

  before(function (done) {
    s.listen(s.port, done);
  });

  after(function (done) {
    s.close(done);
  });

  it('should GET a request returning body', function () {

    var options = _.clone(o);
    options.returnBody = true;

    return pu.httpRequest(options)
      .then(function (res) {
        res = JSON.parse(res);
        res.should.have.property('result');
      });
  });

  it('should GET a request with a header', function () {

    var options = _.clone(o);
    options.returnBody = true;
    options.header = {
      'Content-Type': 'application/json'
    };
    return pu.httpRequest(options)
      .then(function (res) {
        res = JSON.parse(res);
        res.should.have.property('result');
      });
  });

  it('should GET a request and return a response object instead of body',
    function () {

      var options = _.clone(o);

      return pu.httpRequest(options)
        .then(function (res) {
          res.should.have.property('request');
          res.should.have.property('statusCode', 200);
          res.request.should.have.property('href', 'http://127.0.0.1:6789/');
          res.should.have.property('body');
          var respObj = JSON.parse(res.body);
          respObj.should.have.property('result');
          respObj.result.should.have.property('a');
        });
    });

  it('should POST a request', function () {
    var options = _.merge({
      body: 'This is a POST body',
      method: 'POST'
    }, o);

    return pu.httpRequest(options)
      .then(function (res) {
        res.should.have.property('body');
        var respObj = JSON.parse(res.body);
        respObj.should.have.property('result');
        respObj.result.should.equal('This is a POST body');
      });
  });

  it('should POST a request as JSON', function () {
    var options = _.merge({
      json: true,
      body: {a: 'sample', object: 'here'},
      method: 'POST'
    }, o);

    return pu.httpRequest(options)
      .then(function (res) {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('body');
        var respObj = res.body;
        respObj.should.have.property('result');
        var result = JSON.parse(respObj.result)
        result.should.have.property('a', 'sample');
        result.should.have.property('object', 'here');
      });
  });

});


describe('postJSONObject', function () {

  var s = createEchoServer(6789, 1000);

  before(function (done) {
    s.listen(s.port, done);
  });

  after(function (done) {
    s.close(done);
  });

  it('should POST a request as JSON', function () {

    return pu.postJSONObject('http://127.0.0.1:6789/',
      {a: 'sample', object: 'here'})
      .then(function (res) {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('result');
        var result = JSON.parse(res.result);
        result.should.have.property('a', 'sample');
        result.should.have.property('object', 'here');
      });
  });

  it('should POST a request as JSON using alias', function () {

    return pu.postJSON('http://127.0.0.1:6789/',
      {a: 'sample', object: 'here'})
      .then(function (res) {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('result');
        var result = JSON.parse(res.result);
        result.should.have.property('a', 'sample');
        result.should.have.property('object', 'here');
      });
  });

  it('should POST a request as JSON but returning a request', function () {

    // last param is returnBody = false
    return pu.postJSONObject('http://127.0.0.1:6789/',
      {a: 'sample', object: 'here'}, undefined, false)
      .then(function (res) {
        res.should.have.property('request');
        res.should.have.property('statusCode', 200);
        res.should.have.property('connection');
        res.connection.should.have.property('bytesRead');
        res.connection.should.have.property('bytesWritten');
        res.request.should.have.property('href', 'http://127.0.0.1:6789/');
        res.should.have.property('body');
        res.body.should.have.property('result');
        var result = JSON.parse(res.body.result);
        result.should.have.property('a', 'sample');
        result.should.have.property('object', 'here');
      });
  });

  it('should return timeout sending a POST request as JSON with 500ms',
    function () {
      return pu.postJSONObject('http://127.0.0.1:6789/',
        {a: 'sample', object: 'here'}, 500)
        .should.be.rejectedWith(Error);
    });

  it('should POST a request as JSON with a 1500ms timeout', function () {

    return pu.postJSONObject('http://127.0.0.1:6789/',
      {a: 'sample', object: 'here'}, 1500)
      .then(function (res) {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('result');
        var result = JSON.parse(res.result);
        result.should.have.property('a', 'sample');
        result.should.have.property('object', 'here');
      });
  });

});


describe('getJSON', function () {

  var s = createEchoServer(6789, 1000);

  before(function (done) {
    s.listen(s.port, done);
  });

  after(function (done) {
    s.close(done);
  });

  it('should GET a response as JSON',
    function () {
      return pu.getJSON('http://127.0.0.1:6789/')
        .then(function (res) {
          res.should.have.property('result');
          var result = res.result;
          result.should.have.property('a', 'sample');
          result.should.have.property('object', 'here');
        });
    });

  it('should GET a response as JSON, returning a response object',
    function () {
      // last param is returnBody = false
      return pu.getJSON('http://127.0.0.1:6789/', undefined, false)
        .then(function (resp) {
          resp.should.have.property('request');
          resp.should.have.property('statusCode', 200);
          resp.should.have.property('connection');
          resp.connection.should.have.property('bytesRead');
          resp.connection.should.have.property('bytesWritten');
          resp.request.should.have.property('href', 'http://127.0.0.1:6789/');
          resp.should.have.property('body');
          resp.body.should.have.property('result');
          var result = resp.body.result;
          result.should.have.property('a', 'sample');
          result.should.have.property('object', 'here');
        });
    });

  it('should return timeout sending a GET request as JSON with 500ms',
    function () {
      return pu.getJSON('http://127.0.0.1:6789/', 500)
        .should.be.rejectedWith(Error);
    });

  it('should GET a request as JSON with a 1500ms timeout',
    function () {
      return pu.getJSON('http://127.0.0.1:6789/', 1500)
        .then(function (res) {
          res.should.have.property('result');
          var result = res.result;
          result.should.have.property('a', 'sample');
          result.should.have.property('object', 'here');
        });
    });

});


describe('promisifier', function () {

  it('should convert a normal function into a promise and resolve',
    function () {
      return pu.promisifier(function () {
          return 'this function should be promisified';
        })()
        .then(function (res) {
          res.should.equal('this function should be promisified');
        });
    });

  it('should convert a normal function into a promise and fail',
    function () {
      return pu.promisifier(function () {
          throw new Error('this function should be promisified');
        })()
        .catch(function (err) {
          err.message.should.equal('this function should be promisified');
        });
    });

});

describe('objectToString', function () {

  it('should convert an empty object into a string',
    function () {
      var s = pu.objectToString({});
      s.should.equal('{}');
    });

  it('should convert an empty array into a string',
    function () {
      var s = pu.objectToString([]);
      s.should.equal('[]');
    });

  it('should convert a deep object into an (also deep) string',
    function () {
      var s = pu.objectToString({a: {b: {c: {d: {e: {f: {g: {h: {i: {j: {k: 1}}}}}}}}}}});
      s.should.equal('{ a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: 1 } } } } } } } } } } }');
    });

  it('should convert a deep object into an (also deep) string, showing hidden attributes',
    function () {
      var obj = {a: {b: {c: {d: {e: {f: {g: {h: {i: {j: {k: 1}}}}}}}}}}};
      Object.defineProperty(obj, 'seeMeNoMore', {
        enumerable: false,
        writable: true,
        value: 'youAreRight'
      });

      var s = pu.objectToString(obj, true);
      s.should.have.string('seeMeNoMore');
    });

  it('should convert a deep object into a string ony 3 levels deep',
    function () {
      var s = pu.objectToString({a: {b: {c: {d: {e: {f: {g: {h: {i: {j: {k: 1}}}}}}}}}}}, false, 3);
      s.should.equal('{ a: { b: { c: { d: [Object] } } } }');
    });

});

