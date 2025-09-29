import { Controller, Get, Post, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxBracket } from '../entities/tax-bracket.entity';
import { Employee } from '../entities/employee.entity';

@Controller()
export class TaxController {
  constructor(
    @InjectRepository(TaxBracket)
    private taxBracketRepository: Repository<TaxBracket>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  @Get('tax-brackets')
  async getTaxBrackets(): Promise<TaxBracket[]> {
    return await this.taxBracketRepository.find({
      order: { minIncome: 'ASC' }
    });
  }

  @Post('calculate-tax/:employeeId')
  async calculateTax(@Param('employeeId') employeeId: string) {
    console.log('🔍 TAX CALCULATION START');
    console.log('📋 Employee ID:', employeeId);

    const employee = await this.employeeRepository.findOne({
      where: { id: +employeeId }
    });

    console.log('👤 Employee found:', employee);

    if (!employee) {
      console.log('❌ Employee not found');
      throw new NotFoundException('Employee not found');
    }

    const annualSalary = employee.monthlySalary * 12;
    console.log('💰 Monthly Salary:', employee.monthlySalary);
    console.log('💰 Annual Salary:', annualSalary);

    const taxBrackets = await this.taxBracketRepository.find({
      order: { minIncome: 'ASC' }
    });

    console.log('📊 Tax Brackets found:', taxBrackets.length);
    console.log('📊 Tax Brackets details:', taxBrackets.map(b => ({
      id: b.id,
      name: b.bracketName,
      minIncome: b.minIncome,
      maxIncome: b.maxIncome,
      rate: b.rate,
      baseTax: b.baseTax
    })));

    // Find the appropriate tax bracket
    console.log('🔍 Finding applicable bracket for annual salary:', annualSalary);
    
    const applicableBracket = taxBrackets.find(bracket => {
      const meetsMinimum = annualSalary >= bracket.minIncome;
      const meetsMaximum = bracket.maxIncome === null || annualSalary <= bracket.maxIncome;
      const applies = meetsMinimum && meetsMaximum;
      
      console.log(`🔸 Checking bracket ${bracket.bracketName}:`, {
        minIncome: bracket.minIncome,
        maxIncome: bracket.maxIncome,
        meetsMinimum,
        meetsMaximum,
        applies
      });
      
      return applies;
    });

    console.log('✅ Applicable Bracket:', applicableBracket);

    if (!applicableBracket) {
      console.log('❌ No applicable tax bracket found');
      throw new Error('No applicable tax bracket found');
    }

    // Calculate tax using Philippine progressive tax system
    console.log('🧮 Starting tax calculation...');
    console.log('🧮 Base Tax (raw):', applicableBracket.baseTax, 'Type:', typeof applicableBracket.baseTax);
    console.log('🧮 Rate (raw):', applicableBracket.rate, 'Type:', typeof applicableBracket.rate);
    
    // Convert to numbers to ensure proper calculation
    const baseTax = Number(applicableBracket.baseTax);
    const rate = Number(applicableBracket.rate);
    const minIncome = Number(applicableBracket.minIncome);
    
    console.log('🧮 Base Tax (converted):', baseTax);
    console.log('🧮 Rate (converted):', rate);
    console.log('🧮 Min Income (converted):', minIncome);
    
    const getExcessThreshold = (bracketName: string): number => {
      if (bracketName === 'Tax Exempt') {
        return 0;
      }
      return minIncome - 1;  // For all other brackets, use minIncome - 1
    };
    
    const excessThreshold = getExcessThreshold(applicableBracket.bracketName);
    console.log('🧮 Excess Threshold:', excessThreshold);
    
    let annualTax = 0;
    if (rate > 0) {
      const excessAmount = annualSalary - excessThreshold;
      console.log('🧮 Excess Amount:', excessAmount);
      
      const taxOnExcess = excessAmount * rate;
      console.log('🧮 Tax on Excess:', taxOnExcess);
      
      annualTax = baseTax + taxOnExcess;
      console.log('🧮 Total Annual Tax (Base + Excess):', annualTax);
    } else {
      console.log('🧮 Tax rate is 0, no tax calculated');
      annualTax = baseTax; // Still apply base tax even if rate is 0
    }

    const netAnnualSalary = annualSalary - annualTax;

    console.log('📊 FINAL RESULTS:');
    console.log('📊 Monthly Salary:', employee.monthlySalary);
    console.log('📊 Annual Salary:', annualSalary);
    console.log('📊 Annual Tax:', annualTax);
    console.log('📊 Net Annual Salary:', netAnnualSalary);

    return {
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        monthlySalary: employee.monthlySalary
      },
      monthlySalary: employee.monthlySalary,
      annualSalary,
      annualTax: Math.round(annualTax * 100) / 100,
      netAnnualSalary: Math.round(netAnnualSalary * 100) / 100,
      taxBracket: applicableBracket.bracketName,
      bracketDetails: {
        bracketName: applicableBracket.bracketName,
        minIncome: applicableBracket.minIncome,
        maxIncome: applicableBracket.maxIncome,
        rate: applicableBracket.rate,
        baseTax: applicableBracket.baseTax
      }
    };
  }
}