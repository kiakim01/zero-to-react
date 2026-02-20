const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: './dist',
    hot: true, // HMR (Hot Module Replacement) 활성화
    open: true,
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // style-loader를 사용하여 CSS를 DOM에 주입
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              'react-refresh/babel', // React Refresh를 위한 Babel 플러그인
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(), // React Refresh 플러그인 추가
  ],
  optimization: {
    runtimeChunk: 'single',
  },
});

/*
 * Hot Reload vs HMR (Hot Module Replacement) 차이점:
 * 
 * 1. Hot Reload:
 *    - 파일이 변경되면 전체 페이지를 새로고침
 *    - 애플리케이션의 상태(state)가 초기화됨
 *    - 간단하지만 개발 중 상태를 잃어버림
 * 
 * 2. HMR (Hot Module Replacement):
 *    - 변경된 모듈만 교체하여 업데이트
 *    - 애플리케이션의 상태를 유지함
 *    - React Refresh는 React 컴포넌트를 위한 HMR 구현
 *    - 컴포넌트 수정 시 상태를 유지하면서 UI만 업데이트
 *    - 더 빠르고 효율적인 개발 경험 제공
 */