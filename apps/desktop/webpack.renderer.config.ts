import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { alias } from './webpack.alias'

rules.push({
  test: /\.css$/,
  use: ['style-loader', 'css-loader', 'postcss-loader']
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
		alias,
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
