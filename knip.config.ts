import type { KnipConfig } from 'knip'

const imageCompiler = () => 'export default ""'

const config: KnipConfig = {
  project: ['src/**/*.{ts,tsx}', 'src/**/*.{svg,png,jpg,jpeg,gif,webp}'],
  compilers: {
    svg: imageCompiler,
    png: imageCompiler,
    jpg: imageCompiler,
    jpeg: imageCompiler,
    gif: imageCompiler,
    webp: imageCompiler,
  },
  ignore: ['src/bridge/index.ts'],
  entry: ['src/routes/**/*.tsx'],
  ignoreDependencies: ['@secretlint/secretlint-rule-preset-recommend'],
}

export default config
