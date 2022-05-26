export const TokenTypeValues = ['REFRESH', 'ACCESS'];
export type TokenType = typeof TokenTypeValues[number];

export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';