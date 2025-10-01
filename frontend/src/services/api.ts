import { Employee, TaxBracket, TaxResult, EmployeeFormData } from '@/types';

const API_BASE_URL = 'http://localhost:3000';

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      return []; // Return empty array for now
    }
  },

  async create(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    
    if (!response.ok) throw new Error('Failed to create employee');
    return await response.json();
  },

  async update(id: number, employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    
    if (!response.ok) throw new Error('Failed to update employee');
    return await response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete employee');
  },
};

export const taxService = {
  async getBrackets(): Promise<TaxBracket[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tax-brackets`);
      if (!response.ok) throw new Error('Failed to fetch tax brackets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tax brackets:', error);
      // Return Philippine tax brackets as fallback
      return [
        { id: 1, bracketName: 'Tax Exempt', minIncome: 0, maxIncome: 250000, rate: 0.00, baseTax: 0 },
        { id: 2, bracketName: '15% Bracket', minIncome: 250001, maxIncome: 400000, rate: 0.15, baseTax: 0 },
        { id: 3, bracketName: '20% Bracket', minIncome: 400001, maxIncome: 800000, rate: 0.20, baseTax: 22500 },
        { id: 4, bracketName: '25% Bracket', minIncome: 800001, maxIncome: 2000000, rate: 0.25, baseTax: 102500 },
        { id: 5, bracketName: '30% Bracket', minIncome: 2000001, maxIncome: 8000000, rate: 0.30, baseTax: 402500 },
        { id: 6, bracketName: '35% Bracket', minIncome: 8000001, maxIncome: null, rate: 0.35, baseTax: 2202500 },
      ];
    }
  },

  async calculateTax(employeeId: number): Promise<TaxResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/calculate-tax/${employeeId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to calculate tax');
      return await response.json();
    } catch (error) {
      console.warn('Backend not available, providing fallback tax calculation:', error);
      // Return a fallback calculation result
      return {
        monthlySalary: 0,
        annualSalary: 0,
        annualTax: 0,
        netAnnualSalary: 0,
        taxBracket: 'Tax Exempt'
      };
    }
  },
};