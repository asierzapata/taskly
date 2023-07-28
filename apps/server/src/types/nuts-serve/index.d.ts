import { type Router } from 'express'

declare module 'nuts-serve' {
	declare function Nuts(options: {
		repository: string
		token: string
		refreshSecret: string
	}): {
		router: Router
		before: (
			event: string,
			callback: (
				download: {
					platform: { filename: string; type: string }
					version: { tag: string; channel: string }
				},
				next: () => void
			) => void
		) => void
		after: (
			event: string,
			callback: (
				download: {
					platform: { filename: string; type: string }
					version: { tag: string; channel: string }
				},
				next: () => void
			) => void
		) => void
	}
}
