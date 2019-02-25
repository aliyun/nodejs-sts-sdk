// https://help.aliyun.com/document_detail/28756.html

module sts {
  model RuntimeObject = {
    ignoreSSL: boolean,
    max-attempts: number,
    backoff_policy: string,
    backoff_period: number
  }

  type @default = (string, string): string
  type @defaultNumber = (number, number): number
  type @getQuery = async (object, $Request): object
  type @json = async ($Response): object
  type @is5xx = ($Response): boolean

  model AssumeRoleQuery = {
    Action: string,
    RoleArn: string,
    RoleSessionName: string,
    Policy: string,
    DurationSeconds: number
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
  api AssumeRole(query: AssumeRoleQuery, runtime: RuntimeObject) {
    protocol = 'https';
    method = 'POST';
    pathname = '/';    
    headers = {
      host = @endpoint
    };
    query = @getQuery(query, __request);
  } returns {
    if (@is5xx(__response)) {
      retry;
    }

    return @json(__response);
  } runtime {
    timeout = 10000,
    timeouted = 'retry',
    retry = {
      retryable = true,
      policy = 'simple',
      max-attempts = @defaultNumber(runtime.max-attempts, 3)
    },
    backoff = {
      policy = @default(runtime.backoff_policy, 'no'),
      period = @defaultNumber(runtime.backoff_period, 1)
    },
    ignoreSSL = runtime.ignoreSSL
  }

  model GetCallerIdentityQuery = {
    Action: string
  }

  /**
   * @description get the identity of the current caller
   * @see https://help.aliyun.com/document_detail/43767.html
   * @param query
   *   - Action {string} required
   */
  api GetCallerIdentity(query: GetCallerIdentityQuery, runtime: RuntimeObject) {
    protocol = 'https';
    method = 'POST';
    pathname = '/';    
    headers = {
      host = @endpoint
    };
    query = @getQuery(query, __request);
  } returns {
    if (@is5xx(__response)) {
      retry;
    }

    return @json(__response);
  } runtime {
    timeout = 10000,
    timeouted = 'retry',
    retry = {
      retryable = true,
      policy = 'simple',
      max-attempts = @defaultNumber(runtime.max-attempts, 3)
    },
    backoff = {
      policy = @default(runtime.backoff_policy, 'no'),
      period = @defaultNumber(runtime.backoff_period, 1)
    },
    ignoreSSL = runtime.ignoreSSL
  }

  model GenerateSessionAccessKeyQuery = {
    Action: string
  }

  api GenerateSessionAccessKey(query: GenerateSessionAccessKeyQuery, runtime: RuntimeObject) {
    protocol = 'https';
    method = 'POST';
    pathname = '/';    
    headers = {
      host = @endpoint
    };
    query = @getQuery(query, __request);
  } returns {
    if (@is5xx(__response)) {
      retry;
    }

    return @json(__response);
  } runtime {
    timeout = 10000,
    timeouted = 'retry',
    retry = {
      retryable = true,
      policy = 'simple',
      max-attempts = @defaultNumber(runtime.max-attempts, 3)
    },
    backoff = {
      policy = @default(runtime.backoff_policy, 'no'),
      period = @defaultNumber(runtime.backoff_period, 1)
    },
    ignoreSSL = runtime.ignoreSSL
  }
}