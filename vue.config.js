const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
var path = require('path')

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(function() {
        return 'src/components/icon/svgs'
      })
      .end()

    config.module
      .rule('jsvgicon')
      .test(/\.svg$/)
      .include.add(function() {
        return 'src/components/icon/svgs'
      })
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
  },
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
    ],
    module: {
      unknownContextCritical: false
    }
  },
  lintOnSave: false,

  devServer: {
    overlay: {
      warning: false,
      errors: false
    }
  }
}
