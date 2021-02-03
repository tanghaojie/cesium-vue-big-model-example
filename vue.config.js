const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // publicPath:
  //   process.env.NODE_ENV === 'production' ? '/\n' + 'vue-cesium-example/' : '/',
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'node_modules/cesium/Build/Cesium/Workers', to: 'Cesium/Workers' },
          {
            from: 'node_modules/cesium/Build/Cesium/ThirdParty',
            to: 'Cesium/ThirdParty'
          },
          { from: 'node_modules/cesium/Build/Cesium/Assets', to: 'Cesium/Assets' },
          { from: 'node_modules/cesium/Build/Cesium/Widgets', to: 'Cesium/Widgets' }
        ]
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('./Cesium')
      })
    ]
    // module: {
    //   // Removes these errors: "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
    //   // https://github.com/AnalyticalGraphicsInc/cesium-webpack-example/issues/6
    //   unknownContextCritical: false,
    //   unknownContextRegExp: /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
    // }
  }
}
