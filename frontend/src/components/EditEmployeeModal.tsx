import { useState, useEffect } from 'react';
import { Employee, EmployeeFormData } from '@/types';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeId: number, employeeData: EmployeeFormData) => Promise<void>;
  employee: Employee | null;
}

export default function EditEmployeeModal({ isOpen, onClose, onSubmit, employee }: EditEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    monthlySalary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        monthlySalary: employee.monthlySalary.toString()
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(employee.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form to original employee data
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        monthlySalary: employee.monthlySalary.toString()
      });
    }
    onClose();
  };

  if (!isOpen || !employee) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl text-black font-bold mb-4">Edit Employee</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
                placeholder="Enter first name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
                placeholder="Enter last name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Monthly Salary (PHP) *
              </label>
              <input
                type="number"
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                min="0"
                step="0.01"
                disabled={isSubmitting}
                placeholder="Enter monthly salary"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-shamrock-normal hover:bg-shamrock-normal-hover disabled:bg-shamrock-light text-white font-bold py-2 px-4 rounded transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Employee'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}