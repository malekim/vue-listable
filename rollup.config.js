import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';
import { eslint } from "rollup-plugin-eslint";
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/js/index.js',
  output: [
    {
      file: './build/vue-listable.min.js',
      format: 'iife',
      name: 'VueListable'
    },
    {
      file: './build/vue-listable.esm.js',
      format: 'es',
      name: 'VueListable'
    },
    {
      file: './build/vue-listable.umd.js',
      format: 'umd',
      name: 'VueListable'
    }
  ],
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**'
    }),
    buble(),
    (process.env.NODE_ENV === 'production' && terser()),
  ]
};