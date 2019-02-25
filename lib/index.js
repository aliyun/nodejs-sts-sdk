'use strict';

const StsBaseClient = require('./sts');

class StsClient {
  constructor(config) {
    this.client = new StsBaseClient(config);
    this.defaultRuntimeOption = { timeout: 10000 };
  }

  /**
   * @description get a temporary identity that plays the role
   * @see https://help.aliyun.com/document_detail/28763.html
   * @param roleArn {string} required: aliyun resource name, `acs:ram::${accountID}:role/${roleName}`
   * @param roleSessionName {string} required: differentiate tokens, /^[a-zA-Z0-9\.@\-_]+$/
   * @param policy {string} optional: @see https://help.aliyun.com/document_detail/28664.html
   * @param durationSeconds {number}: the specified expiration time (seconds), range: 900~3600, default value is 3600
   * @param runtimeOption {object} optional: set timeout, default is 10s
   */
  async assumeRole(roleArn, roleSessionName, policy, durationSeconds, runtimeOption) {
    if (!roleArn || !roleSessionName) {
      throw new Error('roleArn & roleSessionName must be passed in, please see https://help.aliyun.com/document_detail/28763.html');
    }
    return this.client.AssumeRole({
      Action: 'AssumeRole',
      RoleArn: roleArn,
      RoleSessionName: roleSessionName,
      Policy: policy,
      DurationSeconds: durationSeconds
    }, Object.assign({}, this.defaultRuntimeOption, runtimeOption));
  }

  /**
   * @description get the identity of the current caller
   * @see https://help.aliyun.com/document_detail/43767.html
   * @param runtimeOption {object} optional: set timeout, default is 10s
   */
  async getCallerIdentity(runtimeOption) {
    return this.client.GetCallerIdentity({
      Action: 'GetCallerIdentity',
    }, Object.assign({}, this.defaultRuntimeOption, runtimeOption));
  }

  /**
   * @param runtimeOption {object} optional: set timeout, default is 10s
   */
  async generateSessionAccessKey(runtimeOption) {
    return this.client.GenerateSessionAccessKey({
      Action: 'GenerateSessionAccessKey',
    }, Object.assign({}, this.defaultRuntimeOption, runtimeOption));
  }
}

module.exports = StsClient;