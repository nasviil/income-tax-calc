import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxBracket } from '../entities/tax-bracket.entity';
import { Employee } from '../entities/employee.entity';
import { DatabaseService } from './database.service';
import { TaxBracketSeeder } from './seeds/tax-bracket.seeder';
import { EmployeeSeeder } from './seeds/employee.seeder';
import { TaxService } from '../services/tax.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaxBracket, Employee])],
  providers: [DatabaseService, TaxBracketSeeder, EmployeeSeeder, TaxService],
  exports: [DatabaseService, TaxBracketSeeder, EmployeeSeeder, TaxService],
})
export class DatabaseModule {}