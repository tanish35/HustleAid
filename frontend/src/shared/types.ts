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
  aadharCardImage?: string;
  totalFundsReceived?: number;
  activeSchemes?: number;
  approvedApplications?: number;
  aadharNo?: string;
  dob?: Date;
  gender?: string;
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
