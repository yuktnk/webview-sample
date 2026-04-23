// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import queryPlugin from '@tanstack/eslint-plugin-query'
import prettier from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
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
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      ...queryPlugin.configs['flat/recommended'],
      prettier,
    ],
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'vitest.shims.d.ts',
            '.storybook/main.ts',
            '.storybook/preview.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
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
              message:
                "Use '@/' path alias instead of relative imports going up directories.",
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
  // NOTE: .storybook は src の外にあるため、相対パス（../src）を使用する必要があります。
  // no-restricted-imports ルールを除外します。
  {
    files: ['.storybook/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  // NOTE: storybook.configs['flat/recommended'] が readonly 型を返すため、
  // ESLint の defineConfig の型定義と合致しない。eslint-plugin-storybook
  // の型定義が不完全なため、ここでのみ型アサーションを使用。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(storybook.configs['flat/recommended'] as any),
])
