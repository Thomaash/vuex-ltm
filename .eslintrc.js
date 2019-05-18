module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript',
    '@vue/standard'
  ],
  plugins: [
    '@typescript-eslint',
    'mocha'
  ],
  rules: {
    // standard-like ts
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-delimiter-style': ['error', {
      'multiline': {
        'delimiter': 'none',
        'requireLast': true
      },
      'singleline': {
        'delimiter': 'semi',
        'requireLast': false
      }
    }],

    // delete in the future?
    '@typescript-eslint/no-explicit-any': 'off',

    // custom
    'array-bracket-spacing': ['error', 'never'],

    // default
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  overrides: [{
    files: ['*.ts'],
    rules: {
      // Reports type overloading
      'import/export': 'off'
    }
  }, {
    // Tests
    files: ['test/**/*'],
    env: {
      node: true,
      mocha: true
    },
    rules: {
      // Chai uses expressions like expect(…).to.be.true
      'no-unused-expressions': 'off'
    }
  }, {
    // Config files in the root of the project
    files: ['!*/**'],
    env: {
      node: true
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off'
    }
  }],
  parser: '@typescript-eslint/parser'
}
