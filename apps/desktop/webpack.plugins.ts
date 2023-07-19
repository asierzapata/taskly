import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import webpack from 'webpack'

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: 'webpack-infrastructure'
	}),
	new webpack.EnvironmentPlugin(['NODE_ENV'])
]
