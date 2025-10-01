import { Employee } from '@/types';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '-';
  const n = Number(value);
  const fixed = n.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const intFormatted = Number(intPart).toLocaleString();
  if (decPart === '00') return intFormatted;
  return `${intFormatted}.${decPart}`;
};

export default function EmployeeDetailModal({ isOpen, onClose, employee }: EmployeeDetailModalProps) {

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
          </div>

          <div className="m-4">
            <h3 className="text-lg font-semibold">Employee Info</h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">First Name</p>
                <p className="font-medium">{employee.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Name</p>
                <p className="font-medium">{employee.lastName}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl text-neutral-800 font-bold mb-4">Tax Calculation Result</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Monthly Salary</h4>
                <p className="text-2xl font-bold text-blue-600">₱{formatNumber(employee.monthlySalary)}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800">Annual Salary</h4>
                <p className="text-2xl font-bold text-purple-600">₱{formatNumber(employee.annualSalary ?? Number(employee.monthlySalary) * 12)}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800">Annual Tax</h4>
                <p className="text-2xl font-bold text-red-600">₱{formatNumber(employee.annualTax ?? 0)}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Net Annual Salary</h4>
                <p className="text-2xl font-bold text-green-600">₱{formatNumber(employee.netAnnualSalary ?? (Number(employee.monthlySalary) * 12 - (employee.annualTax ?? 0)))}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-black"><strong className="text-gray-800 font-medium">Tax Bracket:</strong> {employee.taxBracket?.bracketName ?? 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
