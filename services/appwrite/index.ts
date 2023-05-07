import { Account, Client } from 'appwrite'

const appwriteClient = new Client()
	.setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
	.setProject('64576dfdf06589b534e8') // Your project ID

const account = new Account(appwriteClient)

export { appwriteClient, account }
