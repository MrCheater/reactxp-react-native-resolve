import fs from "fs";
import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

import getModulesDirs from "resolve-scripts/dist/core/get_modules_dirs";
import getWebpackEnvPlugin from "resolve-scripts/dist/core/get_webpack_env_plugin";
import getWebpackResolveAliasPlugin from "resolve-scripts/dist/core/get_webpack_resolve_alias_plugin";

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
  const [webpackClientConfig] = webpackConfigs

  if(!webpackClientConfig.resolve.alias) {
    webpackClientConfig.resolve.alias = {}
  }

  Object.assign(
    webpackClientConfig.resolve.alias,
    {
      '$resolve.routes': resolveConfig.routes,
      '$resolve.crossplatform.history': 'history/createBrowserHistory',
    }
  )

  webpackClientConfig.plugins.push(
    new webpack.DefinePlugin({
      "$resolve.crossplatform.origin":
        "window.location.origin",
    })
  );

  for(const target of ['ios', 'android']) {
    webpackConfigs.push({
      name: target,
      entry: [
        "babel-regenerator-runtime",
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
        alias: {
          '$resolve.routes': resolveConfig.routes,
          '$resolve.crossplatform.history': 'history/createMemoryHistory',
        },
        extensions: [`.${target}.js`, ".native.js", ".js"]
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
            test: /\.js$/,
            loaders: [
              {
                loader: "babel-loader?cacheDirectory=true"
              }
            ],
            exclude: [...getModulesDirs(), path.resolve(__dirname, "dist")]
          }
        ]
      },
      plugins: [
        getWebpackEnvPlugin({ resolveConfig, deployOptions, env }),
        getWebpackResolveAliasPlugin({ resolveConfig, deployOptions, env }),
        new webpack.DefinePlugin({
          "$resolve.crossplatform.origin": JSON.stringify(
            `http://${host}:${resolveConfig.port}`
          ),
        })
      ],
      externals: getModulesDirs().map(modulesDir =>
        nodeExternals({ modulesDir, whitelist: "resolve-scripts" })
      )
    });
  }
};
