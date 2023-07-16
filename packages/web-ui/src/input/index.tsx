import * as React from 'react'

import { classnames } from '../lib/classnames'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	webkitdirectory?: string
	isInvalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, isInvalid, ...props }, ref) => {
		return (
			<input
				className={classnames(
					'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring file:text-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
					className,
					isInvalid && 'border-red-500'
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Input.displayName = 'Input'

export { Input }
