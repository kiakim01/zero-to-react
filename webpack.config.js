const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx', // 엔트리 포인트 설정 (tsx로 변경)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // 번들된 파일의 이름
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // TypeScript 확장자 추가
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/, // TypeScript 파일도 처리
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Babel 로더를 사용하여 ES6+와 JSX 문법을 변환합니다.
        },
      },
      {
        test: /\.css$/, // .css 파일에 대해
        use: ["style-loader", "css-loader"], // 로더는 배열의 역순으로 적용됩니다.
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i, // 이미지 파일 대상
        type: 'asset/resource', // 개별 파일로 출력
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // 폰트 파일 대상
        type: 'asset/resource',
      },

    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // 정적 파일을 제공할 디렉토리
    },
    port: 3000,          // 서버 포트 번호
    open: true,          // 서버 시작 시 브라우저 자동 열기
    hot: true,           // 핫 모듈 교체 활성화
    historyApiFallback: true, // 히스토리 API를 사용하는 SPA에 유용
    liveReload: true,
  },
  mode: 'development', // 개발 모드 설정
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML 템플릿 파일
      filename: 'index.html', // 출력 파일명
      inject: 'body', // 스크립트를 body 태그 끝에 삽입
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    new Dotenv({
      path: `./.env.${process.env.NODE_ENV}`, // 환경별 .env 파일 경로
    }),
  ],
};
