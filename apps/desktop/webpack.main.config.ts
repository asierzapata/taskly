import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { alias } from './webpack.alias'

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
		alias,
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
