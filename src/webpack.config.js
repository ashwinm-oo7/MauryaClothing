const TerserPlugin = require("terser-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");
const path = require("path");

module.exports = {
  // other configurations...
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },
  mode: "production",

  // Enable source maps in development only
  devtool: process.env.NODE_ENV === "development" ? "source-map" : false,

  plugins: [
    new WebpackObfuscator(
      {
        rotateStringArray: true,
        stringArray: true,
        stringArrayThreshold: 0.8,
        deadCodeInjection: true,
        selfDefending: true,
      },
      ["excluded_file.js"] // Exclude specific files
    ),
  ],

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
        extractComments: false, // Remove comments in the production build
        sourceMap: false, // Disable Terser source map generation
      }),
    ],
  },
  module: {
    rules: [
      // other rules...
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      // CSS Loader
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // Asset Loader (images, fonts, etc.)
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },

      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [/node_modules\/html2pdf.js/],
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true, // Support SPA routing
  },

  // Resolve extensions
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
};
