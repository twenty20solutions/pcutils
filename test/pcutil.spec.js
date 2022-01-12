const pu = require('../lib/utils');
const _ = require('lodash');
const chai = require('chai');
chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const http = require('http');
const url = require('url');

function createEchoServer(port, delay) {
  delay = delay || 0;
  const server = http.createServer((req, resp) => {
    const parsedUrl = url.parse(req.url, true); // true to get query as object
    const queryAsObject = parsedUrl.query;

    let dataToSendBack = '';
    req.on('data', (chunk) => {
      dataToSendBack += chunk;
    });
    req.on('end', () => {
      if (req.method === 'GET') {
        dataToSendBack = {
          some: 'sample',
          is: 'here'
        };
      }
      _.delay(() => {
        if (queryAsObject.reject) {
          resp.statusCode = 500;
          resp.write('Server error');
          resp.end();
        } else {
          resp.writeHead(200, { 'content-type': 'application/json' });
          resp.write(JSON.stringify({
            url: req.url,
            method: req.method,
            headers: req.headers,
            result: dataToSendBack
          }));
          resp.end();
        }
      }, delay);
    });
  });
  server.port = port;
  server.url = `http://localhost:${port}`;
  server.protocol = 'http';
  return server;
}

describe('httpRequest', () => {

  const server = createEchoServer(6789);
  const options = {
    uri: 'http://127.0.0.1:6789'
  };

  before((done) => {
    server.listen(server.port, done);
  });

  after((done) => {
    server.close(done);
  });

  it('should throw a reject when the server is not available',
    () => pu.httpRequest({
      uri: 'http://127.0.0.1:1234/',
      returnBody: true
    }).should.be.rejectedWith(Error));

  it('should throw a reject when the server is not available even if returnBody is false',
    () => pu.httpRequest({
      uri: 'http://127.0.0.1:1234/',
      returnBody: false
    }).should.be.rejectedWith(Error));

  it('should throw a reject when the server returns an error',
    () => pu.httpRequest({
      uri: 'http://127.0.0.1:6789/?reject=1',
      returnBody: true
    }).should.be.rejectedWith(Error));

  it('should throw a reject when the server returns an error even if returnBody is false',
    () => pu.httpRequest({
      uri: 'http://127.0.0.1:6789/?reject=1',
      returnBody: false
    }).should.be.rejectedWith(Error));

  it('should GET a request returning body', () => pu.httpRequest(_.merge({
    returnBody: true
  }, options))
    .then((res) => {
      res = JSON.parse(res);
      res.should.have.property('result');
    }));

  it('should GET a request with a header', () => pu.httpRequest(_.merge({
    returnBody: true,
    header: {
      'Content-Type': 'application/json'
    }
  }, options))
    .then((res) => {
      res = JSON.parse(res);
      res.should.have.property('result');
    }));

  it('should GET a request and return a response object instead of body',
    () => pu.httpRequest(options)
      .then((res) => {
        res.should.have.property('request');
        res.should.have.property('statusCode', 200);
        res.request.should.have.property('href', 'http://127.0.0.1:6789/');
        res.should.have.property('body');
        const respObj = JSON.parse(res.body);
        respObj.should.have.property('result');
        respObj.result.should.have.property('some');
      }));

  it('should POST a request', () => pu.httpRequest(_.merge({
    body: 'This is a POST body',
    method: 'POST'
  }, options))
    .then((res) => {
      res.should.have.property('body');
      const respObj = JSON.parse(res.body);
      respObj.should.have.property('result');
      respObj.result.should.equal('This is a POST body');
    }));

  it('should POST a request as JSON', () => pu.httpRequest(_.merge({
    json: true,
    body: {
      some: 'sample',
      is: 'here'
    },
    method: 'POST'
  }, options))
    .then((res) => {
      res.should.have.property('headers');
      res.headers.should.have.property('content-type', 'application/json');
      res.should.have.property('body');
      const respObj = res.body;
      respObj.should.have.property('result');
      const result = JSON.parse(respObj.result);
      result.should.have.property('some', 'sample');
      result.should.have.property('is', 'here');
    }));

});


