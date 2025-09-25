import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxBracket } from '../entities/tax-bracket.entity';
import { Employee } from '../entities/employee.entity';
import { DatabaseService } from './database.service';
import { TaxBracketSeeder } from './seeds/tax-bracket.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([TaxBracket, Employee])],
  providers: [DatabaseService, TaxBracketSeeder],
  exports: [DatabaseService, TaxBracketSeeder],
})
export class DatabaseModule {}