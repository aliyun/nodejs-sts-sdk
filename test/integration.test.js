'use strict';

const expect = require('expect.js');
const StsClient = require('../lib/');

describe('sts integration test should success', function () {
  const client = new StsClient({
    endpoint: process.env.ENDPOINT,
    accessKeyId: process.env.ACCESS_KEY,
    accessKeySecret: process.env.SECRET_KEY
  });

  it(`get a temporary identity that plays the role`, async function () {
    const roleArn = 'acs:ram::1012608394995121:role/KmsAccess';
    const roleSessionName = 'abc';
    // with no backoff_period
    let res = await client.assumeRole(roleArn, roleSessionName);
    expect(res.AssumedRoleUser && typeof res.AssumedRoleUser === 'object').to.be.ok();
    expect(res.Credentials && typeof res.Credentials === 'object').to.be.ok();
  });

  it(`get the identity of the current caller`, async function () {
    let res = await client.getCallerIdentity();
    expect(res.PrincipalId).to.be.ok();
    expect(res.IdentityType).to.be.ok();
  });
});