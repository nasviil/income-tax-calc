import { useState } from 'react';
import { Employee, TaxResult } from '@/types';

interface TaxCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onCalculateTax: (employeeId: number) => Promise<TaxResult>;
}

export default function TaxCalculatorModal({ 
  isOpen, 
  onClose, 
  employees, 
  onCalculateTax 
}: TaxCalculatorModalProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!selectedEmployeeId) return;
    
    setIsCalculating(true);
    try {
      const result = await onCalculateTax(parseInt(selectedEmployeeId));
      setTaxResult(result);
    } catch (error) {
      console.error('Error calculating tax:', error);
      alert('Failed to calculate tax. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClose = () => {
    setSelectedEmployeeId('');
    setTaxResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Tax Calculator</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isCalculating}
            >
              <option value="">Choose an employee...</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - ₱{employee.monthlySalary.toLocaleString()}/month
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleCalculate}
            disabled={!selectedEmployeeId || isCalculating}
            className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-6 transition-colors"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Tax'}
          </button>

          {taxResult && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Tax Calculation Result</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Annual Salary</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    ₱{taxResult.annualSalary.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800">Annual Tax</h4>
                  <p className="text-2xl font-bold text-red-600">
                    ₱{taxResult.annualTax.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800">Monthly Tax</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    ₱{taxResult.monthlyTax.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Net Monthly Salary</h4>
                  <p className="text-2xl font-bold text-green-600">
                    ₱{taxResult.netMonthlySalary.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Tax Bracket:</strong> {taxResult.taxBracket}</p>
                <p><strong>Taxable Income:</strong> ₱{taxResult.taxableIncome.toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleClose}
              disabled={isCalculating}
              className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}