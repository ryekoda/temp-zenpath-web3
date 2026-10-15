// src/components/ui/table/TableCells.tsx
import React from 'react';
import { CapitalizeFirstLetter } from '@/lib/Utils';

interface BaseCellProps {
  value: any;
  rowData?: any;
}

// 👤 Cell Variant 1: User Profile Cards (Old 34057 logic)
export const ProfileCell: React.FC<BaseCellProps> = ({ value, rowData }) => {
  if (!value) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 bg-[#D93F67] rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase flex-shrink-0">
        {CapitalizeFirstLetter(rowData?.fName?.charAt(0) || '')}
        {CapitalizeFirstLetter(rowData?.lName?.charAt(0) || '')}
      </div>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
};

// 📱 Cell Variant 2: Phone Numbers with Country Flags
export const PhoneCell: React.FC<BaseCellProps> = ({ value }) => {
  if (!value) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-3.5 relative flex-shrink-0 border border-slate-100">
        <img src="/images/usFlag.png" alt="US" className="w-full h-full object-cover rounded-sm" />
      </div>
      <span className="text-slate-600 tabular-nums">{value}</span>
    </div>
  );
};

// 💰 Cell Variant 3: Financial Currency Cells
export const CurrencyCell: React.FC<BaseCellProps> = ({ value }) => {
  const amount = parseFloat(value) || 0;
  return <span className="font-semibold text-slate-900 tabular-nums">${amount.toFixed(2)}</span>;
};

// 🏷️ Cell Variant 4: Standard Fallback Strings
export const DefaultTextCell: React.FC<BaseCellProps> = ({ value }) => (
  <span className="text-slate-600 font-normal">{value || '—'}</span>
);