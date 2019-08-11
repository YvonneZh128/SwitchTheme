import { get, put } from '../utils/request';

const requestList = {
  getList: 'manage/index/console',
  setLogin: '/manage/login',
  getMenuList: '/manage/sys/menu/getMenuByUserId',
  getCustomMenu: '/getCustomMenu',
  workEndInfo: '/manage/index/workEndInfo',
  deviceInfo: '/manage/index/deviceInfo',
  staffInfo: '/manage/index/staffInfo',

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