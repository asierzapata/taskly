'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { classnames } from '../lib/classnames'
import { VariantProps, cva } from 'class-variance-authority'

const tooltipContentVariants = cva(
	'animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 z-50 overflow-hidden rounded-md border shadow-md',
	{
		variants: {
			variant: {
				default:
					'border-slate-100 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
				danger:
					'border-red-500 bg-red-50 text-red-500 dark:border-red-600 dark:bg-red-600 dark:text-red-50'
			},
			size: {
				default: 'px-3 py-1.5 text-sm',
				sm: 'px-2 py-1 text-xs'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({ ...props }) => <TooltipPrimitive.Root {...props} />
Tooltip.displayName = TooltipPrimitive.Tooltip.displayName

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
		VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={classnames(
			tooltipContentVariants({
				variant,
				className
			})
		)}
		{...props}
	/>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
