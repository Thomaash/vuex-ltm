import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import tempDir from 'temp-dir'
import tsc from 'typescript'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const input = 'src/index.ts'
const extensions = ['.js', '.jsx', '.ts', '.tsx']

const esnextPlugins = [
  typescript({
    typescript: tsc,
    cacheRoot: `${tempDir}/.rpt2_cache`
  }),
  commonjs(),
  resolve({
    extensions
  })
]
const es5Plugins = [
  ...esnextPlugins,
  babel({
    extensions,
    include: ['src/**/*'],
    runtimeHelpers: true
  })
]
const es5MinPlugins = [
  ...es5Plugins,
  terser()
]

export default [{
  input,
  output: [{
    file: pkg.main,
    format: 'es'
  }, {
    file: `dist/esnext/cjs.js`,
    format: 'cjs'
  }],
  plugins: esnextPlugins,
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]
}, {
  input,
  output: ['amd', 'cjs', 'iife', 'umd'].map(format => ({
    file: `dist/es5/${format}.js`,
    format,
    name: 'ltm'
  })),
  plugins: es5Plugins
}, {
  input,
  output: ['amd', 'cjs', 'iife', 'umd'].map(format => ({
    file: `dist/es5/${format}.min.js`,
    format,
    name: 'ltm'
  })),
  plugins: es5MinPlugins
}]
