import { Injectable, OnModuleInit } from '@nestjs/common';
import { TaxBracketSeeder } from './seeds/tax-bracket.seeder';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly taxBracketSeeder: TaxBracketSeeder) {}

  async onModuleInit(): Promise<void> {
    // Run seeders when the module initializes
    await this.seedDatabase();
  }

  private async seedDatabase(): Promise<void> {
    console.log('Starting database seeding...');
    
    try {
      await this.taxBracketSeeder.seed();
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Database seeding failed:', error);
    }
  }
}