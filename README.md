# Twenty20 Solutions Utils (pcutils)

---

[![npm version](https://badge.fury.io/js/pcutils.svg)](https://badge.fury.io/js/pcutils)
[![Build Status](https://github.com/twenty20solutions/pcutils/actions/workflows/ci.yml/badge.svg)](https://github.com/twenty20solutions/pcutils/actions/workflows/ci.yml)

---

Some utility functions we use for several projects

## Change Log

See the [CHANGELOG.md](CHANGELOG.md) for information on what's new and what changed.

## Usage

### Function `httpRequest(options)`

Executes an HTTP request.
- `options` request options. See [`request` options documentation](https://github.com/request/request#requestoptions-callback)
- returns a promise that is resolved with the `request` response 
object, unless `options.returnBody` is set to `true`, in that case, it resolves
the promise with the body content.

In the case where the request returns an HTTP error (anything from 400 to 599 
HTTP status code), it will reject the promise with an error object with 
`err.message` = `IncomingMessage.statusMessage` as it's message, and 
`err.statusCode` = `IncomingMessage.statusCode`. If `options.returnBody` is set 
to `false`, the `err` object returned is augmented with the response object.

### Function `postJSONObject(url, objToSend, timeout, returnBody=true)` 
#### Aliased to `postJSON`, too.

Sends a JSON object to and endpoint as an HTTP POST
- `url` URL string of the endpoint
- `objToSend` object to send
- `timeout` integer containing the number of milliseconds to
 wait for a server to send response headers (and start the response body)
 before aborting the request. Note that if the underlying TCP connection
 cannot be established, the OS-wide TCP connection timeout will overrule the
 timeout option (the default in Linux can be anywhere from 20-120 seconds).
- `returnBody` boolean that defaults to `true`. Instructs the function to return
  body if true, or the response object response if false.
- returns a promise that is resolved with the `request` response 
body, unless `returnBody` is set to `false`, in that case, it resolves
the promise with the response object.

In the case where the request returns an HTTP error (anything from 400 to 599 
HTTP status code), it will reject the promise with an error object with 
`err.message` = `IncomingMessage.statusMessage` as it's message, and 
`err.statusCode` = `IncomingMessage.statusCode`.
If `returnBody` is set to `false`, the `err` object returned is augmented with 
the response object.

### Function `getJSON(url, timeout, returnBody = true)`

Get a JSON object from an endpoint as an HTTP GET
- `url` URL string of the endpoint
- `timeout` integer containing the number of milliseconds to
 wait for a server to send response headers (and start the response body)
 before aborting the request. Note that if the underlying TCP connection
 cannot be established, the OS-wide TCP connection timeout will overrule the
 timeout option (the default in Linux can be anywhere from 20-120 seconds).
- `returnBody` boolean that defaults to `true`. Instructs the function to return
  body if true, or the response object response if false.
- returns a promise that is resolved with the `request` response 
body, unless `returnBody` is set to `false`, in that case, it resolves
the promise with the response object.

In the case where the request returns an HTTP error (anything from 400 to 599 
HTTP status code), it will reject the promise with an error object with 
`err.message` = `IncomingMessage.statusMessage` as it's message, and 
`err.statusCode` = `IncomingMessage.statusCode`.
If `returnBody` is set to `false`, the `err` object returned is augmented with 
the response object.

## License

**[MIT](./LICENSE)**
&copy; 2014-2022
[Twenty20 Solutions](http://www.twenty20solutions.com)

This module is free and open-source under the MIT License.
