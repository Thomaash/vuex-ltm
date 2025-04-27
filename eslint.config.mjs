import { defineConfig, globalIgnores } from 'eslint/config'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import mocha from 'eslint-plugin-mocha'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores([
    '.nyc_output/**',
    'coverage/**',
    'dist/**',
    'docs/**',
    'node_modules/**',
    'releases/**',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier'
    ),

    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier,
      mocha,
    },

    languageOptions: {
      globals: Object.fromEntries(
        Object.entries({
          ...globals.browser,
          ...globals.mocha,
          ...globals.node,
        }).map(([key, value]) => [key.trim(), value])
      ),

      parser: tsParser,
      ecmaVersion: 2019,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.lint.json',
      },
    },

    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'array-bracket-spacing': ['error', 'never'],
    },
  },
  {
    files: ['!*/**'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
])
