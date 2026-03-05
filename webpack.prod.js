const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv')
const common = require('./webpack.common.js')

// Load .env file
const env = dotenv.config().parsed || {}

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // PostCSS 로더 추가
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-preset-env')({
                    browsers: 'last 2 versions', // 지원할 브라우저 범위 설정
                  }),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-preset-env')({
                    browsers: 'last 2 versions',
                  }),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 해쉬 :변경된 파일만 새로 다운로드, 파일의 이름표 (캐쉬랑은 뭐가 다르지 ?)
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // Define environment variables for production build
    new webpack.DefinePlugin({
      'process.env.VITE_TMDB_TOKEN': JSON.stringify(
        env.VITE_TMDB_TOKEN || process.env.VITE_TMDB_TOKEN
      ),
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 프로덕션 빌드에서 console.log 제거
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    // 벤더 청크 : .....
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
})
