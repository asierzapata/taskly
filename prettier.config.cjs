/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
	printWidth: 80,
	useTabs: true,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: false,
	quoteProps: 'as-needed',
	trailingComma: 'none',
	bracketSpacing: true,
	jsxBracketSameLine: false,
	arrowParens: 'avoid',
	tabWidth: 2,
	// pluginSearchDirs: false,
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		require.resolve('prettier-plugin-tailwindcss')
	],
	importOrder: [
		'^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
		'^(next/(.*)$)|^(next$)',
		'^(expo(.*)$)|^(expo$)',
		'<THIRD_PARTY_MODULES>',
		'',
		'^@taskly/(.*)$',
		'',
		'^~/utils/(.*)$',
		'^~/components/(.*)$',
		'^~/styles/(.*)$',
		'^~/(.*)$',
		'^[./]'
	],
	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
	importOrderTypeScriptVersion: '5.0.4'
}

module.exports = config
