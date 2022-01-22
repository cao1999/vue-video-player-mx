// webpack中文官网 https://webpack.docschina.org/
const TerserPlugin = require("terser-webpack-plugin");
const baseConfig = require("./webpack.config.base");
const { merge } = require("webpack-merge");
const path = require("path");
const resolve = (dir) => {
  return path.resolve(__dirname, dir);
};
module.exports = merge(baseConfig, {
  mode: "production",
  entry: resolve("../src/index.js"),
  output: {
    path: resolve("../dist"),
    filename: "vue-video-player-mx.js",
    library: {
      name: "vue-video-player-mx",
      type: "umd",
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.(js|vue|less)$/i,
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: true,
      }),
    ],
  },
});
