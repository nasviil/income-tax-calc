import { Employee, TaxBracket, TaxResult, EmployeeFormData } from '@/types';

const API_BASE_URL = 'http://localhost:3000';

export const employeeService = {
  async getAll(page: number = 1, limit: number = 15, search?: string): Promise<{ 
    data: Employee[]; 
    total: number; 
    page: number; 
    limit: number; 
    totalPages: number; 
  }> {
    try {
      let url = `${API_BASE_URL}/employees?page=${page}&limit=${limit}`;
      if (search && search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      console.log('📡 Fetching employees from:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const result = await response.json();
      console.log('📥 API Response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { data: [], total: 0, page: 1, limit: 15, totalPages: 0 };
    }
  },

  async create(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      console.log('📤 Creating employee:', employeeData);
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Create error response:', errorData);
        throw new Error(`Failed to create employee: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Employee created:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in create:', error);
      throw error;
    }
  },

  async update(id: number, employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      console.log('📤 Updating employee:', id, employeeData);
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Update error response:', errorData);
        throw new Error(`Failed to update employee: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Employee updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in update:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete employee');
  },

  async saveTaxResult(id: number, data: { annualSalary?: number; annualTax?: number; netAnnualSalary?: number }): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}/tax-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save tax result');
    return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/calculate-tax/${employeeId}`);
      if (!response.ok) throw new Error('Failed to calculate tax');
      return await response.json();
    } catch (error) {
      console.warn('Backend not available, providing fallback tax calculation:', error);
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