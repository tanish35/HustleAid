export type TokenType = 'Loan' | 'Food' | 'Healthcare' | 'Transportation';

export interface TokenViewData {
  id: number;
  name: TokenType;
  description: string;
  count: number;
  status: 'active' | 'pending' | 'expired';
  lastUsed?: Date;
}

export interface UserToken {
  tokenId: number;
  tokenType: TokenType;
  balance: number;
  description?: string;
}

export const SAMPLE_TOKENS: TokenViewData[] = [
  {
    id: 1,
    name: 'Loan',
    description: 'Financial assistance',
    count: 0,
    status: 'active'
  },
  {
    id: 2,
    name: 'Food',
    description: 'Meal support',
    count: 5,
    status: 'active'
  },
  {
    id: 3,
    name: 'Healthcare',
    description: 'Medical aid',
    count: 0,
    status: 'active'
  },
  {
    id: 4,
    name: 'Transportation',
    description: 'Travel assistance',
    count: 0,
    status: 'active'
  }
];
