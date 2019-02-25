# Alibaba Cloud STS client for Node.js

[![npm version](https://badge.fury.io/js/@alicloud%2fsts-sdk.svg)](https://badge.fury.io/js/@alicloud%2fsts-sdk.svg)
[![Travis Build Status](https://api.travis-ci.org/aliyun/nodejs-sts-sdk.png?branch=master)](https://travis-ci.org/aliyun/nodejs-sts-sdk)
[![Appveyor Build status](https://ci.appveyor.com/api/projects/status/5ow9oa34730r0wdy?svg=true)](https://ci.appveyor.com/project/hyj1991/nodejs-sts-sdk)
[![codecov](https://codecov.io/gh/aliyun/nodejs-sts-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/aliyun/nodejs-sts-sdk)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

## Installation

```bash
npm install @alicloud/sts-sdk
```

**Node.js >= 8.5.0** required.

## Usage

```js
const StsClient = require('@alicloud/sts-sdk');

const sts = new StsClient({
  endpoint: 'sts.aliyuncs.com', // check this from sts console
  accessKeyId: '***************', // check this from aliyun console
  accessKeySecret: '***************', // check this from aliyun console
});

async function demo() {
  const res1 = await sts.assumeRole(`acs:ram::${accountID}:role/${roleName}`, 'xxx');
  console.log(res1);
  const res2 = await sts.getCallerIdentity();
  console.log(res2);
}

demo();
```

## API Doc

### Method:  `assumeRole()`

#### Arguments

* **roleArn** String **required** - aliyun resource name, `acs:ram::${accountID}:role/${roleName}`
* **roleSessionName** String **required** - differentiate tokens, /^[a-zA-Z0-9\.@\-_]+$/
* **policy** String **optional** -  @see https://help.aliyun.com/document_detail/28664.html
* **durationSeconds** Number **optional** -  the specified expiration time (seconds), range: 900~3600, default value is 3600

#### Returns

* **credentials** Object - sts credentials

### Method:  `getCallerIdentity()`

#### Returns

* **userInfo** Object - the identity of the current caller

### Method **(Japan only)**:  `generateSessionAccessKey()`

#### Returns

* **akInfo** Object - session key & secret

## Test & Coverage

You should set environment variables before running the test or coverage. For example:

* run test

```
ACCESS_KEY=<your access key> SECRET_KEY=<your secret key> ENDPOINT=sts.aliyuncs.com npm run test
```

* run code coverage

```
ACCESS_KEY=<your access key> SECRET_KEY=<your secret key> ENDPOINT=sts.aliyuncs.com npm run cov
```

## License

[MIT](LICENSE)