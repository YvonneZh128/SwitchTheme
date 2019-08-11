import { observable, action, toJS, } from 'mobx';
import { isDataExist } from 'Utils/dataTools';
import * as services from '../services/home';
const uuid = require('uuid/v1');

class Home {
  @observable item01 = []
  @observable item02 = {}
  @observable isLoading = false

  /* 发送异步请求 */
  @action async getRequest(params) {
    this.isLoading = true
    try {
      let res = await services.gets('getRequest')(params)
      this.isLoading = false
      if (isDataExist(res)) {
        // 处理数据
      }
    } catch (error) {
      console.log(error)
    }
  }
  @action async postRequest(params) {
    this.isLoading = true
    try {
      let res = await services.gets('postRequest')(params)
      this.isLoading = false
      if (isDataExist(res)) {
        // 处理数据
      }
    } catch (error) {
      console.log(error)
    }
  }
}
let HomeStore = new Home();
export default HomeStore;