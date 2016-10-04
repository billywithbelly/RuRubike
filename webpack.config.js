var ClosureCompilerPlugin = require('webpack-closure-compiler');
module.exports = {
  // 檔案起始點從 entry 進入，因為是陣列所以也可以是多個檔案
  entry: [
    './public/js/react/index.js',
  ],
  // output 是放入產生出來的結果的相關參數
  output: {
    path: `${__dirname}/public/js/react`,
    filename: 'index_bundle.js',
  },
  module: {
    // loaders 則是放欲使用的 loaders，在這邊是使用 babel-loader 將所有 .js（這邊用到正則式）相關檔案（排除了 npm 安裝的套件位置 node_modules）轉譯成瀏覽器可以閱讀的 JavaScript。preset 則是使用的 babel 轉譯規則，這邊使用 react、es2015
    loaders: [
      { 
      	test: /\.css$/, 
      	loader: "style-loader!css-loader" 
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  // devServer 則是 webpack-dev-server 設定
  devServer: {
    inline: true,
    port: 8008,
  },
  plugins: [
        new ClosureCompilerPlugin({
          compiler: {
            language_in: 'ECMASCRIPT6',
            language_out: 'ECMASCRIPT5',
            compilation_level: 'WHITESPACE_ONLY'
          },
          concurrency: 3,
        })
    ]
};