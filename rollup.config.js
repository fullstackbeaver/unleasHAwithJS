import resolve    from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: '/bin/dmxHa.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    typescript(),
    terser()
  ],
  external: id => /node_modules/.test(id), // Mark dependencies in node_modules as external
};
