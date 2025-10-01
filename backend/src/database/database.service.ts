import { Injectable, OnModuleInit } from '@nestjs/common';
import { TaxBracketSeeder } from './seeds/tax-bracket.seeder';
import { EmployeeSeeder } from './seeds/employee.seeder';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly taxBracketSeeder: TaxBracketSeeder, private readonly employeeSeeder: EmployeeSeeder) {}

  async onModuleInit(): Promise<void> {
    // Run seeders when the module initializes
    await this.seedDatabase();
  }

  private async seedDatabase(): Promise<void> {
    console.log('Starting database seeding...');
    
    try {
      await this.taxBracketSeeder.seed();
      // Run employee seeder after tax brackets exist
      await this.employeeSeeder.seed();
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Database seeding failed:', error);
    }
  }
}