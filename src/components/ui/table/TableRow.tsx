// src/components/ui/table/TableRow.tsx
'use client';

import React from 'react';
import { useDrag } from 'react-dnd';
import { GetData } from '@/components/old/ListItem_A';
import { ColumnConfig } from './StandardTable';
// Import your modular cell library
import { ProfileCell, PhoneCell, CurrencyCell, DefaultTextCell } from './TableCells';

// 🔑 THE REGISTRY: Maps your backend configuration metadata strings to a React UI Component
const CELL_COMPONENTS: Record<string, React.FC<{ value: any; rowData: any }>> = {
  user: ProfileCell,
  phone: PhoneCell,
  currency: CurrencyCell,
  text: DefaultTextCell,
};

interface TableRowProps {
  index: number;
  name: 'reports' | 'trips' | 'employees' | 'clients' | 'history';
  item: any;
  headerTitles: ColumnConfig[];
  allUsers?: any;
  allClients?: any;
  allEmployees?: any;
  onPress: (index: number, selectedData: any) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  index,
  name,
  item,
  headerTitles,
  allUsers,
  allClients,
  allEmployees,
  onPress,
}) => {
  const data = GetData(name, item, headerTitles, allUsers || allClients, allEmployees);
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'Cell',
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <tr ref={dragRef as unknown as React.RefObject<HTMLTableRowElement>} style={{ opacity: isDragging ? 0.5 : 1 }} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
      {headerTitles.filter(header => !header.isHidden).map((header) => {
        const cellKey = name !== 'reports' || (header as any).type !== 'ref' 
          ? header.uid 
          : (header as any).options?.ref[0]?.value;

        const cellValue = data[cellKey];

        // 🌟 FACTORY RESOLUTION ENGINE
        // Safely determine what type of cell layout this column config dictates (e.g. header.type = 'phone')
        const columnType = (header as any).type || 'text';
        const CellComponent = CELL_COMPONENTS[columnType] || CELL_COMPONENTS.text;

        return (
          <td key={cellKey} className="px-6 py-4 whitespace-nowrap align-middle">
            {/* The structural row doesn't contain layout logic anymore. It just mounts the resolved cell wrapper */}
            <CellComponent value={cellValue} rowData={item} />
          </td>
        );
      })}
    </tr>
  );
};