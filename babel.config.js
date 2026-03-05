// Babel 설정 파일 - JavaScript 트랜스파일링 설정
module.exports = {
  // Babel presets - 변환 규칙 세트 (역순으로 실행됨)
  presets: [
    // 3번째 실행: 최신 JS를 타겟 브라우저가 이해할 수 있는 JS로 변환
    ['@babel/preset-env', {
      targets: '> 0.25%, not dead', // 시장 점유율 0.25% 이상, 지원 중인 브라우저
      useBuiltIns: 'usage', // 필요한 폴리필만 자동 추가
      corejs: 3 // core-js 버전 3 사용
    }],
    // 2번째 실행: JSX를 JavaScript로 변환
    ['@babel/preset-react', {
      runtime: 'automatic' // React 17+ 새로운 JSX Transform (import React 생략 가능)
    }],
    // 1번째 실행: TypeScript를 JavaScript로 변환 (타입 제거)
    '@babel/preset-typescript'
  ],
  
  // 환경별 설정
  env: {
    // 개발 환경 전용 플러그인
    development: {
      plugins: [
        'react-refresh/babel' // React Fast Refresh를 위한 플러그인 (HMR 지원)
      ]
    },
    // 프로덕션 환경 전용 플러그인
    production: {
      plugins: [
        // 필요시 console.log 제거 플러그인 등 추가 가능
        // 'transform-remove-console'
      ]
    }
  }
}