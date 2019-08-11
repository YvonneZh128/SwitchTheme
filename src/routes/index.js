/* 
* router by zyn on 0509
* Router -- 根节点
* BrowserHistory 建立路由传递文件 当前路由引入方式
* Switch 路由切换组件 Router 路由包裹  Redirect 路由指向
* HomeLayout 最外层Home包裹架子
*/

import React,{PureComponent} from 'react';
import { 
  BrowserRouter as Router,
  // Redirect,
  Route,
  Switch
} from 'react-router-dom';

/* 引入组件 */
import { 
  HomePage,
} from './home';

export default class RootRouter extends PureComponent{
  render(){
    return (
      <Router >
        <Switch>
          <Route path='/index' component={HomePage} />
        </Switch>
      </Router>
    );
  }
}



