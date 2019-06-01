const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',

  /**
 * 我们会在example目录下建多个子目录
 * 我们会把不同章节的demo放到不同的子目录中
 * 每个子目录的下面会创建一个app.ts
 * app.ts作为webpack构建的入口文件
 * entries收集了多目录个入口文件，并且每个入口还引入了一个用于热更新的文件
 * entries是一个对象，key为目录名
 *  */

  // 多入口配置
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.ts')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  }, {}),

  /**
   * 根据不同的目录名称，打包生成目标js，名称和目录一致
   *  */

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [{
          loader: 'tslint-loader'
        }]
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader', // 对ts文件进行编译转化
          options: {
            transpileOnly: true
          }
        }]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'] // 对文件名添加默认的文件类型
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新
    new webpack.NoEmitOnErrorsPlugin() // 派发错误
  ]
}