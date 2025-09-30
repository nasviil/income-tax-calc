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
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 bg-gray-200 border-b">
        <h2 className="text-2xl font-semibold text-black">Philippine Income Tax Brackets</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-black bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Bracket
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Income Range
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Tax Rate
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Base Tax
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taxBrackets.map((bracket) => (
              <tr key={bracket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {bracket.bracketName}
                </td>
                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                  {formatIncome(bracket.minIncome)} - {formatIncome(bracket.maxIncome)}
                </td>
                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                  {formatRate(bracket.rate)}
                </td>
                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
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