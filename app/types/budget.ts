export interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  date: string;
  time: string;
  description: string;
}

export interface BudgetData {
  total_income: string;
  total_expense: string;
  balance: string;
  total_salary: string;
  transaction_history: Transaction[];
}

export interface TransactionResponse {
  dexxy: string;
  message: string;
  amount: string;
  new_balance: string;
  date: string;
  time: string;
  description: string;
}

export interface SalaryUpdateResponse {
  dexxy: string;
  message: string;
  new_total_salary: string;
}

