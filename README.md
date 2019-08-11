## react实现线上主题动态切换功能

> 框架选择： create-react-app + mobx + webpack5 + antdesign 

**说明**   
- 由于最近公司有多个主题的共存性，所以需要实现线上主题切换的功能，所以本文主要描述的是基于create-react-app之上的主题切换。
- CSS切换
  有考虑过根据用户选择的主题在切换的时候选择加载页面css文件的区分方案，但是考虑到这种形式需要在页面切换的时候去reload，因为htmlDOM是在css与JS的结合产物，用户体验不是很好。
- Less切换
  单纯引入所有的less文件去做切换，这样不能实现css的动态加载了，会增加无用css文件的加载
- 最后通过比较及查询，获取到第三方插件：[antd-theme-generator](https://www.npmjs.com/package/antd-theme-generator)

**功能实现原则：使用 less 的 modifyVars 完成 antd 的主题变量替换。**

### 安装 `antd-theme-generator`
缺点： 需要配合 `LESS v2.7.x` 使用，不兼容IE。
```
cnpm install antd-theme-generator -S
```

### 添加主题切换文件 `color.js`
根目录下添加文件`color.js`，添加配置内容：
```
const path = require('path');
const { generateTheme,  } = require('antd-theme-generator');

const options = {
  stylesDir: path.join(__dirname, './src/css'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/css/variables.less'),
  mainLessFile: path.join(__dirname, './src/css/index.less'),
  themeVariables: [ //需要动态切换的主题变量
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background'
  ],
  indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './public/color.less'), //页面引入的主题变量文件
}

generateTheme(options).then(less => {
  console.log('Theme generated successfully');
})
.catch(error => {
  console.log('Error', error);
});

```

### CSS 文件下添加less文件
- 添加 `variables.less` 文件：
  ```
  @import "~antd/lib/style/themes/default.less"; //引入antd的变量文件，实现变量的覆盖
  @primary-color: #1DA57A;
  @link-color: #1DA57A;
  @btn-primary-bg:#1DA57A;

  ```

### HTML文件中加入全局less配置
- `index.html`中加入全局`less`变量配置，从而使`less`的`modifyVars`方法可以全局使用，切换主题时覆盖`default.less`中的变量：
  ```
  <!-- 使用自动生成的color.less，主要路径与index.html文件同级 -->
  <link rel="stylesheet/less" type="text/css" href="%PUBLIC_URL%/color.less" /> 
  <script>
    window.less = {
      async: false,
      env: 'production'
    };
  </script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>
  ```

### 项目启动处修改
- 修改项目运行配置`package.json`，项目运行的同时完成页面color文件的配置
  ```
  "scripts": {
    "start": "node color && node scripts/start.js",
    "build": "node color && node scripts/build.js",
    "test": " node color && node scripts/test.js"
  },
  ```

### 页面调用方法切换主题
- 页面点击主题切换配置，这样写的缘故是因为我配置的变量不同：
```
 window.less.modifyVars(
  {
    '@primary-color': '#aaa',
    '@menu-dark-item-active-bg':'#aaa',
    '@link-color': '#aaa',
    '@text-color':'#aaa',
    '@btn-primary-bg': '#aaa',
  }
)
.then(() => { 
  message.success('主题切换成功')
})
.catch(error => {
  message.error(`主题切换失败`);
  console.log(error)
});
```


*由于之后的配置中新增的样式需要遵循主题配置的可以选择使用统一变量，所以变量设置的时候，可以添加`var(--PC)`的全局变量设置*
