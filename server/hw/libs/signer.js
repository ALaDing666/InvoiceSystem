/*
* Copyright 2018 Huawei Technologies Co.,Ltd.
* 
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use
* this file except in compliance with the License.  You may obtain a copy of the
* License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software distributed
* under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
* CONDITIONS OF ANY KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations under the License.
*/
// HWS API Gateway Signature
(function (root, factory) {
    "use strict";

    /*global define*/
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['CryptoJS', 'moment-timezone'], function (CryptoJS, moment) {
            var crypto_wrapper = {
                hmacsha256: function (keyByte, message) {
                    return CryptoJS.HmacSHA256(message, keyByte).toString(CryptoJS.enc.Hex)
                },
                HexEncodeSHA256Hash: function (body) {
                    return CryptoJS.SHA256(body)
                }
            };
            return factory(crypto_wrapper, moment)
        });
    }
    else if (typeof module === 'object' && module.exports) {
        // Node
        var crypto = require('crypto');
        var crypto_wrapper = {
            hmacsha256: function (keyByte, message) {
                return crypto.createHmac('SHA256', keyByte).update(message).digest().toString('hex')
            },
            HexEncodeSHA256Hash: function (body) {
                return crypto.createHash('SHA256').update(body).digest().toString('hex')
            }
        };
        module.exports = factory(crypto_wrapper, require('moment-timezone'));
    }
    else {
        // Browser
        var CryptoJS = root.CryptoJS;
        var crypto_wrapper = {
            hmacsha256: function (keyByte, message) {
                return CryptoJS.HmacSHA256(message, keyByte).toString(CryptoJS.enc.Hex)
            },
            HexEncodeSHA256Hash: function (body) {
                return CryptoJS.SHA256(body)
            }
        };
        root.signer = factory(crypto_wrapper, root.moment);
    }
}(this, function (crypto_wrapper, moment) {
    'use strict';

    var BasicDateFormat = "YYYYMMDDTHHmmss[Z]";
    var Algorithm = "SDK-HMAC-SHA256";
    var HeaderXDate = "X-Sdk-Date";
    var HeaderAuthorization = "Authorization";
    var HeaderContentSha256 = "x-sdk-content-sha256";

    const hexTable = new Array(256);
    for (var i = 0; i < 256; ++i)
        hexTable[i] = '%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase();

    const noEscape = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, // 32 - 47
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 80 - 95
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0  // 112 - 127
    ];

    // function urlEncode is based on https://github.com/nodejs/node/blob/master/lib/querystring.js
    // Copyright Joyent, Inc. and other Node contributors.
    function urlEncode(str) {
        if (typeof str !== 'string') {
            if (typeof str === 'object')
                str = String(str);
            else
                str += '';
        }
        var out = '';
        var lastPos = 0;

        for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);

            // ASCII
            if (c < 0x80) {
                if (noEscape[c] === 1)
                    continue;
                if (lastPos < i)
                    out += str.slice(lastPos, i);
                lastPos = i + 1;
                out += hexTable[c];
                continue;
            }

            if (lastPos < i)
                out += str.slice(lastPos, i);

            // Multi-byte characters ...
            if (c < 0x800) {
                lastPos = i + 1;
                out += hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)];
                continue;
            }
            if (c < 0xD800 || c >= 0xE000) {
                lastPos = i + 1;
                out += hexTable[0xE0 | (c >> 12)] +
                    hexTable[0x80 | ((c >> 6) & 0x3F)] +
                    hexTable[0x80 | (c & 0x3F)];
                continue;
            }
            // Surrogate pair
            ++i;

            if (i >= str.length)
                throw new errors.URIError('ERR_INVALID_URI');

            var c2 = str.charCodeAt(i) & 0x3FF;

            lastPos = i + 1;
            c = 0x10000 + (((c & 0x3FF) << 10) | c2);
            out += hexTable[0xF0 | (c >> 18)] +
                hexTable[0x80 | ((c >> 12) & 0x3F)] +
                hexTable[0x80 | ((c >> 6) & 0x3F)] +
                hexTable[0x80 | (c & 0x3F)];
        }
        if (lastPos === 0)
            return str;
        if (lastPos < str.length)
            return out + str.slice(lastPos);
        return out;
    }

    function HttpRequest() {
        this.method = "";
        this.host = "";   //    example.com
        this.uri = "";     //    /request/uri
        this.query = {};
        this.headers = {};
        this.body = "";
    }

    function findHeader(r, header) {
        for (var k in r.headers) {
            if (k.toLowerCase() === header.toLowerCase()) {
                return r.headers[k]
            }
        }
        return null;
    }

