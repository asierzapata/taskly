/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const theme = require('@taskly/tailwind-theme')

module.exports = {
	content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
	theme,
	plugins: [require('@tailwindcss/line-clamp')]
}
