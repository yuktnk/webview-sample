import type { KnipConfig } from 'knip'

const imageCompiler = () => 'export default ""'

const config: KnipConfig = {
  // 画像拡張子は compilers で登録済みのため project パターンには含めない
  project: ['src/**/*.{ts,tsx}'],
  compilers: {
    svg: imageCompiler,
    png: imageCompiler,
    jpg: imageCompiler,
    jpeg: imageCompiler,
    gif: imageCompiler,
    webp: imageCompiler,
  },
  ignore: [
    // NativeBridge は WebView 実行環境で window オブジェクト経由で呼ばれるため参照なし
    'src/bridge/index.ts',
    // デザインシステムのプリミティブとして定義済み・ページ実装で順次使用予定
    'src/components/ui/Button.tsx',
    'src/components/ui/Checkbox.tsx',
    'src/components/ui/ExternalLink.tsx',
    'src/components/ui/Img.tsx',
  ],
  entry: [
    'src/routes/**/*.tsx',
    // API 型定義は Zod スキーマから推論した named type として公開エントリ扱い
    'src/types/api/**/*.ts',
  ],
  ignoreDependencies: ['@secretlint/secretlint-rule-preset-recommend'],
}

export default config
