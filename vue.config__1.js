const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin') // 这里引入`这个CopyWebpackPlugin`插件
function resolve (dir) {
  return path.join(__dirname, '/src' + '/' + dir)
}
const name = process.env.VUE_APP_TITLE || 'hos' // 网页标题
const port = process.env.port || process.env.npm_config_port || 8080 // 端口
module.exports = {
  // publicPath:'./',
  lintOnSave: false,
  configureWebpack: {
    plugins:
      [
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, 'static'),
            to: 'static',
            ignore: ['.*']
          }
        ])
      ]
  },
  chainWebpack: config => {
    config.plugin('html')
      .tap((args) => {
        args[0].title = name
        return args
      })
    config.resolve.alias
      .set('@', resolve('biz'))
      .set('@sys', resolve('sys-core'))
      .set('@components', resolve('sys-core/components'))
  },
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    disableHostCheck: true
  }
}
