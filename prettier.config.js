/** @type {import('prettier').Config} */
export default {
  // Prettier 基本設定
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  useTabs: false,
  tabWidth: 2,
  printWidth: 80,

  // prettier-plugin-organize-imports
  // import 順序を自動フォーマット
  plugins: ['prettier-plugin-organize-imports'],

  // organize-imports の設定
  // グループ分けの順序：
  // 1. Node.js 標準モジュール（fs, path等）
  // 2. 外部ライブラリ（node_modules）
  // 3. 内部モジュール（@/ エイリアス）
  // 4. 相対パス（./）
  importOrder: [
    // Node.js 標準モジュール
    '^(fs|path|http|https|stream|util|crypto|os|events)$',
    // 外部ライブラリ（@/ 以外）
    '^[^./]',
    // @/ エイリアス（内部モジュール）
    '^@/',
    // 相対パス
    '^\\.',
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
