export class CreateEmployeeDto {
  firstName: string;
  lastName: string;
  monthlySalary: number;
  annualSalary?: number;
  annualTax?: number;
  netAnnualSalary?: number;
}