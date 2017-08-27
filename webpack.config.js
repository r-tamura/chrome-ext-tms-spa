const path = require("path")

module.exports = {
  // Source mapping
  devtool: "inline-source-map",

  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },

  // 利用loaders一覧
  module: {
    rules:
    [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ]
      },
    ]
  },

  // resolve
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    },
    extensions: [".tsx", ".ts", ".js"]
  },
}
