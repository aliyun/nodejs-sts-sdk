'use strict';

const fs = require('fs');
const url = require('url');
const path = require('path');
const https = require('https');
const expect = require('expect.js');
const qs = require('querystring');
const StsClient = require('../lib/');

const router = {
  'POST::AssumeRole': JSON.stringify({
    RequestId: '9B241187-11D4-49F8-84B4-7CF6B45A328C',
    AssumedRoleUser:
    {
      AssumedRoleId: '338780495885120524:abc',
      Arn: 'acs:ram::1012608394995121:role/KmsAccess/abc'
    },
    Credentials:
    {
      AccessKeySecret: 'xxxxxxxxxxxxxxxx',
      AccessKeyId: 'STS.xxxxxxxxxxxxxxxx',
      Expiration: '2019-02-25T10:28:16Z',
      SecurityToken: 'xxxxxxxxxxxxxxxx'
    }
  }),
  'POST::GetCallerIdentity': JSON.stringify({
    AccountId: '1012608394995121',
    RequestId: 'F85821EB-E873-4EB8-820B-A4C10A388B28',
    PrincipalId: '240571438963617484',
    IdentityType: 'RAMUser',
    Arn: 'acs:ram::1012608394995121:user/wjy',
    UserId: '240571438963617484'
  }),
  'POST::GenerateSessionAccessKey': JSON.stringify({ RequestId: 'F85821EB-E873-4EB8-820B-A4C10A388B30' })
};

async function createServer(retry) {
  let httpsServer;
  let cache = {};

  const options = {
    key: fs.readFileSync(path.join(__dirname, './keys/server-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './keys/server-cert.pem'))
  };
  await new Promise(function (resolve, reject) {
    httpsServer = https.createServer(options, (req, res) => {
      const parse = url.parse(req.url);
      const action = qs.parse(parse.query).Action;
      const key = `${req.method}::${action}`;
      if (cache[key] && cache[key] % retry === 0) {
        res.writeHead(200);
        res.end(router[key]);
        cache[key] = null;
      } else {
        cache[key] ? (cache[key]++) : (cache[key] = 1);
        res.writeHead(500);
        res.end('failed');
      }
    });
    httpsServer.listen(8443, resolve);
  });

  return httpsServer;
}

describe('http retry should success', function () {
  const client = new StsClient({
    endpoint: 'localhost:8443',
    accessKeyId: 'access_key',
    accessKeySecret: 'secret_key'
  });
  const runtimeOption = { backoff_policy: 'fixed', backoff_period: 10, ignoreSSL: false };
  const authOption = { ignoreSSL: false };
  const retry = 2;

  let httpsServer;

  before(async function () {
    httpsServer = await createServer(retry);
  });

  after(function () {
    httpsServer && httpsServer.close();
  });

  it(`get a temporary identity that plays the role after retry ${retry}times`, async function () {
    const roleArn = 'acs:ram::1012608394995121:role/KmsAccess';
    const roleSessionName = 'abc';
    // with no backoff_period
    let res = await client.assumeRole(roleArn, roleSessionName, '', 3000, authOption);
    expect(res.AssumedRoleUser && typeof res.AssumedRoleUser === 'object').to.be.ok();
    expect(res.Credentials && typeof res.Credentials === 'object').to.be.ok();
    // with backoff_period
    res = await client.assumeRole(roleArn, roleSessionName, '', 3000, runtimeOption);
    expect(res.AssumedRoleUser && typeof res.AssumedRoleUser === 'object').to.be.ok();
    expect(res.Credentials && typeof res.Credentials === 'object').to.be.ok();
  });

  it(`get the identity of the current caller after retry ${retry}times`, async function () {
    // with no backoff_period
    let res = await client.getCallerIdentity(authOption);
    expect(res.PrincipalId).to.be('240571438963617484');
    expect(res.IdentityType).to.be('RAMUser');
    // with backoff_period
    res = await client.getCallerIdentity(runtimeOption);
    expect(res.PrincipalId).to.be('240571438963617484');
    expect(res.IdentityType).to.be('RAMUser');
  });

  it(`generator session key after retry ${retry}times`, async function () {
    // with no backoff_period
    let res = await client.generateSessionAccessKey(authOption);
    expect(res.RequestId).to.be.ok();
    // with backoff_period
    res = await client.generateSessionAccessKey(runtimeOption);
    expect(res.RequestId).to.be.ok();
  });
});