describe('postJSONObject', () => {

  const server = createEchoServer(6789, 100);

  before((done) => {
    server.listen(server.port, done);
  });

  after((done) => {
    server.close(done);
  });

  it('should throw a reject when the server is not available',
    () => pu.postJSONObject('http://127.0.0.1:1234/').should.be.rejectedWith(Error));

  it('should throw a reject when the server returns an error',
    () => pu.postJSONObject('http://127.0.0.1:6789/?reject=1').should.be.rejectedWith(Error));


  it('should POST a request as JSON', () => pu.postJSONObject('http://127.0.0.1:6789/',
    {
      some: 'sample',
      is: 'here'
    })
    .then((res) => {
      res.should.have.property('headers');
      res.headers.should.have.property('content-type', 'application/json');
      res.should.have.property('result');
      const result = JSON.parse(res.result);
      result.should.have.property('some', 'sample');
      result.should.have.property('is', 'here');
    }));

  it('should POST a request as JSON and return as Body for wrong returnBody param', () =>
    pu.postJSONObject('http://127.0.0.1:6789/',
      {
        some: 'sample',
        is: 'here'
      }, null, 1) // <= this should be boolean but as a safeguard, it returns Body when it's not boolean
      .then((res) => {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('result');
        const result = JSON.parse(res.result);
        result.should.have.property('some', 'sample');
        result.should.have.property('is', 'here');
      }));

  it('should POST a request as JSON using alias', () =>
    pu.postJSON('http://127.0.0.1:6789/',
      {
        some: 'sample',
        is: 'here'
      })
      .then((res) => {
        res.should.have.property('headers');
        res.headers.should.have.property('content-type', 'application/json');
        res.should.have.property('result');
        const result = JSON.parse(res.result);
        result.should.have.property('some', 'sample');
        result.should.have.property('is', 'here');
      }));

  it('should POST a request as JSON but returning a request', () =>

    // last param is returnBody = false
    pu.postJSONObject('http://127.0.0.1:6789/',
      {
        some: 'sample',
        is: 'here'
      }, null, false)
      .then((res) => {
        res.should.have.property('request');
        res.should.have.property('statusCode', 200);
        res.should.have.property('connection');
        res.connection.should.have.property('bytesRead');
        res.connection.should.have.property('bytesWritten');
        res.request.should.have.property('href', 'http://127.0.0.1:6789/');
        res.should.have.property('body');
        res.body.should.have.property('result');
        const result = JSON.parse(res.body.result);
        result.should.have.property('some', 'sample');
        result.should.have.property('is', 'here');
      })
  );

  it('should return timeout sending a POST request as JSON with 50ms',
    () => pu.postJSONObject('http://127.0.0.1:6789/',
      {
        some: 'sample',
        is: 'here'
      }, 50)
      .should.be.rejectedWith(Error));

  it('should POST a request as JSON with a 150ms timeout', () => pu.postJSONObject('http://127.0.0.1:6789/',
    {
      some: 'sample',
      is: 'here'
    }, 150)
    .then((res) => {
      res.should.have.property('headers');
      res.headers.should.have.property('content-type', 'application/json');
      res.should.have.property('result');
      const result = JSON.parse(res.result);
      result.should.have.property('some', 'sample');
      result.should.have.property('is', 'here');
    }));

});


describe('getJSON', () => {

  const server = createEchoServer(6789, 100);

  before((done) => {
    server.listen(server.port, done);
  });

  after((done) => {
    server.close(done);
  });

  it('should throw a reject when the server is not available',
    () => pu.getJSON('http://127.0.0.1:1234/').should.be.rejectedWith(Error));

  it('should throw a reject when the server returns an error',
    () => pu.getJSON('http://127.0.0.1:6789/?reject=1').should.be.rejectedWith(Error));

  it('should throw a reject when the port is > 65535',
    () => pu.getJSON('http://127.0.0.1:66666').should.be.rejectedWith(Error));

  it('should GET a response as JSON',
    () => pu.getJSON('http://127.0.0.1:6789/')
      .then((res) => {
        res.should.have.property('result');
        const result = res.result;
        result.should.have.property('some', 'sample');
        result.should.have.property('is', 'here');
      }));

  it('should GET a response as JSON and return as Body for wrong returnBody param',
    () => pu.getJSON('http://127.0.0.1:6789/', null, 1) // <== 1 should be a boolean
      .then((res) => {
        res.should.have.property('result');
        const result = res.result;
        result.should.have.property('some', 'sample');
        result.should.have.property('is', 'here');
      }));

  it('should GET a response as JSON, returning a response object',
    () =>
      // last param is returnBody = false
      pu.getJSON('http://127.0.0.1:6789/', null, false)
        .then((resp) => {
          resp.should.have.property('request');
          resp.should.have.property('statusCode', 200);
          resp.should.have.property('connection');
          resp.connection.should.have.property('bytesRead');
          resp.connection.should.have.property('bytesWritten');
          resp.request.should.have.property('href', 'http://127.0.0.1:6789/');
          resp.should.have.property('body');
          resp.body.should.have.property('result');
          const result = resp.body.result;
          result.should.have.property('some', 'sample');
          result.should.have.property('is', 'here');
        })
  );

  it('should return timeout sending a GET request as JSON with 50ms',
    () => pu.getJSON('http://127.0.0.1:6789/', 50).should.be.rejectedWith(Error));

  it('should GET a request as JSON with a 150ms timeout',
    () => pu.getJSON('http://127.0.0.1:6789/', 150)
      .then((res) => {
        res.should.have.property('result');
        const result = res.result;
        result.should.have.property('some', 'sample');
        result.should.have.property('is', 'here');
      }));

});
