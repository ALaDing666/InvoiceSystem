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
*
* sdk reference linking：https://support.huaweicloud.com/sdkreference-ocr/ocr_04_0016.html
**/

const http = require('http');
const HwOcrClientToken = require('./hw/ocr-client-token');
const OcrClientAksk = require('./hw/orc-client-aksk');
const config = require('./hw/libs/config.js')

// // token
// let domainName = 'xxx'; // if the user isn't IAM user, domainName is the same with username
// let username = 'xxx';
// let password = 'xxx';
// let region = 'cn-north-4';
// let httpUri1 = '/v1.0/ocr/id-card';
// let hwOcrClientToken = new HwOcrClientToken(domainName,username, password, region);
// let opt1 = {};
// //let opt1 = {'side': 'front'}; // option
// hwOcrIdCard(hwOcrClientToken, httpUri1, './data/id-card-demo.jpg', opt1);

// ak/sk
let appKey = 'FMOPWAKFDUEPVNTWIP8U'; // your ak
let appSecret = 'e89I5buDRy9jlwy8EGdhmBVDLxtkLoCzOtJyQTpA'; // your sk
let endPoint2 = 'ocr.cn-north-4.myhuaweicloud.com';
let httpUri2 = '/v1.0/ocr/id-card';
let ocrClientAksk = new OcrClientAksk(appKey, appSecret, endPoint2);
let opt2 = {};
// let opt2 = {'side': 'front'}; // option
// hwOcrIdCard(ocrClientAksk, httpUri2, './data/id-card-demo.jpg', opt2);

let hwOcrIdCard = (ocrClient, httpUri, filePath, opt=null) => {
  ocrClient.requestOcrServiceBase64(httpUri, filePath, opt).then(result => {
    console.log('statusCode = ' + result.statusCode);
    console.log('recognize result = '+ JSON.stringify(result.result));
    res = result.statusCode
    console.log('res1: ', res);
    return res
  }).catch(error => {
    console.log('error:', error)
  });
}

module.exports = {
  ocrClientAksk,
  hwOcrIdCard
}