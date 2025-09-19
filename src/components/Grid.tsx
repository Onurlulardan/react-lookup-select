import React from 'react';
import { ColumnDef, ValueMapper, SelectMode } from '../internal/types';

/**
 * Grid bileşeni - Basit tablo + kolon render
 * Project.md Faz 5: Satır seçimi (tıklama, checkbox), boş durum, yükleniyor, hata
 */

interface GridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  mode: SelectMode;
  mapper: ValueMapper<T>;
  selectedRows: T[];
  onRowToggle: (row: T) => void;
  onRowClick?: (row: T) => void;
  isRowSelected: (row: T) => boolean;
  selectableRow?: (row: T) => boolean;
  onSort?: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  currentSort?: { sortBy?: string; sortDir?: 'asc' | 'desc' };
  loading?: boolean;
  error?: string;
  emptyText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Grid<T>({
  data,
  columns,
  mode,
  mapper,
  selectedRows,
  onRowToggle,
  onRowClick,
  isRowSelected,
  selectableRow,
  onSort,
  currentSort,
  loading = false,
  error,
  emptyText = 'Kayıt bulunamadı',
  className,
  style,
}: GridProps<T>) {
  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    const currentSortBy = currentSort?.sortBy;
    const currentSortDir = currentSort?.sortDir;

    let newSortDir: 'asc' | 'desc' = 'asc';

    if (currentSortBy === columnKey) {
      // Same column - toggle direction
      newSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
    }

    onSort(columnKey, newSortDir);
  };

  const getSortIcon = (columnKey: string) => {
    if (currentSort?.sortBy !== columnKey) {
      return '↕'; // Both directions
    }

    return currentSort.sortDir === 'asc' ? '↑' : '↓';
  };

  // Loading state
  if (loading) {
    return (
      <div className="lookup-select__grid-state">
        <div className="lookup-select__loading">
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="lookup-select__grid-state">
        <div className="lookup-select__error">
          <p>Hata: {error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="lookup-select__grid-state">
        <div className="lookup-select__empty">
          <p>{emptyText}</p>
        </div>
      </div>
    );
  }

  const handleRowClick = (row: T, event: React.MouseEvent) => {
    // Checkbox tıklandığında row click'i tetikleme
    if ((event.target as HTMLElement).closest('.lookup-select__checkbox')) {
      return;
    }

    // Selectable kontrolü
    if (selectableRow && !selectableRow(row)) {
      return;
    }

    // Disabled row kontrolü
    if (mapper.getDisabled?.(row)) {
      return;
    }

    onRowClick?.(row);
    onRowToggle(row);
  };

  const handleCheckboxChange = (
    row: T,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();

    // Selectable kontrolü
    if (selectableRow && !selectableRow(row)) {
      return;
    }

    // Disabled row kontrolü
    if (mapper.getDisabled?.(row)) {
      return;
    }

    onRowToggle(row);
  };

  const isRowDisabled = (row: T) => {
    if (mapper.getDisabled?.(row)) return true;
    if (selectableRow && !selectableRow(row)) return true;
    return false;
  };

  return (
    <div className={`lookup-select__grid ${className || ''}`} style={style}>
      <table className="lookup-select__table">
        <thead className="lookup-select__table-head">
          <tr>
            {/* Checkbox column for multiple mode */}
            {mode === 'multiple' && (
              <th className="lookup-select__table-header lookup-select__table-header--checkbox">
                <div className="lookup-select__checkbox">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length > 0 &&
                      selectedRows.length ===
                        data.filter((row) => !isRowDisabled(row)).length
                    }
                    ref={(input) => {
                      if (input) {
                        input.indeterminate =
                          selectedRows.length > 0 &&
                          selectedRows.length <
                            data.filter((row) => !isRowDisabled(row)).length;
                      }
                    }}
                    onChange={(e) => {
                      const selectableRows = data.filter(
                        (row) => !isRowDisabled(row)
                      );
                      if (e.target.checked) {
                        // Select all selectable rows
                        selectableRows.forEach((row) => {
                          if (!isRowSelected(row)) {
                            onRowToggle(row);
                          }
                        });
                      } else {
                        // Deselect all
                        selectedRows.forEach((row) => {
                          onRowToggle(row);
                        });
                      }
                    }}
                    aria-label="Tümünü seç"
                  />
                </div>
              </th>
            )}

            {/* Column headers */}
            {columns.map((column, index) => (
              <th
                key={
                  typeof column.key === 'string'
                    ? column.key
                    : String(column.key)
                }
                className="lookup-select__table-header"
                style={{ width: column.width }}
              >
                <div className="lookup-select__table-header-content">
                  {column.title}
                  {column.sortable && (
                    <button
                      type="button"
                      className="lookup-select__sort-button"
                      aria-label={`${column.title} kolonuna göre sırala`}
                      onClick={() => handleSort(String(column.key))}
                    >
                      {getSortIcon(String(column.key))}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="lookup-select__table-body">
          {data.map((row, rowIndex) => {
            const rowId = mapper.getId(row);
            const selected = isRowSelected(row);
            const disabled = isRowDisabled(row);

            return (
              <tr
                key={rowId}
                className={`
                  lookup-select__table-row
                  ${selected ? 'lookup-select__table-row--selected' : ''}
                  ${disabled ? 'lookup-select__table-row--disabled' : ''}
                `}
                onClick={(e) => !disabled && handleRowClick(row, e)}
                role={disabled ? undefined : 'button'}
                tabIndex={disabled ? undefined : 0}
                onKeyDown={(e) => {
                  if (disabled) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRowToggle(row);
                  }
                }}
                aria-label={
                  disabled ? undefined : `${mapper.getText(row)} satırını seç`
                }
              >
                {/* Checkbox cell for multiple mode */}
                {mode === 'multiple' && (
                  <td className="lookup-select__table-cell lookup-select__table-cell--checkbox">
                    <div className="lookup-select__checkbox">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => handleCheckboxChange(row, e)}
                        disabled={disabled}
                        aria-label={`${mapper.getText(row)} seç`}
                      />
                    </div>
                  </td>
                )}

                {/* Data cells */}
                {columns.map((column, columnIndex) => {
                  const cellKey = `${rowId}-${typeof column.key === 'string' ? column.key : String(column.key)}`;
                  let cellContent;

                  if (column.render) {
                    cellContent = column.render(row, rowIndex);
                  } else {
                    const value = row[column.key as keyof T];
                    cellContent = value?.toString() || '';
                  }

                  return (
                    <td key={cellKey} className="lookup-select__table-cell">
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Loading Spinner component
 */
export function LoadingSpinner() {
  return (
    <div className="lookup-select__loading-spinner">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="12.566"
          strokeDashoffset="12.566"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="1.5s"
            values="0 12.566;6.283 6.283;0 12.566"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="1.5s"
            values="0;-6.283;-12.566"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
