/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Icons,
	Input,
	Label,
	classnames
} from '@taskly/web-ui'
import React from 'react'
import { Link } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { langs } from '@uiw/codemirror-extensions-langs'
import { historyField } from '@codemirror/commands'
import { githubDark } from '@uiw/codemirror-theme-github'

const stateFields = { history: historyField }

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

export const MainScreen = () => {
	const serializedState = localStorage.getItem('myEditorState')
	const value = localStorage.getItem('myValue') || ''

	return (
		<div className="flex min-h-screen w-full">
			<div className="w-350 h-screen">
				<div className="relative flex h-full flex-col items-center justify-between rounded-lg shadow-md">
					<div className="w-full p-2">
						<Button
							variant="ghost"
							className={classnames(
								'flex w-full items-center justify-start gap-3 px-0'
							)}
							// onClick={onToggle}
						>
							<Icons.chevronLeft size={20} />
							<span className="flex items-center gap-3 ">
								<span className="bg-gradient-to-tl from-amber-400 to-orange-600 bg-clip-text text-transparent">
									Taskly
								</span>
							</span>
						</Button>
					</div>
					<div className="w-full flex-1 overflow-y-auto p-2">
						<nav aria-label="Main Nav" className="flex flex-col space-y-1">
							<Link to={`/`}>
								<Button
									as="a"
									variant="ghost"
									className={classnames(
										'flex w-full items-center gap-3',
										'justify-start'
									)}
									// onClick={isSmallViewport ? onToggle : _.noop}
								>
									<Icons.calendarClock size={20} />
									{/* {isOpen ? ( */}
									<span className="text-sm font-medium"> Today </span>
									{/* ) : null} */}
								</Button>
							</Link>
						</nav>
						<div className="mh-4 mv-6 h-0.5 w-full bg-gradient-to-tl from-amber-400 to-orange-600" />

						<div className="mt-5">
							<Collapsible>
								<span
									className={classnames(
										'flex items-center justify-between rounded px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800',
										Math.random() > 0.5 && 'bg-slate-100 dark:bg-slate-800'
									)}
								>
									<Link to={`/`} className="w-full">
										<span className="ml-4 flex-1 text-sm">
											This is an Area!
										</span>
									</Link>

									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											size="xs"
											className="data-[state=open]:bg-slate-200 data-[state=open]:dark:bg-slate-700 [&[data-state=open]>svg]:rotate-180"
										>
											<Icons.chevronDown
												size={14}
												className="transition-transform duration-200"
											/>
										</Button>
									</CollapsibleTrigger>
								</span>
								<CollapsibleContent>
									<Button
										as="a"
										variant="ghost"
										size="xs"
										className={classnames(
											'flex items-center justify-between rounded px-4 py-4 hover:bg-slate-200 dark:hover:bg-slate-800',
											Math.random() > 0.5 && 'bg-slate-200 dark:bg-slate-800'
										)}
									>
										<span className="ml-4 flex-1 text-xs">
											This is a project!
										</span>
									</Button>
								</CollapsibleContent>
							</Collapsible>
						</div>
					</div>
				</div>
			</div>
			<div className="relative h-screen flex-1">
				<CodeMirror
					value={value}
					basicSetup={{
						lineNumbers: false,
						highlightSelectionMatches: true
					}}
					theme={githubDark}
					initialState={
						serializedState
							? {
									json: JSON.parse(serializedState || ''),
									fields: stateFields
							  }
							: undefined
					}
					onChange={(value, viewUpdate) => {
						localStorage.setItem('myValue', value)

						const state = viewUpdate.state.toJSON(stateFields)
						localStorage.setItem('myEditorState', JSON.stringify(state))
					}}
					extensions={[langs.markdown()]}
				/>
			</div>
			<div className="w-350 relative h-screen"></div>
		</div>
	)
}
