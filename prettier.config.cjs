/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | TailwindConfig } */
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
	plugins: [require.resolve('prettier-plugin-tailwindcss')]
}

module.exports = config
