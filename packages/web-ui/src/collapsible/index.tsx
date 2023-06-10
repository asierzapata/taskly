'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { classnames } from '../lib/classnames'

const CollapsibleContext = React.createContext<{
	open: boolean
}>({
	open: false
})

const Collapsible = React.forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ children, open, onOpenChange, ...props }, ref) => {
	const [isOpen, setIsOpen] = React.useState(false)

	const handleOpenChange = React.useCallback(
		(_open: boolean) => {
			setIsOpen(_open)
			onOpenChange?.(_open)
		},
		[onOpenChange]
	)

	const contextValue = React.useMemo(
		() => ({ open: open || isOpen }),
		[open, isOpen]
	)

	return (
		<CollapsibleContext.Provider value={contextValue}>
			<CollapsiblePrimitive.Root
				ref={ref}
				open={contextValue.open}
				onOpenChange={handleOpenChange}
				{...props}
			>
				{children}
			</CollapsiblePrimitive.Root>
		</CollapsibleContext.Provider>
	)
})
Collapsible.displayName = CollapsiblePrimitive.Root.displayName

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = React.forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => {
	const { open } = React.useContext(CollapsibleContext)
	return (
		<AnimatePresence>
			{open && (
				<CollapsiblePrimitive.CollapsibleContent
					ref={ref}
					asChild
					{...props}
					forceMount
				>
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{
							opacity: 1,
							height: 'auto'
						}}
						exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
						className={classnames('rounded-md', className)}
					>
						{children}
					</motion.div>
				</CollapsiblePrimitive.CollapsibleContent>
			)}
		</AnimatePresence>
	)
})
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
