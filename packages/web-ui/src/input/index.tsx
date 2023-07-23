import * as React from 'react'

import { classnames } from '../lib/classnames'
import { type VariantProps, cva } from 'class-variance-authority'

const inputVariants = cva(
	'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring file:text-foreground flex w-full rounded-md border file:font-medium file:border-0 file:bg-transparent  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			dimension: {
				default: 'h-9 px-3 py-2 text-sm file:text-sm',
				sm: 'h-8 px-2 py-1 text-xs file:text-xs'
			}
		},
		defaultVariants: {
			dimension: 'default'
		}
	}
)

export type InputProps = {
	webkitdirectory?: string
	isInvalid?: boolean
} & VariantProps<typeof inputVariants> &
	React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, isInvalid, dimension, ...props }, ref) => {
		return (
			<input
				className={classnames(
					inputVariants({
						dimension,
						className
					}),
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
