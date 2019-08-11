import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { isEmpty } from 'lodash';
import { ContainerQuery } from 'react-container-query';
import classnames from 'classnames';
import Context from './AllContext';
import { THEME_LIST } from 'constants/common_configs'; 
import { Layout,  Tag ,message } from 'antd';
import './index.less';

const { CheckableTag } = Tag
const { Content } = Layout;
@withRouter
@inject('HomeStore')
@observer
class HomeLayout extends Component {
  state = {
    collapsed: false,
    firstMount: false
  };

  render() {
    const layout = <div style={{marginLeft:'20px',display:'inline-block'}}>
    <span>选择切换主题：</span>
    {
      THEME_LIST && THEME_LIST.map((tag,index) =>{
        return <CheckableTag 
          style={{background:this.props.HomeStore.isSwitchTheme.name === tag.name && tag.primaryColor,
            color:this.props.HomeStore.isSwitchTheme.name === tag.name &&'#fff'}}
          key = {index}
          onChange = {checked => this.onSwitchTheme(tag, checked)}
          checked = {this.props.HomeStore.isSwitchTheme.name === tag.name}
        >
        {tag.name}
        </CheckableTag>
      })
    }
  
  </div>;
    return (
      <div id='Assets'>
        <ContainerQuery query={Media_Query}>
          {params => <Context.Provider value={this.getContext()}>
              <div className={classnames(params)}>
                {layout}
              </div>
            </Context.Provider>
          }
        </ContainerQuery>
        
      </div>
    );
  }
  
  getContext = () => {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
      ...this.props
    };
  }
  
  /* 切换主题点击 */
  onSwitchTheme = (tag,checked) =>{
    this.props.HomeStore.isSwitchTheme = tag
    window.less.modifyVars(
      {
        '@primary-color': tag.primaryColor,
        '@menu-dark-item-active-bg':tag.primaryColor,
        '@link-color': tag.primaryColor,
        '@text-color':tag.primaryColor,
        '@btn-primary-bg': tag.primaryColor,
        '@layout-header-background':tag.name === '葡萄紫' ? 'linear-gradient(137deg,rgba(76,56,148,1) 0%,rgba(32,30,106,1) 100%)' : 
          '#001529',
        '@menu-dark-submenu-bg':'transparent',
      }
    )
    .then(() => { 
      message.success('主题切换成功')
    })
    .catch(error => {
      message.error(`主题切换失败`);
      console.log(error)
    });
  }
  componentDidMount() {
    /* 接入默认主题 */
    this.props.HomeStore.isSwitchTheme = THEME_LIST[0]

  }
}
export default HomeLayout;