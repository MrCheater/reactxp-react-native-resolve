import fs from "fs";
import path from "path";
import webpack from "webpack";

import nodeExternals from "webpack-node-externals";

import getModulesDirs from "resolve-scripts/dist/core/get_modules_dirs";
import getWebpackEnvPlugin from "resolve-scripts/dist/core/get_webpack_env_plugin";
import getWebpackAlias from "resolve-scripts/dist/core/get_webpack_alias";

const host = process.argv[3] || require("my-local-ip")();

try {
  fs.mkdirSync("dist");
} catch (e) {}

try {
  fs.mkdirSync("dist/expo");
} catch (e) {}

fs.writeFileSync(
  path.resolve(__dirname, "dist/expo/main.js"),
  `
import main from './main'

export default main
  `
);

export default (webpackConfigs, { resolveConfig, deployOptions, env }) => {
  for(const webpackConfig of webpackConfigs) {
    Object.assign(webpackConfig.module.rules[1].use.options, {
      cacheDirectory: true,
      babelrc: false,
      presets: [
        '@babel/preset-env',
        [
          '@babel/preset-stage-0',
          {
            decoratorsLegacy: true,
            pipelineProposal: 'minimal'
          }
        ],
        '@babel/preset-react'
      ],
      plugins: ['@babel/plugin-transform-runtime']
    })
  }

  const alias = getWebpackAlias()
  
  const isClient = true
  
  for(const target of ['ios', 'android']) {
    fs.writeFileSync(path.resolve(__dirname, `client/crossplatform/origin.${target}.js`),
      `export default ${JSON.stringify(
        `http://${host}:${resolveConfig.port}`
      )}`
    )
  
    webpackConfigs.push({
      name: target,
      entry: [
        '@babel/polyfill',
        path.resolve(__dirname, "client/index.js")
      ],
      mode: deployOptions.mode,
      devtool: "source-map",
      target: "node",
      node: {
        __dirname: true,
        __filename: true
      },
      resolve: {
        modules: getModulesDirs(),
        extensions: [`.${target}.js`, ".js"],
        alias
      },
      output: {
        path: path.resolve(__dirname, "dist/expo"),
        filename: `main.${target}.js`,
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
      },
      module: {
        rules: [
          {
            test: /\$resolve.\w+\.js/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                  babelrc: false,
                  presets: [
                    '@babel/preset-env',
                    [
                      '@babel/preset-stage-0',
                      {
                        decoratorsLegacy: true,
                        pipelineProposal: 'minimal'
                      }
                    ],
                    '@babel/preset-react'
                  ],
                  plugins: ['@babel/plugin-transform-runtime']
                }
              },
              {
                loader: 'val-loader',
                options: {
                  resolveConfig,
                  deployOptions,
                  isClient
                }
              }
            ]
          },
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
            },
            exclude: [
              /node_modules/,
              ...getModulesDirs(),
              path.resolve(__dirname, './dist')
            ]
          }
        ]
      },
      plugins: [
        getWebpackEnvPlugin({ resolveConfig, deployOptions, env, isClient })
      ],
      externals: getModulesDirs().map(modulesDir =>
        nodeExternals({ modulesDir })
      )
    });
  }
};
