import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { classnames } from '../lib/classnames'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
	'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
	{
		variants: {
			variant: {
				default:
					'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900',
				destructive:
					'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
				outline:
					'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100',
				subtle:
					'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
				ghost:
					'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
				link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent'
			},
			size: {
				default: 'py-2 px-4',
				none: 'p-0',
				xs: 'p-1',
				sm: 'px-2 rounded-md',
				lg: 'px-8 rounded-md'
			},
			height: {
				default: 'h-10',
				none: 'h-auto',
				xs: 'h-6',
				sm: 'h-8',
				lg: 'h-12'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			height: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	as?: string | React.ElementType
	isLoading?: boolean
	unboundedHeight?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			as: T = 'button',
			className,
			variant,
			size,
			children,
			isLoading,
			disabled,
			unboundedHeight = false,
			...props
		},
		ref
	) => {
		return (
			<T
				className={classnames(
					buttonVariants({
						variant,
						size,
						height: unboundedHeight ? 'none' : size,
						className
					})
				)}
				ref={ref}
				disabled={isLoading || disabled}
				{...props}
			>
				{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
				{children}
			</T>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
