// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  // 相对路径和绝对路径都行
  entry: "./src/index.ts",

  // 输出
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },

  // 加载器
  module: {
    rules: [
        {
            test: /\.tsx?$/,    // .ts或者tsx后缀的文件，就是typescript文件
            use: "ts-loader",   // 就是上面安装的ts-loader
            exclude: "/node-modules/" // 排除node-modules目录
        }
    ],
  },

  // 插件
  plugins: [
    new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname, "index.html"),
    }),
  ],

  // 开发模式使用，方便查错误
  devtool: "inline-source-map",
  
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "8080", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
};
