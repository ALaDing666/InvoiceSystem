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

/*
 * use Huawei OCR services with ak/sk
 */
const request = require('request');
const fs = require('fs');

const config = require('./libs/config');
const signer = require('./libs/signer');

class OcrClientAksk {

    constructor(AppKey, AppSecret, endPoint) {
        if (!AppKey || !AppSecret || !endPoint) {
            throw new TypeError('all the constructor parameters are required');
        }
        this.sig = new signer.Signer();
        this.sig.AppKey = AppKey; // your ak
        this.sig.AppSecret = AppSecret; // your sk
        this.endPoint = endPoint;
    }
    
    /**
     * get a sign request's options
     * @param {imgUrl} string,image path
     * @param {service} string, ocr service name
     * @param {opt} boolean or {}, an option API param
     * @return object 
     */
    getOptions (service, imgUrl, opt) {

        // get service uri
        let uri = service;
    
        let sigRequet = new signer.HttpRequest();
        sigRequet.host = this.endPoint; // endPoint
        sigRequet.method = "POST";
        sigRequet.uri = uri; 
        sigRequet.headers = {
            "content-type": "application/json"
        };
    
        let imgBase64 = fs.readFileSync(imgUrl).toString('base64');
  
        if (opt !== null) {
            opt['image'] = imgBase64
        } else {
            opt = {'image': imgBase64}
        }

        sigRequet.body = JSON.stringify(opt);
        
        let options = this.sig.Sign(sigRequet);
    
        // options.proxy = 'http://user:pw@host:port'; // set proxy if necessary
        options.url = 'https://' + this.endPoint + uri;
        options.body = sigRequet.body;
    
        return options;
    }
    
    httpRequest (service, imgUrl, opt) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(imgUrl)) {
                reject('image file is not exist');
                return
            }
            let options = this.getOptions(service, imgUrl, opt);
            request.post(options, (error, response, body) => {
                if (error) {
                    reject(error)
                }
                let result = JSON.parse(body);
                result.statusCode =  response.statusCode;
                resolve(result)
            })
        });    
    }

    /**
     * OCR Service
     * @param {service} string, ocr service name, refer ./libs/config.js
     * @param {imgUrl} string, img path 
     * @param {opt} boolean or {}, an option API param
     * @return object 
     */
    requestOcrServiceBase64 (service, imgUrl, opt=null) {    
        return this.httpRequest(service, imgUrl, opt);
    }
}

module.exports = OcrClientAksk;