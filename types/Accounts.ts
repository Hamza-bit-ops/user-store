export interface AccountEntry {
  _id?: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}