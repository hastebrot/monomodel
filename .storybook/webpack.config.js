const path = require("path")
const webpack = require("webpack")

module.exports = async ({ config, mode }) => {
  config.plugins.push(
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  )
  config.module.rules.push({
    test: [/\.stories\.js$/, /index\.js$/, /[A-Z]*\.story\.js/],
    loaders: [require.resolve("@storybook/addon-storysource/loader")],
    include: [path.resolve(__dirname, "../src")],
    enforce: "pre",
  })
  return config
}
