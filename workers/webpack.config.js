const path = require("path");

module.exports = {
  entry: {
    "pixelator.worker": "./src/pixelator.worker.ts"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../public/workers")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: { extensions: [".ts", ".js"] },
  mode: "production"
};
