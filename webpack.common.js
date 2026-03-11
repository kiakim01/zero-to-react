// 개발/프로덕션 환경 공통 Webpack 설정
const path = require('path') // _파일 경로 처리
const HtmlWebpackPlugin = require('html-webpack-plugin') // HTML 파일에 번들 자동 삽입
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 이전 빌드 파일 자동 삭제
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin') // TypeScript 타입 체크 (tsc _ 타입 체킹 하는 녀석)
const Dotenv = require('dotenv-webpack') // .env 파일 환경변수 로드

module.exports = {
  // Webpack이 번들링을 시작할 진입점 (의존성 그래프의 시작점)
  entry: './src/index.tsx', // _단일 엔트리
  output: {
    path: path.resolve(__dirname, 'dist'), //_빌드 파일의 저장 위치(config.js의 "outDir" 와는 어떻게 다를까 ?)
    filename: '[name].[contenthash].js', //_번들된 파일의 이름
    chunkFilename: '[name].[contenthash].js', // 코드 스플릿된 청크 파일 이름
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // _import 시 확장자 생략 가능
    alias: {
      // _절대 경로 (tsconfig.json 의 path 랑은 어떻게 다른가 ?)
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // _처리할 파일 패턴
        exclude: /node_modules/, // _제외할 폴더
        use: {
          loader: 'ts-loader', // 컴파일 하는 녀석 지정
          // .ts/.tsx → Babel → .js
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        //   이미지를 별도 파일로 출력
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        //   웹폰트 파일 처리
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 이전 빌드 파일 자동 삭제
      template: './public/index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  optimization: {
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
}
