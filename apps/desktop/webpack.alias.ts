import path from 'path'

export const alias = {
	'@': path.resolve(__dirname, './src'),
	'@renderer': path.resolve(__dirname, './src/renderer'),
	'@main': path.resolve(__dirname, './src/main')
}
