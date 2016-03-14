# PetroCloud Utils (pcutils)

---

[![npm version](https://badge.fury.io/js/pcutils.svg)](https://badge.fury.io/js/pcutils)
[![npm version](https://david-dm.org/petrocloud/pcutils.svg)](https://david-dm.org/petrocloud/pcutils)
[![Build Status](https://travis-ci.org/PetroCloud/pcutils.svg?branch=master)](https://travis-ci.org/PetroCloud/pcutils)

---

Some utility functions we use for several projects

## Usage

### `existsIn(source, itemsToMatch)`

Checks if itemsToMatch exists in source 
- `source` Source array
- `itemsToMatch` items that should exist in the source array
- returns `boolean`

### `httpRequest(options)`

Executes an HTTP request.
- `options` request options. See [`request` options documentation](https://github.com/request/request#requestoptions-callback)
- returns a Bluebird promise with the `request` response object.

### `postJSONObject(url, objToSend, timeout)`

Sends a JSON object to and endpoint as an HTTP POST
- `url` URL string of the endpoint
- `objToSend` object to send
- `timeout` integer containing the number of milliseconds to 
 wait for a server to send response headers (and start the response body) 
 before aborting the request. Note that if the underlying TCP connection 
 cannot be established, the OS-wide TCP connection timeout will overrule the 
 timeout option (the default in Linux can be anywhere from 20-120 seconds).
- returns a Bluebird promise where the body is the data of the request.

### `getJSON(url, timeout)`

Get a JSON object from an endpoint as an HTTP GET
- `url` URL string of the endpoint
- `timeout` integer containing the number of milliseconds to 
 wait for a server to send response headers (and start the response body) 
 before aborting the request. Note that if the underlying TCP connection 
 cannot be established, the OS-wide TCP connection timeout will overrule the 
 timeout option (the default in Linux can be anywhere from 20-120 seconds).
- returns a Bluebird promise where the body is the data of the request.

## License

**[MIT](./LICENSE)**
&copy; 2014-2016
[Petrocloud](http://petrocloud.com)

This module is free and open-source under the MIT License.
