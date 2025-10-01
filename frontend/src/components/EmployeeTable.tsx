import { Employee } from '@/types';
import { useState } from 'react';
import EmployeeDetailModal from './EmployeeDetailModal';

interface EmployeeTableProps {
  employees: Employee[];
  onDeleteEmployee: (id: number) => void;
  onEditEmployee: (employee: Employee) => void;
  onAddEmployee?: () => void;
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function EmployeeTable({ 
  employees, 
  onDeleteEmployee, 
  onEditEmployee, 
  onAddEmployee,
  currentPage,
  totalPages,
  totalEmployees,
  onPageChange,
  searchQuery,
  onSearchChange
}: EmployeeTableProps) {
  const [selected, setSelected] = useState<Employee | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const handleDelete = (employeeId: number, employeeName: string) => {
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      onDeleteEmployee(employeeId);
    }
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(Number(value))) return '-';
    const n = Number(value);
    const fixed = n.toFixed(2); // ensures two decimals
    const [intPart, decPart] = fixed.split('.');
    const intFormatted = Number(intPart).toLocaleString();
    if (decPart === '00') return intFormatted;
    return `${intFormatted}.${decPart}`;
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-lg max-w-full mx-20">
      <div className="min-w-full px-6 py-4 bg-gray-300 border-b rounded-t-xl">
        <h2 className="text-2xl font-semibold text-black">Employees ({totalEmployees})</h2>
      </div>
      
      {/* Search Bar and Add Button */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-200 border-b">
        <div className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search employees by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block min-w-md pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-shamrock-dark focus:border-shamrock-dark text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {onAddEmployee && (
          <button
            onClick={onAddEmployee}
            className="px-4 py-2 font-bold text-white transition-colors rounded-lg bg-shamrock-dark hover:bg-shamrock-dark-hover"
          >
            + Add Employee
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-12 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Name
              </th>
              <th className="py-3 px-12 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Monthly Salary
              </th>
              <th className="py-3 px-12 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Net Annual Salary
              </th>
              <th className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-2 py-8 text-center text-gray-500">
                  <div className="text-lg">
                    {searchQuery ? `No employees found matching "${searchQuery}"` : 'No employees found'}
                  </div>
                  <div className="mt-1 text-sm">
                    {searchQuery ? 'Try a different search term or clear the search to see all employees' : 'Add your first employee to get started!'}
                  </div>
                </td>
              </tr>
            ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="py-4 px-12 text-left whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </td>
                    <td className=" py-4 px-12 text-left text-gray-700 whitespace-nowrap">
                      ₱{formatNumber(employee.monthlySalary)}
                    </td>
                    <td className="py-4 px-12 text-left text-gray-700 whitespace-nowrap">
                      ₱{formatNumber(
                        employee.netAnnualSalary ?? (Number(employee.monthlySalary) * 12 - (employee.annualTax ?? 0))
                      )}
                    </td>
                    <td className="py-4 px-2 text-left whitespace-nowrap">
                      <div className="flex gap-4">
                        <button
                          onClick={() => { setSelected(employee); setDetailOpen(true); }}
                          className="p-1 px-3 font-semibold text-white transition-colors rounded-sm bg-danube-normal hover:bg-danube-normal-hover"
                        >
                          Show
                        </button>
                        <button
                          onClick={() => onEditEmployee(employee)}
                          className="p-1 px-3 font-semibold text-white transition-colors rounded-sm bg-shamrock-normal hover:bg-shamrock-normal-hover"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id, `${employee.firstName} ${employee.lastName}`)}
                          className="p-1 px-3 font-semibold text-white transition-colors rounded-sm bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between min-w-full py-4 px-8">
        <div className="text-sm text-gray-600">
          Showing {employees.length > 0 ? ((currentPage - 1) * 15 + 1) : 0} - {Math.min(totalEmployees, currentPage * 15)} of {totalEmployees}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50 hover:bg-gray-400 disabled:hover:bg-gray-300"
          >
            Prev
          </button>
          <div className="text-sm">Page {currentPage} / {Math.max(1, totalPages)}</div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50 hover:bg-gray-400 disabled:hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
      <EmployeeDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} employee={selected} />
    </div>
  );
}