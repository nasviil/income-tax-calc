import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tax_brackets')
export class TaxBracket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bracket_name', type: 'varchar', length: 100 })
  bracketName: string;

  @Column({ name: 'min_income', type: 'decimal', precision: 12, scale: 2 })
  minIncome: number;

  @Column({ name: 'max_income', type: 'decimal', precision: 12, scale: 2, nullable: true })
  maxIncome: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  rate: number;

  @Column({ name: 'base_tax', type: 'decimal', precision: 12, scale: 2, default: 0 })
  baseTax: number;
}