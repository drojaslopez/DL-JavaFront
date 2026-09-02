export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Installment {
  number: number;
  amount: number;
  period: string;
}

export type PaymentMethod = 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'BANK_TRANSFER';
export type FinancialInstitution = 'BANCO_DE_CHILE' | 'BANCO_ESTADO' | 'BANCO_SANTANDER' | 'BANCO_BCI' | 'OTRO';
export type ExpenseType = 'FIXED' | 'VARIABLE';
export type Scope = 'HOME' | 'OUTING' | 'PERSONAL';

export interface Purchase {
  id: string;
  userId: string;
  totalAmount: number;
  purchaseDate: string;
  paymentMethod: PaymentMethod;
  financialInstitution: FinancialInstitution;
  installmentCount: number;
  expenseType: ExpenseType;
  scope: Scope;
  category: string;
  installments?: Installment[];
}

export interface PurchaseRequest {
  userId: string;
  totalAmount: number;
  purchaseDate: string;
  paymentMethod: PaymentMethod;
  financialInstitution: FinancialInstitution;
  installmentCount: number;
  expenseType: ExpenseType;
  scope: Scope;
  category: string;
}

export interface DashboardResponse {
  period: string;
  monthTotal: number;
  byExpenseType: {
    FIXED: number;
    VARIABLE: number;
  };
  byScope: {
    HOME: number;
    OUTING: number;
    PERSONAL: number;
  };
  byCategory: {
    category: string;
    total: number;
  }[];
}

export interface ProjectionResponse {
  projections: {
    period: string;
    committedTotal: number;
  }[];
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
}
