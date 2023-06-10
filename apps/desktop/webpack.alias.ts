import path from 'path'

export const alias = {
	'@': path.resolve(__dirname, './src'),
	'@renderer': path.resolve(__dirname, './src/renderer'),
	'@modules': path.resolve(__dirname, './src/modules')
}
