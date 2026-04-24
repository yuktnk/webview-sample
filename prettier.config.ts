import type { Config } from 'prettier'

export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  useTabs: false,
  tabWidth: 2,
  printWidth: 100,
  arrowParens: 'always',
  endOfLine: 'lf',

  plugins: ['prettier-plugin-organize-imports'],
} satisfies Config
