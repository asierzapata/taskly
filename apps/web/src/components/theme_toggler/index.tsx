import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'
import { Button } from '@taskly/web-ui'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const ThemeToggler = () => {
	const { systemTheme, theme, setTheme } = useTheme()
	const currentTheme = theme === 'system' ? systemTheme : theme

	return (
		<Button
			onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
		>
			{currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
			{currentTheme === 'dark' ? 'Light' : 'Dark'}
		</Button>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { ThemeToggler }
