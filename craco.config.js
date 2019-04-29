const path = require("path")
const babel = require("./babel.config.js")

module.exports = function({ env, paths }) {
  return {
    devServer: {
      port: 9010,
      open: false,
    },
    babel: babel,
    eslint: {
      enable: false,
    },
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        paths.appBuild = path.resolve(paths.appBuild, "../docs/site")
        if (env === "production") {
          webpackConfig.output.path = paths.appBuild
          webpackConfig.output.publicPath = "/monomodel/site/"
          // webpackConfig.output.filename = "bundle.js"
        }
        return webpackConfig
      },
    },
    jest: {
      configure: {
        testEnvironment: "node",
        testMatch: ["**/src/**/*.(test|spec).(jsx?|tsx?)"],
        testPathIgnorePatterns: ["/node_modules/"],
        transform: {
          "^.+\\.jsx?$": "babel-jest",
        },
        moduleFileExtensions: ["js", "jsx", "json", "node"],
      },
    },
  }
}
