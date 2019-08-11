const path = require('path');
const { generateTheme,  } = require('antd-theme-generator');

const options = {
  stylesDir: path.join(__dirname, './src/css'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/css/variables.less'),
  mainLessFile: path.join(__dirname, './src/css/index.less'),
  themeVariables: [
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background',
    '@menu-item-color',
    '@menu-item-active-bg',
    '@menu-dark-item-active-bg',
    '@menu-dark-submenu-bg',
  ],
  indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './public/color.less'),
}

generateTheme(options).then(less => {
  console.log('Theme generated successfully');
})
.catch(error => {
  console.log('Error', error);
});
