const { merge } = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    host: "localhost", // 启动服务器域名
    open: true,
    port: 8080
  }
})