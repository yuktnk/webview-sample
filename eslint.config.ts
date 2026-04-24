// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import js from '@eslint/js'
import queryPlugin from '@tanstack/eslint-plugin-query'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'public', 'tests', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      ...queryPlugin.configs['flat/recommended'],
      prettier,
    ],
    plugins: {
      react: reactPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['vitest.shims.d.ts', '.storybook/main.ts', '.storybook/preview.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'react/function-component-definition': ['error', { namedComponents: 'function-declaration' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': 'warn',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/no-array-index-key': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      'no-nested-ternary': 'error',
      'react/destructuring-assignment': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'error',
      'react/no-unstable-nested-components': 'error',
      'prefer-template': 'error',
      'react/jsx-pascal-case': 'error',
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: "Use '@/' path alias instead of relative imports going up directories.",
            },
          ],
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      // TypeScript 型安全性強化
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      // import/export ルール
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js 標準モジュール
            'external', // 外部ライブラリ（node_modules）
            'internal', // @/ エイリアス
            'parent', // ../
            'sibling', // ./
            'index', // ./index
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'ignore',
        },
      ],
      'import/no-cycle': 'warn',
    },
  },
  // .ts ファイルのファイル名: camelCase のみ（自動生成ファイルは除外）
  {
    files: ['src/**/*.ts'],
    plugins: { unicorn },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: { camelCase: true },
          ignore: [/^routeTree\.gen/],
        },
      ],
    },
  },
  // .tsx ファイルのファイル名: camelCase または PascalCase
  // TanStack Router の特殊ファイル（$param.tsx・__root.tsx）は除外
  {
    files: ['src/**/*.tsx'],
    plugins: { unicorn },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: { camelCase: true, pascalCase: true },
          ignore: [/^\$/, /^__/],
        },
      ],
    },
  },
  // NOTE: .d.ts ファイルは Vite 等のグローバル型を宣言マージで拡張するため interface が必要。
  // type エイリアスは宣言マージができないため、d.ts ファイルのみ interface を許可する。
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  // NOTE: .storybook は src の外にあるため、相対パス（../src）を使用する必要があります。
  // no-restricted-imports ルールを除外します。
  {
    files: ['.storybook/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  // NOTE: eslint.config.ts は ESLint 自身の設定のため、import/order ルールを除外
  {
    files: ['eslint.config.ts'],
    rules: {
      'import/order': 'off',
    },
  },
  // NOTE: storybook.configs['flat/recommended'] が readonly 型を返すため、
  // ESLint の defineConfig の型定義と合致しない。eslint-plugin-storybook
  // の型定義が不完全なため、ここでのみ型アサーションを使用。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  ...(storybook.configs['flat/recommended'] as any),
])
