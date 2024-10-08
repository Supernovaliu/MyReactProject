const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path =require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks:'initial',
          minChunks: 2,
          minSize: 0,
          name: 'commons'
        }
      }
    }
  },
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins:[
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    }),
    
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        include: path.join(__dirname, '../src'),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../'
          }
        }, 'css-loader','postcss-loader']
      },
      {
        test: /\.less$/,
        use:[{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'less-loader'},{
          loader: 'postcss-loader',
          options: {
            postcssOptions:{
              plugins: [
                require('autoprefixer')
              ]
            }
          }
        }]
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            fallback:{
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]'
              },
            }

          }
        }
      ]
      },{
        test: /\.(mp4|webm|ogg|mp3|wav)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit:1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash.8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  resolve:{
    extensions: ['.js', '.jsx','.ts', '.tsx'],
    alias: {
      pages: path.join(__dirname, '../src/pages'),
      components: path.join(__dirname, '../src/components'),
      actions: path.join(__dirname, '../src/redux/actions'),
      reducers: path.join(__dirname, '../src/redux/reducers'),
      images: path.join(__dirname, '../src/images')
    }
  },
  devServer:{
    
    hot: true,
    historyApiFallback: true,
    open: false,
    port: 3500,
    static: {
      directory: path.join(__dirname, 'dist'),
    }
  }
};