// Build a CanonicalRequest from a regular request string
//
// CanonicalRequest =
//  HTTPRequestMethod + '\n' +
//  CanonicalURI + '\n' +
//  CanonicalQueryString + '\n' +
//  CanonicalHeaders + '\n' +
//  SignedHeaders + '\n' +
//  HexEncode(Hash(RequestPayload))
    function CanonicalRequest(r, signedHeaders) {
        var hexencode = findHeader(r, HeaderContentSha256);
        if (hexencode === null) {
            var data = RequestPayload(r);
            hexencode = crypto_wrapper.HexEncodeSHA256Hash(data);
        }
        return r.method + "\n" + CanonicalURI(r) + "\n" + CanonicalQueryString(r) + "\n" + CanonicalHeaders(r, signedHeaders) + "\n" + signedHeaders.join(';') + "\n" + hexencode
    }

    function CanonicalURI(r) {
        var pattens = r.uri.split('/');
        var uri = [];
        for (var k in pattens) {
            var v = pattens[k];
            uri.push(urlEncode(v));
        }
        var urlpath = uri.join('/');
        if (urlpath[urlpath.length - 1] !== '/') {
            urlpath = urlpath + '/';
        }
        //r.uri = urlpath
        return urlpath;
    }

    function CanonicalQueryString(r) {
        var keys = [];
        for (var key in r.query) {
            keys.push(key)
        }
        keys.sort();
        var a = [];
        for (var i in keys) {
            var key = keys[i];
            var value = r.query[key];
            var kv = urlEncode(key) + '=' + urlEncode(value);
            a.push(kv)
        }
        return a.join('&');
    }

    function CanonicalHeaders(r, signedHeaders) {
        var headers = {};
        for (var key in r.headers) {
            headers[key.toLowerCase()] = r.headers[key];
        }
        var a = [];
        for (var i in signedHeaders) {
            var value = headers[signedHeaders[i]];
            a.push(signedHeaders[i] + ':' + value.trim())
        }
        return a.join('\n') + "\n"
    }

    function SignedHeaders(r) {
        var a = [];
        for (var key in r.headers) {
            a.push(key.toLowerCase())
        }
        a.sort();
        return a
    }

    function RequestPayload(r) {
        return r.body
    }

// Create a "String to Sign".
    function StringToSign(canonicalRequest, t) {
        var bytes = crypto_wrapper.HexEncodeSHA256Hash(canonicalRequest);
        return Algorithm + "\n" + t.format(BasicDateFormat) + "\n" + bytes
    }

// Create the HWS Signature.
    function SignStringToSign(stringToSign, signingKey) {
        return crypto_wrapper.hmacsha256(signingKey, stringToSign)
    }

// Get the finalized value for the "Authorization" header.  The signature
// parameter is the output from SignStringToSign
    function AuthHeaderValue(signature, AppKey, signedHeaders) {
        return Algorithm + " Access=" + AppKey + ", SignedHeaders=" + signedHeaders.join(';') + ", Signature=" + signature
    }

    function Signer() {
        this.AppKey = "";
        this.AppSecret = "";
    }

    Signer.prototype.Sign = function (r) {
        var headerTime = findHeader(r, HeaderXDate);
        var t;
        if (headerTime === null) {
            t = moment(Date.now()).tz('utc');
            r.headers[HeaderXDate] = t.format(BasicDateFormat)
        }
        else {
            t = moment(headerTime, BasicDateFormat)
        }
        if (r.method !== "PUT" && r.method !== "PATCH" && r.method !== "POST") {
            r.body = ""
        }
        var queryString = CanonicalQueryString(r);
        if (queryString !== "") {
            queryString = "?" + queryString;
        }
        var options = {
            hostname: r.host,
            path: encodeURI(r.uri) + queryString,
            method: r.method,
            headers: r.headers
        };
        if (findHeader(r, 'host') === null) {
            r.headers.host = r.host;
        }
        var signedHeaders = SignedHeaders(r);
        var canonicalRequest = CanonicalRequest(r, signedHeaders);
        var stringToSign = StringToSign(canonicalRequest, t);
        var signature = SignStringToSign(stringToSign, this.AppSecret);
        options.headers[HeaderAuthorization] = AuthHeaderValue(signature, this.AppKey, signedHeaders);
        options.headers['content-length'] = r.body.length.toString();
        return options;
    };
    return {
        HttpRequest: HttpRequest,
        Signer: Signer,
        urlEncode: urlEncode,
        findHeader: findHeader,
        SignedHeaders: SignedHeaders,
        CanonicalRequest: CanonicalRequest,
        StringToSign: StringToSign,
    }
}));
