const path = require('path');
const { moduleName, dependencies } = require('../package.json');
const { babel } = require('@rollup/plugin-babel');
const alias = require('@rollup/plugin-alias');
const extensions = ['.js', '.ts'];

const DEV = 'development';

const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath);
};

const build = {
    output: {
      file: resolveFile('dist/index.cjs.js'),
      format: 'cjs',
    },
    external: Object.keys(dependencies),
    env: DEV,
}

function genConfig(name) {
  const opts = build;
  const config = {
    ...opts,
    cache: true,
    input: resolveFile('src/libs/index.ts'),
    output: {
      name: moduleName,
      ...opts.output,
      sourcemap: opts.env === DEV,
    },
    plugins: [
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
      }),
      alias({
        resolve: extensions,
        entries: [
          {
            find: '@lib',
            replacement: path.resolve(__dirname, '../src/lib'),
          },
        ],
      }),
    ].concat(opts.plugins || []),
  };
  return config;
}

module.exports = genConfig()