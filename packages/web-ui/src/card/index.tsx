import React from 'react'
import { classnames } from '../lib/classnames'

export const Card = ({
	children,
	className
}: {
	className?: string
	children: React.ReactNode
}) => {
	return (
		<div
			className={classnames(
				'hover:from-cyan-400 hover:to-purple-400',
				'w-full rounded bg-gradient-to-br from-cyan-400',
				'via-blue-400 to-purple-400 p-[1px] transition duration-300'
			)}
		>
			<div
				className={classnames(
					'group h-full rounded p-4 transition duration-300',
					className
				)}
			>
				{children}
			</div>
		</div>
	)
}
