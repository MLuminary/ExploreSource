# React

> 用来记录探索 React 的历程

## WebStorm

关于 `Unresolved function or method`

去 Languages & Frameworks/Node.js and Npm 下选中 Coding assistance for Node.js , 对于一些 Npm 包，如果也显示此项信息，可以在 `require` 后的包名字上键入 `ALT + ENTER` ，然后选择安装其 `types`

## Webpack

> webpack is a module bundle for modern Javascript applications

## Npm

```shell
npm install--save # dependencies 发布时还需要的依赖
npm install –save-dev # devDependencies 开发时需要但发布时不需要的依赖
```

## 服务端渲染

返回给浏览器是直接可以呈现的内容

### 单页应用存在的问题

SEO 不友好，谷歌百度不会去执行 js 代码，抓取页面时只会是一个空白的 html 页面 

首次请求等待时间较长，体验不好

### React 中使用服务端渲染

`React-dom` 是 react 专门为 Web 端开发的渲染工具。在客户端使用 `render` 方法渲染组件，在服务器端 `react-dom/server` 提供我们将 react 组件渲染成 HTML 的方法 

关于 warning  "Did not expect server HTML to contain the text node"

```js
<div id="root">
    <app></app>
</div>

// change to this ↓
<div id="root"><app></app></div>

```

## 热加载

```js
module.hot // Property 'hot' does not exist on type 'NodeModule'. #5
// need to install
npm i @types/webpack-env
```

## eslint

