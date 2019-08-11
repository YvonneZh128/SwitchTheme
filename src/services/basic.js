import { get, put } from '../utils/request';

const requestList = {
  /* 设置请求数据接口 */
  getRequest: '/request-api-get',
  postRequest: '/request-api-post',

}

export function gets(type) {
  return async function (data, options) {
    return await get(requestList[type], data, options);
  }
}
export function posts(type) {
  return async function (data, options) {
    return await put(requestList[type], data, options);
  }
}