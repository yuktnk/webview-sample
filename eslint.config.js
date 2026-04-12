// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist', 'public', 'tests']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
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
    'eqeqeq': ['error', 'always'],
  },
}, ...storybook.configs["flat/recommended"]])
