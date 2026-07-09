// /src/components/ui/data-table.tsx
'use client';

import { ReactNode, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import Spinner from '@/src/components/ui/spinner';
import { Button } from '@/src/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  hidden?: 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  cellClassName?: string;
  headerClassName?: string;
  render: (row: T, index: number) => ReactNode;
}

export interface DataTableActions {
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  actions?: DataTableActions;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  error = null,
  emptyMessage = 'Aucune donnée disponible',
  actions,
  onView,
  onEdit,
  onDelete,
  onRowDoubleClick,
}: DataTableProps<T>) {
  const hasActions = actions && (actions.canView || actions.canEdit || actions.canDelete);
  const hasAnyActionHandler = onView || onEdit || onDelete;

  // En mobile : pas de colonne actions, mais double-clic possible
  // En desktop : colonne actions visible
  const colCount = columns.length + (hasActions ? 1 : 0);

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const getHiddenClass = (hidden?: 'md' | 'lg') => {
    if (hidden === 'lg') return 'hidden lg:table-cell';
    if (hidden === 'md') return 'hidden md:table-cell';
    return '';
  };

  const handleDoubleClick = useCallback(
    (row: T) => {
      if (onRowDoubleClick) {
        onRowDoubleClick(row);
      }
    },
    [onRowDoubleClick]
  );

  return (
    <div className="bento-card bg-white border border-outline-variant overflow-hidden">
      <Table className="no-scrollbar">
        <TableHeader className="bg-surface-container-low">
          <TableRow className="bg-[#F9F9FA]">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`text-xs uppercase font-semibold text-slate-700 ${getAlignClass(col.align)} ${getHiddenClass(col.hidden)} ${col.headerClassName || ''}`}
              >
                {col.header}
              </TableHead>
            ))}
            {/* Colonne actions : visible uniquement sur desktop (sm et plus) */}
            {hasActions && (
              <TableHead className="hidden sm:table-cell text-xs uppercase font-semibold text-slate-700 text-right" />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={colCount} className="text-center py-10">
                <Spinner />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={colCount} className="text-center py-10">
                <span className="text-center font-mono text-red-600">
                  {error}
                </span>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colCount}
                className="text-center py-10 text-slate-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id}
                className={`group hover:bg-surface-container-low/50 ${hasAnyActionHandler ? 'cursor-pointer sm:cursor-default' : ''}`}
                onDoubleClick={() => handleDoubleClick(row)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${row.id}-${col.key}`}
                    className={`${getAlignClass(col.align)} ${getHiddenClass(col.hidden)} ${col.cellClassName || ''}`}
                  >
                    {col.render(row, index)}
                  </TableCell>
                ))}
                {/* Cellule actions : visible uniquement sur desktop */}
                {hasActions && (
                  <TableCell className="hidden sm:table-cell text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {actions?.canView && onView && (
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className="cursor-pointer px-2 text-slate-400 hover:text-[rgb(25,119,119)]"
                        >
                          <Eye size={40} />
                        </Button>
                      )}
                      {actions?.canEdit && onEdit && (
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="cursor-pointer px-2 text-slate-400 hover:text-[rgb(40,185,180)]"
                        >
                          <Pencil size={40} />
                        </Button>
                      )}
                      {actions?.canDelete && onDelete && (
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="cursor-pointer px-2 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={40} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}