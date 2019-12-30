<h1 align='center'>de-express</h1>

<p align='center'>
  <a href='https://david-dm.org/htdangkhoa/de-express'>
    <img src='https://david-dm.org/htdangkhoa/de-express/status.svg' alt='dependencies Status'/>
  </a>

  <a href='https://david-dm.org/htdangkhoa/de-express?type=dev'>
    <img src='https://david-dm.org/htdangkhoa/de-express/dev-status.svg' alt='devDependencies Status'/>
  </a>

  <a href='https://github.com/prettier/prettier'>
    <img src='https://img.shields.io/badge/code_style-prettier-ff69b4.svg' alt='code style: prettier'/>
  </a>

  <a href='https://github.com/htdangkhoa/de-express/actions'>
    <img src='https://github.com/htdangkhoa/de-express/workflows/build/badge.svg?branch=develop' alt='build'/>
  </a>

  <a href='https://github.com/htdangkhoa/de-express/blob/master/LICENSE'>
    <img src='https://img.shields.io/github/license/htdangkhoa/de-express' alt='license'/>
  </a>
</p>

<p align='center'>
  <a href='https://www.npmjs.com/package/de-express'>
    <img src='https://nodei.co/npm/de-express.svg' alt='npm' />
  </a>
</p>

---

> `de-express` is a simple way to use [express](http://expressjs.com/) with ES6 decorators.

## Install

```bash
$ yarn add -D @babel/cli @babel/core @babel/node @babel/preset-env @babel/plugin-transform-runtime
# npm install --save-dev @babel/cli @babel/core @babel/node @babel/preset-env @babel/plugin-transform-runtime

$ yarn add -D @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
# or npm install --save-dev @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties

$ yarn add de-express
# or npm install de-express
```

## .babelrc

```json
{
  "presets": ["@babel/env"],
  "plugins": [
    "@babel/transform-runtime",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/proposal-class-properties", { "legacy": true }]
  ]
}
```

## Usage

Visit the [wiki](https://github.com/htdangkhoa/de-express/wiki).

## Demo

[![Edit de-express-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/de-express-example-plx04?fontsize=14&hidenavigation=1&theme=dark)
