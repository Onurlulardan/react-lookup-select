import React from 'react';
import {
  ColumnDef,
  ValueMapper,
  SelectMode,
  VirtualizationConfig,
} from '../internal/types';

interface VirtualGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  mode: SelectMode;
  mapper: ValueMapper<T>;
  selectedRows: T[];
  onRowToggle: (row: T) => void;
  isRowSelected: (row: T) => boolean;
  selectableRow?: (row: T) => boolean;
  loading?: boolean;
  error?: string;
  emptyText?: string;
  className?: string;
  style?: React.CSSProperties;
  currentSort?: { sortBy?: string; sortDir?: 'asc' | 'desc' };
  onSort?: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  virtualization: VirtualizationConfig;
}

interface VirtualItem<T> {
  index: number;
  row: T;
  style: React.CSSProperties;
}

export function VirtualGrid<T = any>(props: VirtualGridProps<T>) {
  const {
    data,
    columns,
    mode,
    mapper,
    selectedRows,
    onRowToggle,
    isRowSelected,
    selectableRow,
    loading,
    error,
    emptyText,
    className,
    style,
    currentSort,
    onSort,
    virtualization,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [actualContainerHeight, setActualContainerHeight] = React.useState(
    virtualization.containerHeight
  );

  // Update actual container height when container is available
  React.useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        if (containerRef.current) {
          setActualContainerHeight(containerRef.current.clientHeight);
        }
      };

      updateHeight();

      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  // Handle header checkbox indeterminate state
  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      const hasSelected = selectedRows.length > 0;
      const hasUnselected = selectedRows.length < data.length;
      headerCheckboxRef.current.indeterminate = hasSelected && hasUnselected;
    }
  }, [selectedRows.length, data.length]);

  // Calculate visible range
  const itemCount = data.length;
  const { rowHeight, overscan } = virtualization;

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + actualContainerHeight) / rowHeight) + overscan
  );

  const visibleItems: VirtualItem<T>[] = React.useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        row: data[i],
        style: {
          position: 'absolute' as const,
          top: i * rowHeight,
          left: 0,
          right: 0,
          height: rowHeight,
        },
      });
    }
    return items;
  }, [startIndex, endIndex, data, rowHeight]);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = itemCount * rowHeight;

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

  const handleSort = (columnKey: string) => {
    if (onSort) {
      const newSortDir =
        currentSort?.sortBy === columnKey && currentSort.sortDir === 'asc'
          ? 'desc'
          : 'asc';
      onSort(columnKey, newSortDir);
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (currentSort?.sortBy !== columnKey) {
      return '↕'; // Both directions
    }
    return currentSort.sortDir === 'asc' ? '↑' : '↓';
  };

  const handleCheckboxChange = (
    row: T,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    onRowToggle(row);
  };

  const handleRowClick = (row: T) => {
    if (mode === 'single') {
      onRowToggle(row);
    }
  };

  return (
    <div
      className={`lookup-select__virtual-grid ${className || ''}`}
      style={style}
    >
      {/* Header */}
      <div className="lookup-select__grid-header">
        <table className="lookup-select__table">
          <thead>
            <tr>
              {mode === 'multiple' && (
                <th className="lookup-select__header-cell lookup-select__header-cell--checkbox">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    className="lookup-select__checkbox"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Select all visible items
                        data.forEach((row) => {
                          if (
                            !isRowSelected(row) &&
                            (!selectableRow || selectableRow(row))
                          ) {
                            onRowToggle(row);
                          }
                        });
                      } else {
                        // Deselect all
                        selectedRows.forEach((row) => onRowToggle(row));
                      }
                    }}
                    aria-label="Tümünü seç"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`lookup-select__header-cell ${column.sortable ? 'lookup-select__header-cell--sortable' : ''}`}
                  style={{ width: column.width }}
                >
                  <div className="lookup-select__header-content">
                    <span>{column.title}</span>
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
        </table>
      </div>

      {/* Virtual Scrollable Body */}
      <div
        ref={containerRef}
        className="lookup-select__virtual-container"
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
        }}
        onScroll={handleScroll}
      >
        <div
          className="lookup-select__virtual-content"
          style={{
            height: totalHeight,
            position: 'relative',
          }}
        >
          {visibleItems.map((item) => (
            <VirtualRow<T>
              key={item.index}
              item={item}
              columns={columns}
              mode={mode}
              mapper={mapper}
              isSelected={isRowSelected(item.row)}
              isSelectable={!selectableRow || selectableRow(item.row)}
              onToggle={() => onRowToggle(item.row)}
              onCheckboxChange={(e) => handleCheckboxChange(item.row, e)}
              onClick={() => handleRowClick(item.row)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Memoized Virtual Row Component
function VirtualRowComponent<T>({
  item,
  columns,
  mode,
  mapper,
  isSelected,
  isSelectable,
  onToggle,
  onCheckboxChange,
  onClick,
}: {
  item: VirtualItem<T>;
  columns: ColumnDef<T>[];
  mode: SelectMode;
  mapper: ValueMapper<T>;
  isSelected: boolean;
  isSelectable: boolean;
  onToggle: () => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}) {
  const { row, style } = item;

  return (
    <div
      className={`lookup-select__virtual-row ${isSelected ? 'lookup-select__row--selected' : ''} ${!isSelectable ? 'lookup-select__row--disabled' : ''}`}
      style={style}
      onClick={isSelectable ? onClick : undefined}
    >
      <table className="lookup-select__table">
        <tbody>
          <tr>
            {mode === 'multiple' && (
              <td className="lookup-select__cell lookup-select__cell--checkbox">
                <input
                  type="checkbox"
                  className="lookup-select__checkbox"
                  checked={isSelected}
                  disabled={!isSelectable}
                  onChange={onCheckboxChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
            )}
            {columns.map((column) => (
              <td
                key={String(column.key)}
                className="lookup-select__cell"
                style={{ width: column.width }}
              >
                {column.render
                  ? column.render(row, item.index)
                  : String(row[column.key as keyof typeof row] || '')}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const VirtualRow = React.memo(
  VirtualRowComponent
) as typeof VirtualRowComponent;
