import { Employee } from '@/types';
import { useState } from 'react';
import EmployeeDetailModal from './EmployeeDetailModal';

interface EmployeeTableProps {
  employees: Employee[];
  onDeleteEmployee: (id: number) => void;
  onEditEmployee: (employee: Employee) => void;
  onAddEmployee?: () => void;
}

export default function EmployeeTable({ employees, onDeleteEmployee, onEditEmployee, onAddEmployee }: EmployeeTableProps) {
  const [selected, setSelected] = useState<Employee | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const handleDelete = (employeeId: number, employeeName: string) => {
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      onDeleteEmployee(employeeId);
    }
  };

  // Sort employees by ID in descending order (newest first, ID 1 at bottom)
  const sortedEmployees = [...employees].sort((a, b) => b.id - a.id);

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
      <div className="flex justify-between items-center px-6 py-4 bg-gray-200 border-b rounded-t-xl">
        <h2 className="text-2xl font-semibold text-black">Employees ({employees.length})</h2>
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
          <thead className="bg-gray-200">
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
                  <div className="text-lg">No employees found</div>
                  <div className="mt-1 text-sm">Add your first employee to get started!</div>
                </td>
              </tr>
            ) : (
                sortedEmployees.map((employee) => (
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
      <EmployeeDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} employee={selected} />
    </div>
  );
}