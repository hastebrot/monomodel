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
