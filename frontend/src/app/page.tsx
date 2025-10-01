'use client';

import { useState, useEffect } from 'react';
import { 
  EmployeeTable, 
  TaxBracketsTable, 
  AddEmployeeModal, 
  EditEmployeeModal,
  TaxBracketsModal
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
  const [showTaxBracketsModal, setShowTaxBracketsModal] = useState(false);

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
    <main className="container min-h-screen p-8 mx-auto bg-white">
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">
        Philippine Income Tax Calculator
      </h1>
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setShowTaxBracketsModal(true)}
          className="px-6 py-3 font-bold text-white transition-colors rounded-lg bg-danube-normal hover:bg-danube-normal-hover"
        >
          Income Tax Info
        </button>
      </div>

      {/* Components */}
      <EmployeeTable 
        employees={employees} 
        onDeleteEmployee={handleDeleteEmployee}
        onEditEmployee={handleEditEmployee}
        onAddEmployee={() => setShowAddEmployeeModal(true)}
      />

      {/* Tax brackets modal */}
      <TaxBracketsModal
        isOpen={showTaxBracketsModal}
        onClose={() => setShowTaxBracketsModal(false)}
        taxBrackets={taxBrackets}
      />

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
    </main>
  );
}