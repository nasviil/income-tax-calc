import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { TaxBracket } from '../entities/tax-bracket.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(TaxBracket)
    private taxBracketRepository: Repository<TaxBracket>,
  ) {}

  @Get()
  async findAll(): Promise<Employee[]> {
    console.log('📋 Fetching all employees...');
    const employees = await this.employeeRepository.find({
      order: { id: 'ASC' }
    });
    console.log('📋 Found employees:', employees.length);
    console.log('📋 Employee details:', employees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      monthlySalary: emp.monthlySalary,
      salaryType: typeof emp.monthlySalary
    })));
    return employees;
  }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    console.log('👤 Creating new employee:', createEmployeeDto);
    console.log('👤 Monthly salary type:', typeof createEmployeeDto.monthlySalary);
    // Ensure monthlySalary is a number
    const monthly = Number(createEmployeeDto.monthlySalary) || 0;
    const annualSalary = +(monthly * 12).toFixed(2);

    // Fetch tax brackets sorted by minIncome asc
    const brackets = await this.taxBracketRepository.find({ order: { minIncome: 'ASC' } });
    const annualTax = +(this.calculateTax(annualSalary, brackets)).toFixed(2);
    const netAnnualSalary = +(annualSalary - annualTax).toFixed(2);

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      monthlySalary: monthly,
      annualSalary,
      annualTax,
      netAnnualSalary,
    });

    const savedEmployee = await this.employeeRepository.save(employee);

    console.log('✅ Employee created with tax:', savedEmployee);
    return savedEmployee;
  }

  /**
   * Calculate annual tax using tax brackets.
   * Bracket shape: { minIncome, maxIncome (nullable), rate, baseTax }
   */
  private calculateTax(annualSalary: number, brackets: TaxBracket[]): number {
    if (!brackets || brackets.length === 0) return 0;

    // find the bracket where salary falls into
    const bracket = brackets.find(b => {
      const min = Number(b.minIncome);
      const max = b.maxIncome === null ? Infinity : Number(b.maxIncome);
      return annualSalary >= min && annualSalary <= max;
    });

    if (!bracket) return 0;

    const minIncome = Number(bracket.minIncome);
    const baseTax = Number(bracket.baseTax) || 0;
    const rate = Number(bracket.rate) || 0;

    // Adjustment: the bracket's minIncome is represented as e.g. 250001
    // meaning the taxable excess should be computed over 250000.
    const excessBase = minIncome - 1;
    const excess = Math.max(0, annualSalary - excessBase);
    return baseTax + rate * excess;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    console.log('✏️ Updating employee with ID:', id);
    console.log('✏️ Update data:', updateEmployeeDto);
    
    const employee = await this.employeeRepository.findOne({ where: { id: +id } });
    if (!employee) {
      console.log('❌ Employee not found for update');
      throw new Error('Employee not found');
    }

    // Update only provided fields
    Object.assign(employee, updateEmployeeDto);
    
    const updatedEmployee = await this.employeeRepository.save(employee);
    console.log('✅ Employee updated successfully:', updatedEmployee);
    return updatedEmployee;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    console.log('🗑️ Deleting employee with ID:', id);
    const result = await this.employeeRepository.delete(+id);
    if (result.affected === 0) {
      console.log('❌ Employee not found for deletion');
      throw new Error('Employee not found');
    }
    console.log('✅ Employee deleted successfully');
    return { message: 'Employee deleted successfully' };
  }

  @Post(':id/tax-result')
  async setTaxResult(
    @Param('id') id: string,
    @Body() payload: { annualSalary?: number; annualTax?: number; netAnnualSalary?: number },
  ): Promise<Employee> {
    console.log('💾 Setting tax result for employee', id, payload);
    const employee = await this.employeeRepository.findOne({ where: { id: +id } });
    if (!employee) {
      console.log('❌ Employee not found for tax result');
      throw new Error('Employee not found');
    }

    // Update only provided tax fields
    if (payload.annualSalary !== undefined) employee.annualSalary = payload.annualSalary;
    if (payload.annualTax !== undefined) employee.annualTax = payload.annualTax;
    if (payload.netAnnualSalary !== undefined) employee.netAnnualSalary = payload.netAnnualSalary;

    const updated = await this.employeeRepository.save(employee);
    console.log('✅ Tax result saved:', updated);
    return updated;
  }
}