const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
var path = require('path')

module.exports = {
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/cesium/Build/Cesium/Workers',
            to: 'Cesium/Workers'
          },
          {
            from: 'node_modules/cesium/Build/Cesium/ThirdParty',
            to: 'Cesium/ThirdParty'
          },
          {
            from: 'node_modules/cesium/Build/Cesium/Assets',
            to: 'Cesium/Assets'
          },
          {
            from: 'node_modules/cesium/Build/Cesium/Widgets',
            to: 'Cesium/Widgets'
          }
        ]
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('./Cesium')
      })
    ]
  },
  lintOnSave: false,

  devServer: {
    overlay: {
      warning: false,
      errors: false
    }
  }
}
