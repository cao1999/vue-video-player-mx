// vue-loader需要配合使用vue-loader-plugin，从vue-loader包中导出
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CleanCssPlugin = require("less-plugin-clean-css");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// 用来吧css从js文件中分离出来
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: "vue-loader",
      },
      {
        test: /\.(css|less)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                // clean css删除注释等
                plugins: [new CleanCssPlugin({ advanced: true })],
              },
            },
          },
        ],
      },
      {
        // 解析字体文件的loader
        test: /\.(woff2?|ttf|eot|otf)(\?.*)?$/,
        exclude: /node_modules/,
        use: "url-loader",
      },
    ],
  },
  resolve: {
    extensions: [".vue", ".js", ".less"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },

  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },

  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};
