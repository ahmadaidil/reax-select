import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default {
  input: 'src/Select.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: ['styled-components'],
  plugins: [
    external({
      includeDependencies: false
    }),
    resolve(),
    babel({
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        'transform-react-remove-prop-types'
      ],
      exclude: 'node_modules/**'
    }),
    commonjs(),
    terser()
  ],
  onwarn(warning, rollupWarn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
      rollupWarn(warning)
    }
  }
}
