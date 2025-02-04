export interface UserDetails {
  userId: string;
  name: string;
  email: string;
  isVerified: boolean;
  walletId?: string | null;
  panNo?: string | null;
  createdAt: Date;
  avatar?: string;
  activity?: UserActivity[];
  tokens?: UserToken[];
  panCardImage?: string;
  aadhaarCardImage?: string;
  totalFundsReceived?: number;
  activeSchemes?: number;
  approvedApplications?: number;
  aadhaarNo?: string;
}

export interface UserActivity {
  date: Date;
  type: string;
  amount: number;
}

export interface UserToken {
  symbol: string;
  balance: number;
  value: number;
}
