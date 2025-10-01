import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  monthlySalary: number;

  @IsOptional()
  @IsNumber()
  annualSalary?: number;

  @IsOptional()
  @IsNumber()
  annualTax?: number;

  @IsOptional()
  @IsNumber()
  netAnnualSalary?: number;
}