import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxBracket } from '../../entities/tax-bracket.entity';

@Injectable()
export class TaxBracketSeeder {
  constructor(
    @InjectRepository(TaxBracket)
    private taxBracketRepository: Repository<TaxBracket>,
  ) {}

  async seed(): Promise<void> {
    // Check if tax brackets already exist
    const existingBrackets = await this.taxBracketRepository.count();
    if (existingBrackets > 0) {
      console.log('Tax brackets already seeded');
      return;
    }

    const taxBrackets = [
      {
        id: 1,
        bracketName: 'Tax Exempt',
        minIncome: 0,
        maxIncome: 250000,
        rate: 0.00,
        baseTax: 0,
      },
      {
        id: 2,
        bracketName: '15% Bracket',
        minIncome: 250001,
        maxIncome: 400000,
        rate: 0.15,
        baseTax: 0, // 15% on excess over 250,000
      },
      {
        id: 3,
        bracketName: '20% Bracket',
        minIncome: 400001,
        maxIncome: 800000,
        rate: 0.20,
        baseTax: 22500, // PHP 22,500 + 20% of excess over 400,000
      },
      {
        id: 4,
        bracketName: '25% Bracket',
        minIncome: 800001,
        maxIncome: 2000000,
        rate: 0.25,
        baseTax: 102500, // PHP 102,500 + 25% of excess over 800,000
      },
      {
        id: 5,
        bracketName: '30% Bracket',
        minIncome: 2000001,
        maxIncome: 8000000,
        rate: 0.30,
        baseTax: 402500, // PHP 402,500 + 30% of excess over 2,000,000
      },
      {
        id: 6,
        bracketName: '35% Bracket',
        minIncome: 8000001,
        maxIncome: null, // NULL for unlimited
        rate: 0.35,
        baseTax: 2202500, // PHP 2,202,500 + 35% of excess over 8,000,000
      },
    ];

    try {
      await this.taxBracketRepository.save(taxBrackets);
      console.log('Tax brackets seeded successfully');
    } catch (error) {
      console.error('Error seeding tax brackets:', error);
    }
  }
}