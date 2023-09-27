/**
 * A single source of truth for all the classes used for decorations.
 *  These are kept together here to simplify changing/adding classes later
 * and serve as a reference.
 *
 * Exports under this file don't need to follow any particular naming schema,
 * naming which can give an intuition on what the class is for is preferred.
 */

/** Classes for blockquote decorations. */
export const blockquote = {
	/** Blockquote widget */
	widget: 'cm-blockquote',
	lastWidget: 'cm-blockquote-last',
	firstWidget: 'cm-blockquote-first',
	/** Replace decoration for the quote mark */
	mark: 'cm-blockquote-border',
	lastMark: 'cm-blockquote-border-last',
	firstMark: 'cm-blockquote-border-first',
	titleWidget: 'cm-blockquote-title'
}

/** Classes for codeblock decorations. */
export const codeblock = {
	/** Codeblock widget */
	widget: 'cm-codeblock',
	/** First line of the codeblock widget */
	widgetBegin: 'cm-codeblock-begin',
	/** Last line of the codeblock widget */
	widgetEnd: 'cm-codeblock-end'
}

/** Classes for heading decorations. */
export const heading = {
	/** Heading decoration class */
	heading: 'cm-heading',
	/** Heading levels (h1, h2, etc) */
	level: (level: number) => `cm-heading-${level}`,
	/** Heading slug */
	slug: (slug: string) => `cm-heading-slug-${slug}`
}

/** Classes for link (URL) widgets. */
export const link = {
	/** URL widget */
	widget: 'cm-link'
}

/** Classes for list widgets. */
export const list = {
	/** List bullet */
	bullet: 'cm-list-bullet',
	/** List task checkbox */
	taskCheckbox: 'cm-task-marker-checkbox',
	taskCheckboxWrapper: 'cm-task-marker-checkbox-wrapper',
	taskCheckboxChecked: 'cm-task-marker-checkbox-checked',
	taskCheckboxCheckedWrapper: 'cm-task-marker-checkbox-checked-wrapper',
	/** Task list item with checkbox checked */
	taskChecked: 'cm-task-checked',
	/** Ordered List */
	orderedList: 'cm-ordered-list'
}

/** Classes for image widgets. */
export const image = {
	/** Image preview */
	widget: 'cm-image'
}
