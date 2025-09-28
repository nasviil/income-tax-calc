import { TaxBracket } from '@/types';

interface TaxBracketsTableProps {
  taxBrackets: TaxBracket[];
}

export default function TaxBracketsTable({ taxBrackets }: TaxBracketsTableProps) {
  const formatIncome = (amount: number | null) => {
    if (amount === null) return '∞';
    return `₱${amount.toLocaleString()}`;
  };

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-2xl font-semibold">Philippine Income Tax Brackets</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bracket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Income Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Tax
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taxBrackets.map((bracket) => (
              <tr key={bracket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {bracket.bracketName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {formatIncome(bracket.minIncome)} - {formatIncome(bracket.maxIncome)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {formatRate(bracket.rate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  ₱{bracket.baseTax.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}