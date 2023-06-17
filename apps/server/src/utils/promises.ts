import _ from 'lodash'

function sequence<T, U>(tasks: T[], fn: (task: T) => Promise<U>) {
	const results = [] as U[]

	if (tasks[0] === undefined) return Promise.resolve([])

	if (tasks.length === 1) {
		return fn(tasks[0]).then(result => [result])
	}

	const tasksWithoutTheFirst = [...tasks.slice(1)]

	const promises = tasksWithoutTheFirst.reduce<ReturnType<typeof fn>>(
		(promise, task) =>
			promise.then(result => {
				results.push(result)
				return fn(task)
			}),
		fn(tasks[0])
	)

	return promises.then(() => results)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { sequence }
