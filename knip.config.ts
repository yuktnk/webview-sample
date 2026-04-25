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
  ignore: [
    'src/bridge/index.ts',
    'src/mocks/data/userInfo.ts',
    'src/mocks/handlers/userInfo.ts',
    'src/queries/userInfo.ts',
    'src/types/api/userInfo.ts',
  ],
  entry: ['src/routes/**/*.tsx'],
  ignoreDependencies: ['@secretlint/secretlint-rule-preset-recommend'],
}

export default config
