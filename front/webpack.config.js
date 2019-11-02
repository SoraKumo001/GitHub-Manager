const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const config = {
  performance: { hints: false },
  mode: "production",
  entry: [path.resolve(__dirname, "src/index.tsx")],
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "../dist")
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ["ts-loader", "eslint-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        use: ["source-map-loader"],
        exclude: /node_modules/,
        enforce: "pre"
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loaders: "url-loader"
      }
    ]
  },
  resolve: {
    symlinks: false,
    extensions: [".ts", ".js", ".tsx", ".scss", "css", ".svg", ".gif"],
    modules: ["node_modules"]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ],

    providedExports: true,
    usedExports: true,
    concatenateModules: true
  },
  plugins: glob.sync(path.join(__dirname, "public", "**/*.html")).map(
    file =>
      new htmlWebpackPlugin({
        template: file
      })
  ),
  devServer: {
    open: true,
    inline: true,
    contentBase: path.join(__dirname, "../dist"),
    host: "localhost"
  }
};
//if (config.mode === "development") {
config.devtool = "source-map";
//}
module.exports = config;
