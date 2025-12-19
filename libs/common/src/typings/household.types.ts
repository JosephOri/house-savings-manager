export const TRANSACTION_TYPES = ['income', 'expense', 'investment'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
