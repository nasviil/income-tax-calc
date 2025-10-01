import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { TaxService } from '../../services/tax.service';

@Injectable()
export class EmployeeSeeder {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly taxService: TaxService,
  ) {}

  async seed(): Promise<void> {
    const existing = await this.employeeRepository.count();
    console.log('Existing employee count:', existing);
    const force = process.env.FORCE_SEED_EMPLOYEES === 'true';
    if (existing > 0 && !force) {
      // If there are some employees already, only add enough to reach 50
      const target = 50;
      if (existing >= target) {
        console.log(`Employee records already >= ${target}. To force reseed set FORCE_SEED_EMPLOYEES=true`);
        try {
          const sample = await this.employeeRepository.find({ take: 5, order: { id: 'ASC' } });
          console.log('Sample existing employees:', sample.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, monthlySalary: s.monthlySalary })));
        } catch (err) {
          console.warn('Could not fetch sample employees for diagnostics:', err);
        }
        return;
      }

      const toCreate = target - existing;
      console.log(`There are ${existing} employees; will create ${toCreate} more to reach ${target}.`);
      // proceed but change loop count later
      // We'll generate 'toCreate' employees below instead of 50
      var createCount = toCreate;
    } else if (force) {
      console.log('FORCE_SEED_EMPLOYEES=true detected — clearing existing employees and reseeding');
      await this.employeeRepository.clear();
      var createCount = 50;
    } else {
      // No existing and not force
      var createCount = 50;
    }

    console.log('Seeding 50 random employees...');

    const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Avery', 'Quinn', 'Cameron', 'Drew', 'Reese', 'Parker', 'Rowan'];
    const lastNames = ['Garcia', 'Nguyen', 'Lopez', 'Johnson', 'Smith', 'Brown', 'Martinez', 'Davis', 'Miller', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore'];

    const employees: Employee[] = [];

  for (let i = 0; i < (createCount ?? 50); i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      // Monthly salary between 20,000 and 200,000
      const monthlySalary = +(20000 + Math.random() * (200000 - 20000)).toFixed(2);

      // Build a plain partial employee object
      const emp: Partial<Employee> = {
        firstName,
        lastName,
        monthlySalary,
      };

      // Calculate tax fields using TaxService
      try {
        const taxResult = await this.taxService.calculateForEmployee(emp as Employee);
        emp.annualSalary = taxResult.annualSalary;
        emp.annualTax = taxResult.annualTax;
        emp.netAnnualSalary = taxResult.netAnnualSalary;
        if ((taxResult as any).bracket) {
          emp.taxBracket = (taxResult as any).bracket as any;
        }
      } catch (err) {
        console.error('Error calculating tax for seeded employee', firstName, lastName, err);
      }

      employees.push(emp as any);
    }

    try {
      await this.employeeRepository.save(employees);
      console.log('✅ Seeded 50 employees');
    } catch (error) {
      console.error('❌ Error seeding employees:', error);
    }
  }
}
