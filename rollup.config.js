import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import tempDir from 'temp-dir'
import terser from '@rollup/plugin-terser'
import tsc from 'typescript'
import typescript from 'rollup-plugin-typescript2'

function adjustPackageJSON(
  packageJSON,
  { allPeer, overrides, stripBabel, stripDeps, suffix }
) {
  const tmpPackageJSON = { ...packageJSON }

  if (allPeer) {
    tmpPackageJSON.peerDependencies = {
      ...tmpPackageJSON.dependencies,
      ...tmpPackageJSON.peerDependencies,
    }
    delete tmpPackageJSON.dependencies
  }
  if (stripDeps) {
    delete tmpPackageJSON.dependencies
  }
  if (stripBabel) {
    delete tmpPackageJSON.babel
  }

  delete tmpPackageJSON.devDependencies
  delete tmpPackageJSON.husky
  delete tmpPackageJSON.mocha
  delete tmpPackageJSON.nyc
  delete tmpPackageJSON.scripts

  tmpPackageJSON.name = ['@tomina', tmpPackageJSON.name].join('/')
  if (suffix != null) {
    tmpPackageJSON.name = [tmpPackageJSON.name, suffix].join('-')
  }
  tmpPackageJSON.publishConfig = {
    access: 'public',
  }

  tmpPackageJSON.files = ['**']
  tmpPackageJSON.types = 'types'

  Object.assign(tmpPackageJSON, overrides)

  // Make sure that the order of the properties is stable.
  return Object.keys(tmpPackageJSON)
    .sort()
    .reduce((acc, key) => {
      acc[key] = tmpPackageJSON[key]
      return acc
    }, {})
}

const commonAssets = ['README.md', 'LICENSE*', 'dist/types/']

const input = 'src/index.ts'
const extensions = ['.js', '.ts']

const esnextPlugins = [
  typescript({
    typescript: tsc,
    cacheRoot: `${tempDir}/.rpt2_cache`,
  }),
  commonjs(),
  resolve({
    extensions,
  }),
]
const es5Plugins = [
  ...esnextPlugins,
  babel({
    extensions,
    include: ['src/**/*'],
    babelHelpers: 'runtime',
  }),
]
const es5MinPlugins = [...es5Plugins, terser()]

export default [
  // new
  {
    strictDeprecations: true,
    input,
    output: [
      {
        file: `releases/esnext/vuex-ltm.esm.js`,
        format: 'es',
      },
      {
        file: `releases/esnext/vuex-ltm.cjs.js`,
        format: 'cjs',
      },
    ],
    plugins: [
      copy({
        targets: [
          { src: commonAssets, dest: 'releases/esnext/' },
          {
            src: 'package.json',
            dest: 'releases/esnext/',
            transform(contents) {
              return JSON.stringify(
                adjustPackageJSON(JSON.parse(contents.toString()), {
                  allPeer: true,
                  stripBabel: true,
                  suffix: 'esnext',
                  overrides: {
                    browser: undefined,
                    main: 'vuex-ltm.cjs.js',
                    module: 'vuex-ltm.esm.js',
                  },
                }),
                undefined,
                4
              )
            },
          },
        ],
      }),
      ...esnextPlugins,
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    strictDeprecations: true,
    input,
    output: [
      {
        file: `releases/bundled/vuex-ltm.umd.js`,
        format: 'umd',
        name: 'ltm',
      },
      {
        file: `releases/bundled/vuex-ltm.esm.js`,
        format: 'es',
      },
    ],
    plugins: [
      copy({
        targets: [
          { src: commonAssets, dest: 'releases/bundled/' },
          {
            src: 'package.json',
            dest: 'releases/bundled/',
            transform(contents) {
              return JSON.stringify(
                adjustPackageJSON(JSON.parse(contents.toString()), {
                  allPeer: false,
                  stripBabel: false,
                  stripDeps: true,
                  suffix: 'bundled',
                  overrides: {
                    browser: 'vuex-ltm.umd.js',
                    main: 'vuex-ltm.umd.js',
                    module: 'vuex-ltm.esm.js',
                  },
                }),
                undefined,
                4
              )
            },
          },
        ],
      }),
      ...es5Plugins,
    ],
  },
  {
    strictDeprecations: true,
    input,
    output: [
      {
        file: `releases/bundled/vuex-ltm.umd.min.js`,
        format: 'umd',
        name: 'ltm',
      },
      {
        file: `releases/bundled/vuex-ltm.esm.min.js`,
        format: 'es',
      },
    ],
    plugins: es5MinPlugins,
  },

  // old
  {
    strictDeprecations: true,
    input,
    output: [
      {
        file: pkg.main,
        format: 'es',
      },
      {
        file: `dist/esnext/cjs.js`,
        format: 'cjs',
      },
    ],
    plugins: esnextPlugins,
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    strictDeprecations: true,
    input,
    output: ['amd', 'cjs', 'iife', 'umd'].map((format) => ({
      file: `dist/es5/${format}.js`,
      format,
      name: 'ltm',
    })),
    plugins: es5Plugins,
  },
  {
    strictDeprecations: true,
    input,
    output: ['amd', 'cjs', 'iife', 'umd'].map((format) => ({
      file: `dist/es5/${format}.min.js`,
      format,
      name: 'ltm',
    })),
    plugins: es5MinPlugins,
  },
]
