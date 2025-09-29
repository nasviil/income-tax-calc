'use client';

import { useState, useEffect } from 'react';
import { 
  EmployeeTable, 
  TaxBracketsTable, 
  AddEmployeeModal, 
  EditEmployeeModal,
  TaxCalculatorModal 
} from '@/components';
import { employeeService, taxService } from '@/services/api';
import { Employee, TaxBracket, TaxResult, EmployeeFormData } from '@/types';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([]);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    loadEmployees();
    loadTaxBrackets();
  }, []);

  const loadEmployees = async () => {
    const data = await employeeService.getAll();
    setEmployees(data);
  };

  const loadTaxBrackets = async () => {
    const data = await taxService.getBrackets();
    setTaxBrackets(data);
  };

  const handleAddEmployee = async (employeeData: EmployeeFormData) => {
    await employeeService.create({
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      monthlySalary: parseFloat(employeeData.monthlySalary)
    });
    await loadEmployees();
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEditEmployeeModal(true);
  };

  const handleUpdateEmployee = async (employeeId: number, employeeData: EmployeeFormData) => {
    await employeeService.update(employeeId, {
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      monthlySalary: parseFloat(employeeData.monthlySalary)
    });
    await loadEmployees();
    setShowEditEmployeeModal(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    await employeeService.delete(employeeId);
    await loadEmployees();
  };

  const handleCalculateTax = async (employeeId: number): Promise<TaxResult> => {
    return await taxService.calculateTax(employeeId);
  };

  return (
    <main className="bg-white container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Philippine Income Tax Calculator
      </h1>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setShowAddEmployeeModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Add Employee
        </button>
        
        <button
          onClick={() => setShowCalculatorModal(true)}
          disabled={employees.length === 0}
          className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Calculate Tax
        </button>
      </div>

      {/* Components */}
      <EmployeeTable 
        employees={employees} 
        onDeleteEmployee={handleDeleteEmployee}
        onEditEmployee={handleEditEmployee}
      />
      
      <TaxBracketsTable taxBrackets={taxBrackets} />

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddEmployeeModal}
        onClose={() => setShowAddEmployeeModal(false)}
        onSubmit={handleAddEmployee}
      />

      <EditEmployeeModal
        isOpen={showEditEmployeeModal}
        onClose={() => setShowEditEmployeeModal(false)}
        onSubmit={handleUpdateEmployee}
        employee={editingEmployee}
      />

      <TaxCalculatorModal
        isOpen={showCalculatorModal}
        onClose={() => setShowCalculatorModal(false)}
        employees={employees}
        onCalculateTax={handleCalculateTax}
      />
    </main>
  );
}