import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { TaxService } from './services/tax.service';
import { Employee } from './entities/employee.entity';
import { TaxBracket } from './entities/tax-bracket.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { TaxResult } from './types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(TaxBracket)
    private taxBracketRepository: Repository<TaxBracket>,
    private readonly taxService: TaxService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('employees')
  async getEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  @Post('employees')
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(createEmployeeDto);

    // Calculate tax fields and attach to employee before saving
    const taxResult = await this.taxService.calculateForEmployee(employee);
    employee.annualSalary = taxResult.annualSalary;
    employee.annualTax = taxResult.annualTax;
    employee.netAnnualSalary = taxResult.netAnnualSalary;
    if (taxResult.bracket) {
      employee.taxBracket = taxResult.bracket;
    }

    return await this.employeeRepository.save(employee);
  }

  @Delete('employees/:id')
  async deleteEmployee(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('tax-brackets')
  async getTaxBrackets(): Promise<TaxBracket[]> {
    return await this.taxBracketRepository.find({
      order: { minIncome: 'ASC' }
    });
  }

  @Get('calculate-tax/:employeeId')
  async calculateTax(@Param('employeeId', ParseIntPipe) employeeId: number): Promise<TaxResult> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId }
    });

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    const taxBrackets = await this.taxBracketRepository.find({
      order: { minIncome: 'ASC' }
    });

    return this.calculateIncomeTax(employee, taxBrackets);
  }

  private calculateIncomeTax(employee: Employee, taxBrackets: TaxBracket[]): TaxResult {
    const annualSalary = employee.monthlySalary * 12;
    const taxableIncome = annualSalary;

    let annualTax = 0;
    let applicableBracket = '';

    // Find the applicable tax bracket and calculate tax
    for (const bracket of taxBrackets) {
      if (taxableIncome >= bracket.minIncome && 
          (bracket.maxIncome === null || taxableIncome <= bracket.maxIncome)) {
        
        applicableBracket = bracket.bracketName;
        
        // Calculate tax based on the bracket
        if (bracket.rate === 0) {
          // Tax exempt bracket
          annualTax = 0;
        } else {
          // Calculate excess over minimum income
          const excessIncome = taxableIncome - bracket.minIncome;
          annualTax = bracket.baseTax + (excessIncome * bracket.rate);
        }
        break;
      }
    }

    const monthlyTax = annualTax / 12;
    const netAnnualSalary = annualSalary - annualTax;

    return {
      annualSalary,
      taxableIncome,
      annualTax: Math.round(annualTax * 100) / 100,
      monthlyTax: Math.round(monthlyTax * 100) / 100,
      netAnnualSalary: Math.round(netAnnualSalary * 100) / 100,
      taxBracket: applicableBracket,
    };
  }
}
