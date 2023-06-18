export type Id = string
export type UserId = string
export type Provider = 'google'
export type ProviderAccountId = string
export type RefreshToken = string
export type AccessToken = string
export type ExpiresAt = number
export type TokenType = string

export type Account = {
	_id: Id
	userId: UserId
	provider: Provider
	providerAccountId: ProviderAccountId
	refreshToken?: RefreshToken
	accessToken?: AccessToken
	expiresAt?: ExpiresAt
	tokenType?: TokenType
}
