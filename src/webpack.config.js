const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // other configurations...
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: ["$", "exports", "require"], // Don't mangle these variables
          },
          compress: {
            drop_console: true, // Remove console.log statements
          },
        },
        sourceMap: false, // Disable Terser source map generation
      }),
    ],
  },
  module: {
    rules: [
      // other rules...
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [/node_modules\/html2pdf.js/],
      },
    ],
  },
};
