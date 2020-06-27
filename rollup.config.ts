// rollup.config.ts
import typescript from '@rollup/plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import tsconfig from './tsconfig.json'

export default {
  input: './src/js/index.ts',
  output: [
    {
      file: './build/vue-listable.min.js',
      format: 'iife',
      name: 'VueListable',
      globals: {
        vue: 'Vue',
      },
    },
    {
      file: './build/vue-listable.esm.js',
      format: 'es',
      name: 'VueListable',
      globals: {
        vue: 'Vue',
      },
    },
    {
      file: './build/vue-listable.umd.js',
      format: 'umd',
      name: 'VueListable',
      globals: {
        vue: 'Vue',
      },
    },
  ],
  external: ['vue'],
  plugins: [
    commonjs({
      sourceMap: true,
    }),
    typescript({
      ...tsconfig.compilerOptions,
      include: '**/*.{js,ts}',
    }),
    terser(),
  ],
}
