# PetroCloud Utils (pcutils)

---

[![npm version](https://badge.fury.io/js/pcutils.svg)](https://badge.fury.io/js/pcutils)
[![npm version](https://david-dm.org/petrocloud/pcutils.svg)](https://david-dm.org/petrocloud/pcutils)
[![Build Status](https://travis-ci.org/PetroCloud/pcutils.svg?branch=master)](https://travis-ci.org/PetroCloud/pcutils)
[![Coverage Status](https://coveralls.io/repos/github/PetroCloud/pcutils/badge.svg)](https://coveralls.io/github/PetroCloud/pcutils)

---

Some utility functions we use for several projects

## Change Log

See the [CHANGELOG.md](CHANGELOG.md) for information on what's new and what changed.

## Usage

### `existsIn(source, itemsToMatch)`

Checks if itemsToMatch exists in source
- `source` Source array
- `itemsToMatch` items that should exist in the source array
- returns `boolean`

### `httpRequest(options)`

Executes an HTTP request.
- `options` request options. See [`request` options documentation](https://github.com/request/request#requestoptions-callback)
- returns a Bluebird promise that is resolved with the `request` response 
object, unless `options.returnBody` is set to `true`, in that case, it resolves
the promise with the body content.

In the case where the request returns an HTTP error (anything from 400 to 599 
HTTP status code), it will reject the promise with an error object with 
`err.message` = `IncomingMessage.statusMessage` as it's message, and 
`err.statusCode` = `IncomingMessage.statusCode`. If `options.returnBody` is set 
to `false`, the `err` object returned is augmented with the response object.

### `postJSONObject(url, objToSend, timeout, returnBody=true)` aliased to `postJSON`, too.

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
- returns a Bluebird promise that is resolved with the `request` response 
body, unless `returnBody` is set to `false`, in that case, it resolves
the promise with the response object.

In the case where the request returns an HTTP error (anything from 400 to 599 
HTTP status code), it will reject the promise with an error object with 
`err.message` = `IncomingMessage.statusMessage` as it's message, and 
`err.statusCode` = `IncomingMessage.statusCode`.
If `returnBody` is set to `false`, the `err` object returned is augmented with 
the response object.

### `getJSON(url, timeout)`

Get a JSON object from an endpoint as an HTTP GET
- `url` URL string of the endpoint
- `timeout` integer containing the number of milliseconds to
 wait for a server to send response headers (and start the response body)
 before aborting the request. Note that if the underlying TCP connection
 cannot be established, the OS-wide TCP connection timeout will overrule the
 timeout option (the default in Linux can be anywhere from 20-120 seconds).
- `returnBody` boolean that defaults to `true`. Instructs the function to return
  body if true, or the response object response if false.
- returns a Bluebird promise that is resolved with the `request` response 
body, unless `returnBody` is set to `false`, in that case, it resolves
the promise with the response object.

In the case where the request returns an HTTP error (anything from 400 to 599 
HTTP status code), it will reject the promise with an error object with 
`err.message` = `IncomingMessage.statusMessage` as it's message, and 
`err.statusCode` = `IncomingMessage.statusCode`.
If `returnBody` is set to `false`, the `err` object returned is augmented with 
the response object.

### `promisifier(function)`

Takes a function as a parameter and returns a promise that resolves when the
function returns a value or rejects if an exception ocurrs
- `function` is the function to promisify
- returns a Bluebird promise with the result of the call to the function or an
error if one is thrown

### `objectToString(object, showHidden, depth)`

Takes an object or an array and returns the 'deep' representation of it.

- `object` is the object subject to be converted
- `showHidden` (defaults to false) makes the function show hidden attributes
- `depth` (defaults to null, that is, infinite depth) tells how deep to go in
the nesting chain, when converting the object as a string.
- returns a String that resembles the object, based on the parameters passed

## License

**[MIT](./LICENSE)**
&copy; 2014-2016
[Petrocloud](http://petrocloud.com)

This module is free and open-source under the MIT License.
