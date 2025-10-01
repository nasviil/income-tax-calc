import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  monthlySalary?: number;

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