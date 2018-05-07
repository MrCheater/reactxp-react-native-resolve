import fs from 'fs'
import path from 'path'
import nodeExternals from 'webpack-node-externals'

import getModulesDirs from 'resolve-scripts/dist/core/get_modules_dirs'
import getWebpackEnvPlugin from 'resolve-scripts/dist/core/get_webpack_env_plugin'
import getWebpackResolveAliasPlugin from 'resolve-scripts/dist/core/get_webpack_resolve_alias_plugin'

const host = process.argv[3] || require('my-local-ip')();

try{
  fs.mkdirSync('dist')
} catch (e) {}
const pathToMain = path.resolve(__dirname, 'client/index.native.js');

export default (webpackConfigs, { resolveConfig, deployOptions, env }) => {
  fs.writeFileSync(
    pathToMain,
    `
import React from 'react'
import RX from 'reactxp'
import createHistory from 'history/createMemoryHistory'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Routes, createStore } from 'resolve-scripts'


const routes = require($resolve.routes)
const rootPath = $resolve.rootPath

const initialState = {}

const origin = "http://${host}:${resolveConfig.port}"

const history = createHistory({
  basename: rootPath
})

const store = createStore({
  initialState,
  history,
  origin,
  rootPath
})

RX.App.initialize(true, true)
RX.UserInterface.setMainView(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes routes={routes} />
    </ConnectedRouter>
  </Provider>
)

`)


  webpackConfigs.push({
    name: 'Server',
    entry: ['babel-regenerator-runtime', path.resolve(__dirname, 'client/index.native.js')],
    mode: deployOptions.mode,
    devtool: 'source-map',
    target: 'node',
    node: {
      __dirname: true,
      __filename: true
    },
    resolve: {
      modules: getModulesDirs()
    },
    output: {
      path: path.resolve(__dirname, 'dist') ,
      filename: 'expo.main.js',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loaders: [
            {
              loader: 'babel-loader?cacheDirectory=true'
            }
          ],
          exclude: [...getModulesDirs(), path.resolve(__dirname, 'dist')]
        }
      ]
    },
    plugins: [
      getWebpackEnvPlugin({ resolveConfig, deployOptions, env }),
      getWebpackResolveAliasPlugin({ resolveConfig, deployOptions, env })
    ],
    externals: getModulesDirs().map(modulesDir => nodeExternals({ modulesDir, whitelist: 'resolve-scripts' }))
  })



//   fs.writeFileSync(
//       pathToMain,
//       `
// import React from 'react'
// import RX from 'reactxp'
// import createHistory from 'history/createMemoryHistory'
// import { Provider } from 'react-redux'
// import { ConnectedRouter } from 'react-router-redux'
//
//
// $resolve = ${JSON.stringify(resolveConfig, null, 2)}
//
// const { Routes, createStore } = require('resolve-scripts')
//
//
// const routes = require("${resolveConfig.routes}")
// const rootPath = "${resolveConfig.rootPath}"
//
// const initialState = {}
//
// const origin = "${host}:${resolveConfig.port}"
//
// const history = createHistory({
//     basename: rootPath
// })
//
// const store = createStore({
//   initialState,
//   history,
//   origin,
//   rootPath
// })
//
// RX.App.initialize(true, true)
// RX.UserInterface.setMainView(
//   <Provider store={store}>
//     <ConnectedRouter history={history}>
//         <Routes routes={routes} />
//     </ConnectedRouter>
//   </Provider>
// )
//         `.trim()
//     )

}