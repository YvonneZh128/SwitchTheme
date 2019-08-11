
import { Modal } from 'antd';
import querystring from 'query-string';
import parseURL from './parseUrl';
import { forEach } from 'lodash';
import decodeHtml from './htmlTag';

let config = {};
// judge env to do something
if (process.env.NODE_ENV === 'development') {
  config.env = 'dev';
} else if (process.env.NODE_ENV === 'production') {
  config.env = 'product'
}
// ====== Request Class ======
const defaultOptions = {
  ignoreError: false
};

/*
 * Requests a URL, returning a promise.
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export function request(url, options) {
  options = {
    ...defaultOptions,
    ...options
  };
  return (
    fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(res => checkResponse(res, options)) // 接口通信成功，处理返回值
      .catch(err => handleError(err, options))
  ); // 发生异常，进行兜底处理
}

/*
 * @param {string} url - 请求的接口地址
 * @param {object} data - 请求参数
 * @param {object} options 传递给fetch API的参数
 */
export function post(url, data, options) {
  // 开发环境使用mock数据
  if (config.env === 'dev') {
    url = '/api' + url;
  }
  return request(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': injectSelfToken()
    },
    body: stringify({
      ...data
    }),
    ...options
  });
}

export function put(url, data, options) {
  // 开发环境使用mock数据
  if (config.env === 'dev') {
    url = '/api' + url;
  }
  return request(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'token': injectSelfToken()
    },
    body: JSON.stringify({
      ...data,
    }),
    ...options
  });
}

export function postJson(url, data, options) {
  // 开发环境使用mock数据
  if (config.env === 'dev') {
    url = '/api' + url;
  }
  return request(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'token': injectSelfToken()
    },
    body: JSON.stringify({
      ...data,
    }),
    ...options
  });
}

/*
 *
 * @param {string} url 请求的接口地址
 * @param {object} data 请求参数
 * @param {object} options 传递给fetch API的参数
 */
export function get(url, data = {}, options) {
  // 开发环境使用mock数据
  if (config.env === 'dev') {
    url = '/api' + url;
  }
  // data = data;
  return request(`${url}?${stringify(data)}`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'token': injectSelfToken()
    },
    ...options
  });
}

// ====== Response Class ======

class AbstractResponse {
  constructor(response, error) {
    if (response) {
      this.code = response.code;
      this.data = response; // 这里的返回数据为整个response对象
    }
    this.error = error || null;
  }
}

/*
 * 错误时候的响应对象
 */
class ErrorResponse extends AbstractResponse {
  constructor(error) {
    super(null, error);
    this.errorType = 'response';
  }
}

/*
 * 接口正常时的返回对象
 */
class SuccessResponse extends AbstractResponse {
  constructor(response) {
    super(response, null);
  }
}
// ====== Util ======
/*
 * { a: 1, b: 2} ==> a=1&b=2
 */
function stringify(obj = {}) {
  let a = Object.keys(obj)
    .filter(k => obj[k] || +obj[k] === 0)
    .map(k => {
      let value = obj[k];
      if (typeof value === 'object') {
        value = encodeURIComponent(JSON.stringify(value));
      } else {
        value = encodeURIComponent(value);
      }
      return encodeURIComponent(k) + '=' + value;
    })
    .join('&');
  return a;
}

// ====== 接口返回值处理具体逻辑 ======
const SUCCESS_CODE = [
  0
];
// const SUCCESS_BOOL = true; // 返回success
const ErrorHandlers = {
  '401.1': function (error, options) {
    return Modal.error({
      title: '提示',
      content: '您当前的会话已超时，请重新登录。',
      afterClose: () => {
        if (error && error.data) {
          let url = parseURL(error.data);
          let searchs = [],
            searchString = '',
            querystringParse = querystring.parse(url.search);
          querystringParse.redirectUrl = window.location.href;
          forEach(querystringParse, (value, key) => {
            searchs.push(`${key}=${value}`);
          });
          searchs.length && (searchString = searchs.join('&'));
          options && options.callback && options.callback();

          let newUrl = `${url.protocol}//${url.hostname}`;
          url.port && (newUrl += `:${url.port}`);
          url.pathname && (newUrl += `${url.pathname}`);
          searchString && (newUrl += `?${searchString}`);
          window.location.href = newUrl;
        }
      }
    });
  },
  verifyCodeInvalid: () => { },
  'NoPermission.Directory': function () {
    //TODO: do nothing
  }
};


/*
 * 接口返回值处理逻辑，如果未捕获到匹配的处置方案，则抛出异常
 * @param {*} response
 * @param {*} options 配置可选项，如忽略错误
 */
function checkResponse(response, options) {
  const { code, } = response;
  if (SUCCESS_CODE.includes(code)) {
    return new SuccessResponse(response);
  } else {
    if (code === -100) {
      Modal.warning({
        content: '登录超时，请重新登陆',
        okText: '确定',
        onOk: () => {
          window.location.href = `//${window.location.host}/login`;
        }
      })
    }else{
      throw new ErrorResponse(response);
    }
  }
}

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

let dialogInstance;

// 兜底的错误处理
function handleError(err, options) {
  let msg = null,
    code = null;
  if (!options.ignoreError) {
    if (dialogInstance) return;
    if (err.errorType === 'response') {
      let responseError = err.error || null;
      if (responseError) {
        code = responseError.code || null;
        msg = responseError.msg || responseError.message || null;
        let handleResError =
          code && ErrorHandlers[code] ? ErrorHandlers[code] : null;

        if (handleResError) {
          return (dialogInstance = handleResError(responseError, {
            callback: () => {
              dialogInstance = null;
            }
          }));
        }
      }
    }
    msg = err.message || msg || 'Unknown error';

    //针对faked与Pace的本地冲突的错误提示的关闭
    if (msg === 'request.addEventListener is not a function') {
      return;
    }
    return (dialogInstance = Modal.error({
      title: '提示',
      content: `${decodeHtml(msg)}`,
      afterClose: () => {
        dialogInstance = null;
      }
    }));
  }
  throw new ErrorResponse(err);
}
