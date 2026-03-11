// 코드를 플러그인 기반으로 변환하는 트랜스파일러
// 컴파일 단계

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
    // 바벨에서 JSX -> JS(_)
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    // _TypeScript를 JavaScript로 변환 (타입 제거)
    '@babel/preset-typescript',
  ],
}
