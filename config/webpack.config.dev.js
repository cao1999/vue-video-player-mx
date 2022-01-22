// vue-loader需要配合使用vue-loader-plugin，从vue-loader包中导出
const baseConfig = require("./webpack.config.base");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const path = require("path");
const resolve = (dir) => {
  return path.resolve(__dirname, dir);
};

module.exports = merge(baseConfig, {
  mode: "development",
  entry: resolve("../example/index.js"),
  output: {
    path: resolve("../"),
    filename: "main.js",
  },
  devServer: {
    hot: true,
    host: "0.0.0.0",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve("../index.html"),
      template: resolve("../index.html"),
    }),
  ],
});
