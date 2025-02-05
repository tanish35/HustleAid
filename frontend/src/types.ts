export type TokenType = "Loan" | "Food" | "Healthcare" | "Transportation";

export interface Token {
  id: number;
  name: TokenType;
  count: number;
}

export interface UserToken {
  tokenId: number;
  tokenType: TokenType;
  balance: number;
}

export type TokenDisplay = Token | {
  id: number;
  name: TokenType;
  count: number;
};