import { Employee } from '@/types';

interface EmployeeTableProps {
  employees: Employee[];
  onDeleteEmployee: (id: number) => void;
  onEditEmployee: (employee: Employee) => void;
  onAddEmployee?: () => void;
}

export default function EmployeeTable({ employees, onDeleteEmployee, onEditEmployee, onAddEmployee }: EmployeeTableProps) {
  const handleDelete = (employeeId: number, employeeName: string) => {
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      onDeleteEmployee(employeeId);
    }
  };

  // Sort employees by ID in descending order (newest first, ID 1 at bottom)
  const sortedEmployees = [...employees].sort((a, b) => b.id - a.id);

  return (
    <div className="mb-8 bg-white rounded-lg shadow-lg max-w-full mx-20">
      <div className="flex justify-between items-center px-6 py-4 bg-gray-200 border-b rounded-t-xl">
        <h2 className="text-2xl font-semibold text-black">Employees ({employees.length})</h2>
        {onAddEmployee && (
          <button
            onClick={onAddEmployee}
            className="px-4 py-2 font-bold text-white transition-colors rounded-lg bg-shamrock-normal hover:bg-shamrock-normal-hover"
          >
            + Add Employee
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Name
              </th>
              <th className="px-12 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Monthly Salary
              </th>
              <th className="px-12 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Annual Salary
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        {/* Scrollable rows container: approximately 5 rows -> adjust max-h as needed */}
        <div className="max-h-72 rounded-b-xl overflow-y-auto">
          <table className="min-w-full">
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  <div className="text-lg">No employees found</div>
                  <div className="mt-1 text-sm">Add your first employee to get started!</div>
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
                    <td className="px-12 py-4 text-gray-700 whitespace-nowrap">
                      ₱{employee.monthlySalary.toLocaleString()}
                    </td>
                    <td className="px-12 py-4 text-gray-700 whitespace-nowrap">
                      ₱{(employee.monthlySalary * 12).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-10">
                        <button
                          onClick={() => onEditEmployee(employee)}
                          className="font-medium text-blue-400 transition-colors hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id, `${employee.firstName} ${employee.lastName}`)}
                          className="font-medium text-red-400 transition-colors hover:text-red-600"
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
    </div>
  );
}