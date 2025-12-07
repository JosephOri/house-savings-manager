export const FINANCIAL_ORDER_TYPES = [
  'income',
  'expense',
  'investment',
] as const;
export type FinancialOrderType = (typeof FINANCIAL_ORDER_TYPES)[number];
