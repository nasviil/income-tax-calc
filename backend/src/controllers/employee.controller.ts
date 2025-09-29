import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
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
    
    const employee = this.employeeRepository.create(createEmployeeDto);
    const savedEmployee = await this.employeeRepository.save(employee);
    
    console.log('✅ Employee created:', savedEmployee);
    return savedEmployee;
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
}