'use client';

import React from 'react';
import Image from 'next/image';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/Button';
import Paragraph from '@/components/ui/Paragraph';
import { SubscriptionStatus, IsLoadMoreAvailable } from '@/lib/Utils';

// Inline Type Definitions
export interface ColumnConfig {
  uid: string;
  title: string;
  isHidden?: boolean;
}

interface StandardTableProps {
  name: 'reports' | 'trips' | 'employees';
  data: any[];
  columns: ColumnConfig[];
  companyInfo: any;
  isLoading?: boolean;
  children: React.ReactNode;
  loadMoreData?: () => void;
  onAddColumnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const StandardTable: React.FC<StandardTableProps> = ({
  name,
  data,
  columns,
  companyInfo,
  isLoading,
  children,
  loadMoreData,
  onAddColumnClick,
}) => {
  const hasData = data && data.length > 0;
  const isPremiumLocked = !SubscriptionStatus(companyInfo, 'standard').isFeatureAvailable && name === 'reports';

  if (!hasData && !isLoading) {
    return <EmptyTableFallback name={name} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-sm font-semibold select-none">
              {columns
                .filter((col) => !col.isHidden)
                .map((col) => (
                  <th key={col.uid} className="px-6 py-4 font-medium whitespace-nowrap">
                    {col.title}
                  </th>
                ))}
              {onAddColumnClick && name !== 'reports' && (
                <th className="px-6 py-4 w-[60px]">
                  <Button variant="ghost" onClick={onAddColumnClick} className="p-1 h-auto">
                    <Image src="/images/plus_200.png" width={14} height={14} alt="Add column" />
                  </Button>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 relative text-slate-700 text-sm">
            {isPremiumLocked && <PaywallOverlay />}
            {children}
          </tbody>
        </table>

        {name !== 'trips' && loadMoreData && IsLoadMoreAvailable(data.length) && (
          <div className="flex justify-center py-4 border-t border-slate-100 bg-slate-50/30">
            <Button variant="custom" onClick={loadMoreData} className="px-6 py-2 text-xs font-medium">
              Load more records
            </Button>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

const PaywallOverlay = () => (
  <tr className="absolute inset-x-0 bottom-0 top-12 z-10 bg-gradient-to-t from-slate-900/40 to-transparent backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
    <td className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl max-w-sm border border-slate-100">
      <Paragraph className="font-bold text-slate-900 mb-2">Need more trips in report history?</Paragraph>
      <Paragraph className="text-xs text-slate-500 mb-4">Unlock advanced cross-organizational trip data generation matrices.</Paragraph>
      <Button variant="default" className="w-full text-xs font-semibold py-2">Unlock Feature</Button>
    </td>
  </tr>
);

const EmptyTableFallback = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-slate-100 rounded-xl text-center">
    {name === 'trips' ? (
      <>
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <Image src="/images/Calendar2.png" width={56} height={56} alt="Calendar setup" className="opacity-80"/>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Schedule a trip</h3>
        <p className="text-xs text-slate-500 max-w-xs">Save manual management overhead cycles by pre-scheduling trip arrays ahead of operations.</p>
      </>
    ) : (
      <Paragraph className="font-medium text-slate-400 text-sm">
        {name === 'reports' ? 'No reports generated for this timeframe.' : 'No data records listed.'}
      </Paragraph>
    )}
  </div>
);