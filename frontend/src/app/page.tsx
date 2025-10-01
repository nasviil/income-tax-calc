'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([]);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showTaxBracketsModal, setShowTaxBracketsModal] = useState(false);
  
  // Pagination state from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(15);

  // Fetch data on component mount
  useEffect(() => {
    loadEmployees();
    loadTaxBrackets();
  }, []);

  // Load employees when page changes
  useEffect(() => {
    loadEmployees(currentPage);
  }, [currentPage]);

  const loadEmployees = async (page: number = 1) => {
    console.log('🔄 Loading employees for page:', page, 'with pageSize:', pageSize);
    const result = await employeeService.getAll(page, pageSize);
    console.log('📊 Received pagination result:', result);
    setEmployees(result.data);
    setTotalEmployees(result.total);
    setTotalPages(result.totalPages);
  };

  const handlePageChange = (page: number) => {
    console.log('🔗 Changing to page:', page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const loadTaxBrackets = async () => {
    const data = await taxService.getBrackets();
    setTaxBrackets(data);
  };

  const handleAddEmployee = async (employeeData: EmployeeFormData) => {
    console.log('🎯 handleAddEmployee called with:', employeeData);
    const payload = {
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      monthlySalary: parseFloat(employeeData.monthlySalary)
    };
    console.log('🎯 Creating employee with payload:', payload);
    await employeeService.create(payload);
    
    // If we're not on page 1, navigate there, otherwise just reload current data
    if (currentPage !== 1) {
      handlePageChange(1);
    } else {
      // We're already on page 1, just reload the employees
      await loadEmployees(1);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEditEmployeeModal(true);
  };

  const handleUpdateEmployee = async (employeeId: number, employeeData: EmployeeFormData) => {
    console.log('🎯 handleUpdateEmployee called with ID:', employeeId, 'data:', employeeData);
    const payload = {
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      monthlySalary: parseFloat(employeeData.monthlySalary)
    };
    console.log('🎯 Updating employee with payload:', payload);
    await employeeService.update(employeeId, payload);
    await loadEmployees(currentPage);
    setShowEditEmployeeModal(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    await employeeService.delete(employeeId);
    await loadEmployees(currentPage);
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
          className="px-6 py-3 font-bold text-white transition-colors rounded-lg bg-danube-dark hover:bg-danube-dark-hover"
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
        currentPage={currentPage}
        totalPages={totalPages}
        totalEmployees={totalEmployees}
        onPageChange={handlePageChange}
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