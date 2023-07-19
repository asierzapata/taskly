import axios from 'axios'
import _ from 'lodash'

export const api = axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? 'https://taskly.fly.dev/api/v1'
			: 'http://localhost:8080/api/v1',
	timeout: 1000,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(response => {
	if (_.get(response, 'data.meta.token')) {
		localStorage.setItem('token', response.data.meta.token)
	}
	return response
})
