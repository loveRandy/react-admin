#### 脚手架版本:
 *create-react-app@2
 这个版本用webpack.config.js替换了webpack.config.prod.js和webpack.config.dev.js
 
 #### 用到react相关的生态链模块:
  * `react`
  * `react-dom`
  * `react-router-dom`: react-router4以后 好像都是用这个东西
  * `react-router-dom`: react-router4以后 好像都是用这个东西
  * `redux`: 用来管理全局状态
  * `react-redux`: 用来管理全局状态
  * `redux-actions`: 用来创建action的，而且生成相关reducers的时候也不要写 switch/case 或 if/else 了，主要是方便。
  * `redux-thunk`: `redux`的中间件， 用来处理我们异步action
  * `antd`: 随便找的一个比较常用的react-UI库
 
 #### 项目要点
  *less配置、antd按需加载
  *路由懒加载
  *根据权限生成动态路由
  *使用connect简化redux使用
  *全局数据请求拦截处理及loading
  *多个代理配置
  *常用表单封装、tabel封装
  *抽离第三方库文件dll
  
  ### 项目启动步骤
1. 安装包
   cnpm/npm install 
2. 开发运行
  npm run start
3. 生产打包
  npm run dll (仅需运行一次)
  npm run build
