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
 * use Huawei OCR services with token
 */
const config = require('./libs/config');
const fs = require('fs');
const request = require('request');

class HwOcrClientToken {
    constructor(domainName, userName, password, region) {
        if (!userName || !password || !domainName || !region) {
            throw new TypeError('all the constructor parameters are required');
        }
        // your huawwei cloud login name && password
        this.userName = userName; 
        this.password = password;
        // such as 'cn-north-1'
        this.region = region; 
        this.endPoint = 'ocr.' + region + '.myhuaweicloud.com';
        // if the user isn't IAM user, domainName is the same with username
        this.domainName = domainName;
        this.token = null;
    }

    resetToken () {
        this.token = null;
    }

    getRequestBody (domainname, projectName) {
        return {
          "auth": {
            "identity": {
              "methods": ["password"],
              "password": {
                "user": {
                  "name": this.userName,
                  "password": this.password,
                  "domain": {
                    "name": domainname
                  }
                }
              }
            },
            "scope": {
              "project": {
                "name": projectName
              }
            }
          }
        }
    }

    getParam () {
        let urlStr = 'https://iam.' + this.region + '.myhuaweicloud.com/v3/auth/tokens';
        let requestParam = {
            url: 'https://' + this.endPoint + uri,
            method: "POST",
            // proxy: 'http://user:pw@host:port', // set proxy if necessary
            json: true, 
            body: this.getRequestBody(this.domainName, this.region)
        }
        return requestParam;
    }

    /**
     *  get token request's opt
     *
     * @return return request opt
     */
    getOptions (service, imgUrl, opt) {
        let headers = {
            'X-Auth-Token': this.token,
            'Content-Type': 'application/json;charset=utf8'
        }
        let imgBase64 = fs.readFileSync(imgUrl).toString('base64')

        if (opt !== null) {
            opt['image'] = imgBase64
        } else {
            opt = {'image': imgBase64}
        }

        let url = 'https://' + this.endPoint + service

        let options = {
            url: url,
            method: "POST",
            headers: headers,
            // proxy: 'http://user:pw@host:port', // set proxy 
            json: true, 
            body: opt
        }
        return options
    }

    /**
     *  token request
     *
     * @return return request [x-subject-token]
     */
    getTokens () {      
        return new Promise((resolve, reject) => {
            let _this = this
            let options = this.getParam();
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                _this.token = response.headers['x-subject-token']
                resolve(_this.token);
            });
        });
    }

    getOcrResult(service, imgUrl, opt) {              
        return new Promise((resolve, reject) => {         
            let options = this.getOptions(service, imgUrl, opt)
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    let result = {
                        statusCode: response.statusCode,
                        result: response.body.result
                    }
                    resolve(result);  
                }                    
            });
        });
    }

    commonRequest (service, imgUrl, opt) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(imgUrl)) {
                reject('image file is not exist');
                return
            }
            if (this.token === null) {
                this.getTokens().then(() => {
                    return this.getOcrResult(service, imgUrl, opt);
                }).then(result => {
                    resolve(result)
                });
            } else {
                return this.getOcrResult(service, imgUrl, opt).then(result => {
                    resolve(result)
                });
            }  
        })      
    }

    /**
     * OCR Service
     * @param {service} string, ocr service name, refer ./libs/config.js
     * @param {imgUrl} string, img path 
     * @param {opt} boolean or {}, an option API param
     * @return object 
     */
    requestOcrServiceBase64 (service, imgUrl, opt=null) {
        return this.commonRequest(service, imgUrl, opt)
    }
}

module.exports = HwOcrClientToken;
