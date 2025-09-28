export interface TaxResult {
  annualSalary: number;
  taxableIncome: number;
  annualTax: number;
  monthlyTax: number;
  netAnnualSalary: number;
  taxBracket: string;
}

export interface EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  monthlySalary: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxBracketResponse {
  id: number;
  bracketName: string;
  minIncome: number;
  maxIncome: number | null;
  rate: number;
  baseTax: number;
}