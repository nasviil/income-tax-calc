import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { TaxBracket } from '../entities/tax-bracket.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { PaginationDTO } from '../dto/pagination-query.dto';

@Controller('employees')
export class EmployeeController {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(TaxBracket)
    private taxBracketRepository: Repository<TaxBracket>,
  ) {}

  @Get()
  async findAll(@Query() pagination: PaginationDTO): Promise<{
    data: Employee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    
    // Set default values
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 15;
    const search = pagination.search?.trim();
    
    // Calculate offset
    const skip = (page - 1) * limit;
    
    // Build query with search functionality
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee')
      .leftJoinAndSelect('employee.taxBracket', 'taxBracket')
      .orderBy('employee.id', 'DESC');
    
    // Add search functionality if search term is provided
    if (search) {
      queryBuilder.where(
        '(LOWER(employee.firstName) LIKE LOWER(:search) OR LOWER(employee.lastName) LIKE LOWER(:search) OR LOWER(CONCAT(employee.firstName, \' \', employee.lastName)) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }
    
    // Apply pagination
    queryBuilder.skip(skip).take(limit);
    
    // Get employees with pagination and total count
    const [employees, total] = await queryBuilder.getManyAndCount();
    
    const totalPages = Math.ceil(total / limit);
    
    console.log('📋 Found employees:', {
      count: employees.length,
      total,
      page,
      limit,
      totalPages,
      search: search || 'none'
    });
    
    return {
      data: employees,
      total,
      page,
      limit,
      totalPages
    };
  }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      console.log('👤 Creating new employee:', createEmployeeDto);
      console.log('👤 Monthly salary type:', typeof createEmployeeDto.monthlySalary);
      
      // Validate required fields
      if (!createEmployeeDto.firstName || !createEmployeeDto.lastName) {
        throw new BadRequestException('First name and last name are required');
      }
      
      // Ensure monthlySalary is a number
      const monthly = Number(createEmployeeDto.monthlySalary) || 0;
      if (monthly <= 0) {
        throw new BadRequestException('Monthly salary must be greater than 0');
      }
      
      const annualSalary = +(monthly * 12).toFixed(2);

      // Fetch tax brackets sorted by minIncome asc
      const brackets = await this.taxBracketRepository.find({ order: { minIncome: 'ASC' } });
      const annualTax = +(this.calculateTax(annualSalary, brackets)).toFixed(2);
      const netAnnualSalary = +(annualSalary - annualTax).toFixed(2);

      // Find the appropriate tax bracket for this salary
      const taxBracket = this.findTaxBracket(annualSalary, brackets);

      const employee = this.employeeRepository.create({
        ...createEmployeeDto,
        monthlySalary: monthly,
        annualSalary,
        annualTax,
        netAnnualSalary,
        ...(taxBracket && { taxBracket }),
      });

      const savedEmployee = await this.employeeRepository.save(employee);

      console.log('✅ Employee created with tax:', savedEmployee);
      return savedEmployee;
    } catch (error) {
      console.error('❌ Error creating employee:', error);
      throw error;
    }
  }

  /**
   * Calculate annual tax using tax brackets.
   * Bracket shape: { minIncome, maxIncome (nullable), rate, baseTax }
   */
  private calculateTax(annualSalary: number, brackets: TaxBracket[]): number {
    if (!brackets || brackets.length === 0) return 0;

    // Find the bracket using the existing method
    const bracket = this.findTaxBracket(annualSalary, brackets);
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

  /**
   * Find the appropriate tax bracket for a given annual salary.
   */
  private findTaxBracket(annualSalary: number, brackets: TaxBracket[]): TaxBracket | null {
    if (!brackets || brackets.length === 0) return null;

    // Find the bracket where salary falls into
    const bracket = brackets.find(b => {
      const min = Number(b.minIncome);
      const max = b.maxIncome === null ? Infinity : Number(b.maxIncome);
      return annualSalary >= min && annualSalary <= max;
    });

    return bracket || null;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    try {
      console.log('✏️ Updating employee with ID:', id);
      console.log('✏️ Update data:', updateEmployeeDto);
      
      const employee = await this.employeeRepository.findOne({ where: { id: +id } });
      if (!employee) {
        console.log('❌ Employee not found for update');
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Update provided fields
      Object.assign(employee, updateEmployeeDto);
      
      // If monthly salary was updated, recalculate tax
      if (updateEmployeeDto.monthlySalary !== undefined) {
        const monthly = Number(updateEmployeeDto.monthlySalary) || 0;
        if (monthly <= 0) {
          throw new BadRequestException('Monthly salary must be greater than 0');
        }
        
        const annualSalary = +(monthly * 12).toFixed(2);
        
        // Fetch tax brackets and recalculate
        const brackets = await this.taxBracketRepository.find({ order: { minIncome: 'ASC' } });
        const annualTax = +(this.calculateTax(annualSalary, brackets)).toFixed(2);
        const netAnnualSalary = +(annualSalary - annualTax).toFixed(2);
        
        // Find and assign the appropriate tax bracket
        const taxBracket = this.findTaxBracket(annualSalary, brackets);
        
        employee.monthlySalary = monthly;
        employee.annualSalary = annualSalary;
        employee.annualTax = annualTax;
        employee.netAnnualSalary = netAnnualSalary;
        employee.taxBracket = taxBracket || undefined;
      }
      
      const updatedEmployee = await this.employeeRepository.save(employee);
      console.log('✅ Employee updated successfully:', updatedEmployee);
      return updatedEmployee;
    } catch (error) {
      console.error('❌ Error updating employee:', error);
      throw error;
    }
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