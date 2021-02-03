const path = require('path');
const { moduleName, dependencies } = require('../package.json');
const { babel } = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const alias = require('@rollup/plugin-alias');
const { terser } = require('rollup-plugin-terser');
const externalGlobals = require('rollup-plugin-external-globals');
const extensions = ['.js', '.ts'];
const DEV = 'development';

const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath);
};

const builds = {
    output: {
      file: resolveFile('dist/index.cjs.js'),
      format: 'cjs',
    },
    external: Object.keys(dependencies),
};

function genConfig(name) {
  const opts = builds
  const config = {
    ...opts,
    cache: true,
    input: resolveFile('src/index.ts'),
    output: {
      name: moduleName,
      ...opts.output,
      sourcemap: opts.env === DEV,
    },
    plugins: [
      nodeResolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
      }),
      alias({
        resolve: extensions,
        entries: [
          {
            find: '@',
            replacement: path.resolve(__dirname, '../src'),
          },
        ],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
      }),
    ].concat(opts.plugins || []),
  };
  return config;
}

module.exports = genConfig();