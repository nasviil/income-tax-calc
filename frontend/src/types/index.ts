export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  monthlySalary: number;
}

export interface TaxBracket {
  id: number;
  bracketName: string;
  minIncome: number;
  maxIncome: number | null;
  rate: number;
  baseTax: number;
}

export interface TaxResult {
  annualSalary: number;
  taxableIncome: number;
  annualTax: number;
  monthlyTax: number;
  netMonthlySalary: number;
  taxBracket: string;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  monthlySalary: string;
}