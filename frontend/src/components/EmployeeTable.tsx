import { Employee } from '@/types';

interface EmployeeTableProps {
  employees: Employee[];
  onDeleteEmployee: (id: number) => void;
  onEditEmployee: (employee: Employee) => void;
}

export default function EmployeeTable({ employees, onDeleteEmployee, onEditEmployee }: EmployeeTableProps) {
  const handleDelete = (employeeId: number, employeeName: string) => {
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      onDeleteEmployee(employeeId);
    }
  };

  // Sort employees by ID in descending order (newest first, ID 1 at bottom)
  const sortedEmployees = [...employees].sort((a, b) => b.id - a.id);

  return (
    <div className="bg-white shadow-lg rounded-lg mb-8 overflow-hidden">
      <div className="bg-gray-200 px-6 py-4 border-b">
        <h2 className="text-2xl text-black font-semibold">Employees ({employees.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Name
              </th>
              <th className="px-12 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Monthly Salary
              </th>
              <th className="px-12 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Annual Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  <div className="text-lg">No employees found</div>
                  <div className="text-sm mt-1">Add your first employee to get started!</div>
                </td>
              </tr>
            ) : (
              sortedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </div>
                  </td>
                  <td className="px-12 py-4 whitespace-nowrap text-gray-700">
                    ₱{employee.monthlySalary.toLocaleString()}
                  </td>
                  <td className="px-12 py-4 whitespace-nowrap text-gray-700">
                    ₱{(employee.monthlySalary * 12).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-10">
                      <button
                        onClick={() => onEditEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id, `${employee.firstName} ${employee.lastName}`)}
                        className="text-red-600 hover:text-red-900 font-medium transition-colors"
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
    </div>
  );
}