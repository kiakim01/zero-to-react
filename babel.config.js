// 코드를 플러그인 기반으로 변환하는 트랜스파일러
module.exports = {
  presets: [
    // _최신 JS → 구형 브라우저 JS (tsconfig.js의 target과는 어떻게 다른가 ?)
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    // React JSX 문법을 순수 JavaScript 함수 호출로 변환 (tsconfig.js의 "jsx": "react"와는 어떻게 다른가 ?)
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    // _TypeScript를 JavaScript로 변환 (타입 제거)
    '@babel/preset-typescript',
  ],

  env: {
    // _개발 환경 전용 플러그인
    development: {
      plugins: [
        'react-refresh/babel', // React Fast Refresh를 위한 플러그인 (HMR 지원)
      ],
    },
    // 프로덕션 환경 전용 플러그인
    production: {
      plugins: [
        // 필요시 console.log 제거 플러그인 등 추가 가능
        // 'transform-remove-console'
      ],
    },
  },
}
