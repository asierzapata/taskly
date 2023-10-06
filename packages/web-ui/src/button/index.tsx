import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { classnames } from '../lib/classnames'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2',
				xs: 'h-6 px-2.5 py-1.5',
				sm: 'h-8 rounded-md px-3',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9',
				smallIcon: 'h-6 w-6 min-w-6 min-h-6'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			as: T = 'button',
			className,
			variant,
			size,
			children,
			isLoading,
			disabled,
			...props
		},
		ref
	) => {
		return (
			<T
				className={classnames(buttonVariants({ variant, size, className }))}
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
