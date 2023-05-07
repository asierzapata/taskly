import React from 'react'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { StyleSheet, View } from 'react-native'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#fff'
	}
})

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const BaseScreen = ({ children }: { children: React.ReactNode }) => {
	return <View>{children}</View>
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { BaseScreen }
