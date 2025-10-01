import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TaxBracket } from './tax-bracket.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'monthly_salary', type: 'decimal', precision: 12, scale: 2 })
  monthlySalary: number;

  @Column({ name: 'annual_salary', type: 'decimal', precision: 14, scale: 2, nullable: true })
  annualSalary?: number;

  @Column({ name: 'annual_tax', type: 'decimal', precision: 14, scale: 2, nullable: true })
  annualTax?: number;

  @Column({ name: 'net_annual_salary', type: 'decimal', precision: 14, scale: 2, nullable: true })
  netAnnualSalary?: number;

  @ManyToOne(() => TaxBracket, { nullable: true })
  @JoinColumn({ name: 'tax_bracket_id' })
  taxBracket?: TaxBracket;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}