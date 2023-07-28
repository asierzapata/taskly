import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import type { ForgeConfig } from '@electron-forge/shared-types'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'

const config: ForgeConfig = {
	packagerConfig: {
		name: 'Taskly',
		icon: './src/assets/icons/icon',
		protocols: [
			{
				name: 'Taskly',
				schemes: ['taskly']
			}
		]
	},
	rebuildConfig: {},
	makers: [
		new MakerSquirrel({}),
		new MakerZIP({}, ['darwin']),
		new MakerRpm({}),
		new MakerDeb({
			options: {
				mimeType: ['x-scheme-handler/taskly']
			}
		})
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'asierzapata',
					name: 'taskly'
				},
				authToken:
					'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',
				draft: false,
				preRelease: process.env.CHANNEL !== 'production'
			}
		}
	],
	plugins: [
		new WebpackPlugin({
			mainConfig,
			devContentSecurityPolicy:
				'connect-src fphulvfmwjdhlpgwktsr.supabase.co ws://localhost:3000/ws ws://localhost:8080 http://localhost:8080',
			renderer: {
				config: rendererConfig,
				entryPoints: [
					{
						html: './src/index.html',
						js: './src/renderer.ts',
						name: 'main_window',
						preload: {
							js: './src/preload.ts'
						}
					}
				]
			}
		})
	]
}

export default config
