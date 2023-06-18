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
