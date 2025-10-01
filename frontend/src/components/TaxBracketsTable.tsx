import { TaxBracket } from '@/types';

interface TaxBracketsTableProps {
  taxBrackets: TaxBracket[];
}

export default function TaxBracketsTable({ taxBrackets }: TaxBracketsTableProps) {
  const formatIncome = (amount: number | string | null) => {
    if (amount === null) return '∞';
    const n = Number(amount);
    if (!Number.isFinite(n)) return '∞';
    return `₱${n.toLocaleString('en-US')}`;
  };

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(0)}%`;
  };

  const formatRateWithExcess = (bracket: TaxBracket) => {
    const rateText = `${(bracket.rate * 100).toFixed(0)}%`;
    const start = Number(bracket.minIncome) - 1;
    if (start > 0) {
      // format start without decimals but with grouping commas
      return `${rateText} of the excess over ₱${start.toLocaleString('en-US')}`;
    }
    return rateText;
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-black bg-gray-200">
            <tr>
              <th className="px-12 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Bracket
              </th>
              <th className="px-12 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Income Range
              </th>
              <th className="px-12 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Tax Rate
              </th>
              <th className="px-12 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Base Tax
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taxBrackets.map((bracket) => (
              <tr key={bracket.id} className="hover:bg-gray-50">
                <td className="px-12 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {bracket.bracketName}
                </td>
                <td className="px-12 py-4 text-gray-700 whitespace-nowrap">
                  {formatIncome(bracket.minIncome)} - {formatIncome(bracket.maxIncome)}
                </td>
                <td className="px-12 py-4 text-gray-700 whitespace-nowrap">
                  {formatRateWithExcess(bracket)}
                </td>
                <td className="px-12 py-4 text-gray-700 whitespace-nowrap">
                  {formatIncome(bracket.baseTax)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}