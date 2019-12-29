# de-express

> `de-express` is a simple way to use [express](http://expressjs.com/) with ES6 decorators.

[![NPM](https://nodei.co/npm/de-express.png)](https://www.npmjs.com/package/de-express)

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
