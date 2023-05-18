import * as React from 'react'

export function H1({ children }: { children: React.ReactNode }) {
	return (
		<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			{children}
		</h1>
	)
}

export function H2({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
			{children}
		</h2>
	)
}

export function H3({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
			{children}
		</h3>
	)
}

export function H4({ children }: { children: React.ReactNode }) {
	return (
		<h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
			{children}
		</h4>
	)
}

export function Paragraph({ children }: { children: React.ReactNode }) {
	return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
}

export function Quote({ children }: { children: React.ReactNode }) {
	return (
		<blockquote className="mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200">
			{children}
		</blockquote>
	)
}
