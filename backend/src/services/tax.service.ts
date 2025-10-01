import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxBracket } from '../entities/tax-bracket.entity';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(TaxBracket)
    private readonly taxBracketRepository: Repository<TaxBracket>,
  ) {}

  async calculateForEmployee(employee: Employee): Promise<{ annualSalary: number; annualTax: number; netAnnualSalary: number; bracket?: TaxBracket }> {
    const monthly = Number(employee.monthlySalary) || 0;
    const annualSalary = +(monthly * 12).toFixed(2);

    const brackets = await this.taxBracketRepository.find({ order: { minIncome: 'ASC' } });
    if (!brackets || brackets.length === 0) {
      console.log('⚠️ No tax brackets found - returning zero tax');
      return { annualSalary, annualTax: 0, netAnnualSalary: annualSalary };
    }

    const bracket = brackets.find(b => {
      const min = Number(b.minIncome);
      const max = b.maxIncome === null ? Infinity : Number(b.maxIncome);
      return annualSalary >= min && annualSalary <= max;
    });

    if (!bracket) {
      console.log('⚠️ No matching bracket for annualSalary:', annualSalary);
      return { annualSalary, annualTax: 0, netAnnualSalary: annualSalary };
    }

    const minIncome = Number(bracket.minIncome);
    const baseTax = Number(bracket.baseTax) || 0;
    const rate = Number(bracket.rate) || 0;

    const excessBase = minIncome - 1;
    const excess = Math.max(0, annualSalary - excessBase);
    const annualTax = +(baseTax + rate * excess).toFixed(2);
    const netAnnualSalary = +(annualSalary - annualTax).toFixed(2);

    // Detailed logging for debug
    console.log('🧮 Tax calculation details:');
    console.log('  - annualSalary:', annualSalary);
    console.log('  - matchedBracket:', {
      id: bracket.id,
      name: bracket.bracketName,
      minIncome: bracket.minIncome,
      maxIncome: bracket.maxIncome,
      rate: bracket.rate,
      baseTax: bracket.baseTax,
    });
    console.log('  - excessBase (minIncome - 1):', excessBase);
    console.log('  - excess:', excess);
    console.log('  - baseTax:', baseTax);
    console.log('  - rate:', rate);
    console.log('  - annualTax:', annualTax);
    console.log('  - netAnnualSalary:', netAnnualSalary);

    return { annualSalary, annualTax, netAnnualSalary, bracket };
  }
}
