import TaxBracketsTable from './TaxBracketsTable';
import { TaxBracket } from '@/types';

interface TaxBracketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxBrackets: TaxBracket[];
}

export default function TaxBracketsModal({ isOpen, onClose, taxBrackets }: TaxBracketsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Income Tax Brackets</h2>
          </div>

          <TaxBracketsTable taxBrackets={taxBrackets} />

          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
