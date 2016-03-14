var pu = require('../lib/utils');
var _ = require('lodash');
var _ = require('lodash');
var chai = require("chai");
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

createEchoServer = function(port, delay) {
  delay = delay || 0;
  var http = require('http');
  var s = http.createServer(function(req, resp) {
    var b = '';
    req.on('data', function(chunk) {
      b += chunk;
    });
    req.on('end', function() {
      if (req.method === 'GET') {
        b = {a: 'sample', object: 'here'};
      }
      _.delay(function() {
        resp.writeHead(200, {'content-type': 'application/json'});
        resp.write(JSON.stringify({
          url: req.url,
          method: req.method,
          headers: req.headers,
          body: b
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

describe('existsIn', function() {
  it('should work with two arrays', function(done) {
    if (pu.existsIn([1, 2, 3], [1, 2])) {
      done();
    } else {
      done(new Error('Failed'));
    }
  });
  it('should work with an array and a value', function(done) {
    if (pu.existsIn([1, 2, 3], 1)) {
      done();
    } else {
      done(new Error('Failed'));
    }
  });

  it('should now work with a non array', function(done) {
    try {
      pu.existsIn(1, 1);
      done(new Error('Should not work!'));
    } catch (e) {
      done();
    }
  });

  it('should not find the element', function(done) {
    if (pu.existsIn([1, 2, 3], [4])) {
      done(new Error('Should not find it!'));
    } else {
      done();
    }
  });

});

describe('httpRequest', function() {

  var s = createEchoServer(6789);
  var o = {
    uri: 'http://127.0.0.1:6789'
  };

  before(function(done) {
    s.listen(s.port, done);
  });

  after(function(done) {
    s.close(done);
  });

  it('should GET a request', function() {

    var options = _.clone(o);
    options.returnBody = true;

    return pu.httpRequest(options)
      .then(function(res) {
        res = JSON.parse(res);
        res.should.have.property('body');

      });
  });


  it('should GET a request with a header', function() {

    var options = _.clone(o);
    options.returnBody = true;
    options.header = {
      'Content-Type': 'application/json'
    };
    return pu.httpRequest(options)
      .then(function(res) {
        res = JSON.parse(res);
        res.should.have.property('body');

      });
  });


  it('should GET a request and return a response object instead of body',
    function() {

      var options = _.clone(o);

      return pu.httpRequest(options)
        .then(function(res) {
          res.should.have.property('request');
          res.should.have.property('statusCode', 200);
          res.request.should.have.property('href', 'http://127.0.0.1:6789/');
          var body = JSON.parse(res.body);
          body.should.have.property('body');
        });
    });

  it('should POST a request', function() {
    var options = _.merge({
      body: 'This is a POST body',
      method: 'POST'}, o);

    return pu.httpRequest(options)
      .then(function(res) {
        res.should.have.property('body');
        var body = JSON.parse(res.body);
        body.should.have.property('body');
        body.body.should.equal('This is a POST body');
      });
  });

  it('should POST a request as JSON', function() {
    var options = _.merge({
      json: true,
      body: {a: 'sample', object: 'here'},
      method: 'POST'}, o);

    return pu.httpRequest(options)
      .then(function(res) {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('body');
        var body = res.body;
        body.should.have.property('body');
        body = JSON.parse(body.body);
        body.should.have.property('a');
      });
  });

});


describe('postJSONObject', function() {

  var s = createEchoServer(6789, 1000);

  before(function(done) {
    s.listen(s.port, done);
  });

  after(function(done) {
    s.close(done);
  });

  it('should POST a request as JSON', function() {

    return pu.postJSONObject('http://127.0.0.1:6789/',
    {a: 'sample', object: 'here'})
      .then(function(res) {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('body');
        var body = res.body;
        body.should.have.property('body');
        body = JSON.parse(body.body);
        body.should.have.property('a');
      });
  });

  it('should return timeout sending a POST request as JSON with 500ms',
    function() {
      return pu.postJSONObject('http://127.0.0.1:6789/',
      {a: 'sample', object: 'here'}, 500)
        .should.be.rejectedWith(Error);
    });

  it('should POST a request as JSON with a 1500ms timeout', function() {

    return pu.postJSONObject('http://127.0.0.1:6789/',
    {a: 'sample', object: 'here'}, 1500)
      .then(function(res) {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('body');
        var body = res.body;
        body.should.have.property('body');
        body = JSON.parse(body.body);
        body.should.have.property('a');
      });
  });

});


describe('getJSON', function() {

  var s = createEchoServer(6789, 1000);

  before(function(done) {
    s.listen(s.port, done);
  });

  after(function(done) {
    s.close(done);
  });

  it('should GET a response as JSON',
    function() {
      return pu.getJSON('http://127.0.0.1:6789/')
        .then(function(res) {
          res.should.have.property('body');
          res.body.should.have.property('body');
          res.body.body.should.have.property('a', 'sample');
        });
    });

  it('should return timeout sending a GET request as JSON with 500ms',
    function() {
      return pu.getJSON('http://127.0.0.1:6789/', 500)
        .should.be.rejectedWith(Error);
    });

  it('should GET a request as JSON with a 1500ms timeout',
    function() {
      return pu.getJSON('http://127.0.0.1:6789/', 1500)
        .then(function(res) {
          res.should.have.property('body');
          res.body.should.have.property('body');
          res.body.body.should.have.property('a', 'sample');
        });
    });

});
