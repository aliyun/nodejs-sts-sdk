'use strict';

const {
  $send,
  $allowRetry,
  $getBackoffTime,
  $sleep,
  $retryError,
  $unableRetryError
} = require('@alicloud/http-core-sdk');
const StsBase = require('./sts_base');
  
class StsClient extends StsBase {
  constructor(config) {
    super(config);
  }
  
  /**
   * @description get a temporary identity that plays the role
   * @see https://help.aliyun.com/document_detail/28763.html
   * @param query
   *   - Action {string} required
   *   - RoleArn {string} required: aliyun resource name, `acs:ram::${accountID}:role/${roleName}`
   *   - RoleSessionName {string} required: differentiate tokens, /^[a-zA-Z0-9\.@\-_]+$/
   *   - Policy {string} optional: @see https://help.aliyun.com/document_detail/28664.html
   *   - DurationSeconds {number}: the specified expiration time (seconds), range: 900~3600, default value is 3600
   */
  async AssumeRole(query, runtime) {
    const $runtime = {
      timeout: 10000,
      timeouted: 'retry',
      retry: {
        retryable: true,
        policy: 'simple',
        'max-attempts': this.__defaultNumber(runtime['max-attempts'], 3),
      },
      backoff: {
        policy: this.__default(runtime.backoff_policy, 'no'),
        period: this.__defaultNumber(runtime.backoff_period, 1),
      },
      ignoreSSL: runtime.ignoreSSL,
    };

    var $lastRequest;
    var $now = Date.now();
    for (var $retryTimes = 0; $allowRetry($runtime.retry, $retryTimes, $now); $retryTimes++) {
      if ($retryTimes > 0) {
        const $backoffTime = $getBackoffTime($runtime.backoff, $retryTimes);
        if ($backoffTime > 0) {
          await $sleep($backoffTime);
        }
      }

      try {
        const $request = {};
        $request.protocol = 'https';
        $request.method = 'POST';
        $request.pathname = '/';
        $request.headers = {
          host: this.__endpoint,
        };
        $request.query = await this.__getQuery(query, $request);
        $lastRequest = $request;
        const $response = await $send($request, $runtime);

        if (this.__is5xx($response)) {
          throw $retryError($request, $response);
        }

        return await this.__json($response);
      } catch (ex) {
        if (ex.retryable) {
          continue;
        }
        throw ex;
      }
    }

    throw $unableRetryError($lastRequest);
  }

  /**
   * @description get the identity of the current caller
   * @see https://help.aliyun.com/document_detail/43767.html
   * @param query
   *   - Action {string} required
   */
  async GetCallerIdentity(query, runtime) {
    const $runtime = {
      timeout: 10000,
      timeouted: 'retry',
      retry: {
        retryable: true,
        policy: 'simple',
        'max-attempts': this.__defaultNumber(runtime['max-attempts'], 3),
      },
      backoff: {
        policy: this.__default(runtime.backoff_policy, 'no'),
        period: this.__defaultNumber(runtime.backoff_period, 1),
      },
      ignoreSSL: runtime.ignoreSSL,
    };

    var $lastRequest;
    var $now = Date.now();
    for (var $retryTimes = 0; $allowRetry($runtime.retry, $retryTimes, $now); $retryTimes++) {
      if ($retryTimes > 0) {
        const $backoffTime = $getBackoffTime($runtime.backoff, $retryTimes);
        if ($backoffTime > 0) {
          await $sleep($backoffTime);
        }
      }

      try {
        const $request = {};
        $request.protocol = 'https';
        $request.method = 'POST';
        $request.pathname = '/';
        $request.headers = {
          host: this.__endpoint,
        };
        $request.query = await this.__getQuery(query, $request);
        $lastRequest = $request;
        const $response = await $send($request, $runtime);

        if (this.__is5xx($response)) {
          throw $retryError($request, $response);
        }

        return await this.__json($response);
      } catch (ex) {
        if (ex.retryable) {
          continue;
        }
        throw ex;
      }
    }

    throw $unableRetryError($lastRequest);
  }

  /**
   * @description get the identity of the current caller
   * @see https://help.aliyun.com/document_detail/43767.html
   * @param query
   *   - Action {string} required
   */
  async GenerateSessionAccessKey(query, runtime) {
    const $runtime = {
      timeout: 10000,
      timeouted: 'retry',
      retry: {
        retryable: true,
        policy: 'simple',
        'max-attempts': this.__defaultNumber(runtime['max-attempts'], 3),
      },
      backoff: {
        policy: this.__default(runtime.backoff_policy, 'no'),
        period: this.__defaultNumber(runtime.backoff_period, 1),
      },
      ignoreSSL: runtime.ignoreSSL,
    };

    var $lastRequest;
    var $now = Date.now();
    for (var $retryTimes = 0; $allowRetry($runtime.retry, $retryTimes, $now); $retryTimes++) {
      if ($retryTimes > 0) {
        const $backoffTime = $getBackoffTime($runtime.backoff, $retryTimes);
        if ($backoffTime > 0) {
          await $sleep($backoffTime);
        }
      }

      try {
        const $request = {};
        $request.protocol = 'https';
        $request.method = 'POST';
        $request.pathname = '/';
        $request.headers = {
          host: this.__endpoint,
        };
        $request.query = await this.__getQuery(query, $request);
        $lastRequest = $request;
        const $response = await $send($request, $runtime);

        if (this.__is5xx($response)) {
          throw $retryError($request, $response);
        }

        return await this.__json($response);
      } catch (ex) {
        if (ex.retryable) {
          continue;
        }
        throw ex;
      }
    }

    throw $unableRetryError($lastRequest);
  }

}
  
module.exports = StsClient;

