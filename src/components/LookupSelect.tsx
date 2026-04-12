import React from 'react';
import { LookupSelectProps } from '../internal/types';
import { useLookupSelectState } from '../internal/state';
import {
  useKeyboardNavigation,
  useFocusManagement,
  useScreenReaderAnnouncements,
} from '../hooks/useAccessibility';
import { Trigger } from './Trigger';
import { Modal, SearchInput, ModalFooter } from './Modal';
import { Grid } from './Grid';
import { VirtualGrid } from './VirtualGrid';
import { Pagination } from './Pagination';

/**
 * LookupSelect - Headless React lookup select component with modal and grid
 */
export function LookupSelect<T = any>(props: LookupSelectProps<T>) {
  const {
    columns,
    mapper,
    mode = 'single',
    data = [],
    dataSource,
    variant = 'default',
    size = 'medium',
    icon,
    renderTrigger,
    renderModal,
    renderGrid,
    renderFooter,
    renderSearch,
    renderPagination,
    modalTitle,
    classNames,
    styles,
    theme,
    i18n,
    pageSize = 20,
    selectableRow,
    virtualization = false,
    virtualRowHeight = 40,
    virtualOverscan = 5,
    virtualContainerHeight = 400,
    virtualThreshold = 100,
  } = props;

  // Headless state management
  const {
    modalOpen,
    openModal,
    currentSelections,
    toggleRowSelection,
    clearSelections,
    isRowSelected,
    updateQuery,
    getCurrentQuery,
    confirmSelection,
    cancelSelection,
  } = useLookupSelectState(props);

  // i18n defaults - comprehensive multilingual support
  const texts = {
    triggerPlaceholder: 'Please select',
    searchPlaceholder: 'Search...',
    confirmText: 'Apply',
    cancelText: 'Cancel',
    modalTitle: 'Select Record',
    emptyText: 'No records found',
    loadingText: 'Loading...',
    errorPrefix: 'Error:',
    selectedCount: (n: number) => `${n} selected`,
    clearText: 'Clear',
    selectAllLabel: 'Select all',
    selectRowLabel: (rowText: string) => `Select ${rowText} option`,
    sortColumnLabel: (columnTitle: string) => `Sort by ${columnTitle} column`,
    closeModalLabel: 'Close modal',
    paginationInfo: (current: number, total: number) =>
      `Page ${current} / ${total}`,
    totalRecords: (total: number) => `${total} records`,
    searchResults: (count: number) => `${count} results found`,
    ...i18n,
  };

  // Hybrid mode optimization: Increase page size for virtualization
  const optimizedPageSize = React.useMemo(() => {
    if (dataSource && virtualization) {
      // For hybrid mode, fetch larger chunks (5-10x virtual container capacity)
      const containerCapacity = Math.ceil(
        virtualContainerHeight / virtualRowHeight
      );
      return Math.max(pageSize, containerCapacity * 5); // 5x buffer for smooth scrolling
    }
    return pageSize;
  }, [
    dataSource,
    virtualization,
    virtualContainerHeight,
    virtualRowHeight,
    pageSize,
  ]);

  // Accessibility hooks
  useScreenReaderAnnouncements();

  useFocusManagement(modalOpen);

  useKeyboardNavigation({
    isModalOpen: modalOpen,
    onConfirm: confirmSelection,
    currentData: [],
    selectedRows: currentSelections,
    mode,
  });

  // Search state
  const [searchValue, setSearchValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  // Server-side data state
  const [serverData, setServerData] = React.useState<T[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortState, setSortState] = React.useState<{
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }>({});

  // Debounced search value for server-side data (prevents fetch on every keystroke)
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearchValue(value);

      if (dataSource) {
        // Debounce server-side search (300ms)
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          setDebouncedSearch(value);
          setCurrentPage(1);
          updateQuery({ search: value, page: 1 });
        }, 300);
      } else {
        // Client-side filtering: immediate
        updateQuery({ search: value, page: 1 });
      }
    },
    [updateQuery, dataSource]
  );

  // Cleanup debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Filtered data - client-side filtering if data provided
  const filteredData = React.useMemo(() => {
    if (!searchValue || dataSource) {
      return data;
    }

    return data.filter((item) => {
      // Search in all columns
      return columns.some((column) => {
        const cellValue = item[column.key as keyof T];
        return cellValue
          ?.toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
    });
  }, [data, searchValue, columns, dataSource]);

  // Data source - client vs server-side
  const currentData = dataSource ? serverData : filteredData;

  const loadServerData = React.useCallback(async () => {
    if (!dataSource) return;

    setLoading(true);
    setError(undefined);

    try {
      const query = {
        search: debouncedSearch,
        page: currentPage,
        pageSize: optimizedPageSize,
        sortBy: sortState.sortBy,
        sortDir: sortState.sortDir,
      };
      const result = await dataSource(query);

      setServerData(result.rows);
      setTotalCount(result.total);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error occurred while loading data'
      );
      setLoading(false);
    }
  }, [
    dataSource,
    debouncedSearch,
    currentPage,
    optimizedPageSize,
    sortState,
  ]);

  // Load data when modal opens or query changes
  React.useEffect(() => {
    if (dataSource && modalOpen) {
      loadServerData();
    }
  }, [dataSource, modalOpen, loadServerData]);

  // Page change handler
  const handlePageChange = React.useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      updateQuery({ page: newPage });
    },
    [updateQuery]
  );

  // Sort change handler
  const handleSortChange = React.useCallback(
    (sortBy: string, sortDir: 'asc' | 'desc') => {
      setSortState({ sortBy, sortDir });
      setCurrentPage(1);
      updateQuery({ sortBy, sortDir, page: 1 });
    },
    [updateQuery]
  );

  // Virtualization logic
  const shouldUseVirtualization = React.useMemo(() => {
    if (!virtualization) return false;
    // Auto-enable virtualization if data exceeds threshold
    return currentData.length >= virtualThreshold;
  }, [virtualization, currentData.length, virtualThreshold]);

  const virtualizationConfig = React.useMemo(
    () => ({
      enabled: shouldUseVirtualization,
      rowHeight: virtualRowHeight,
      overscan: virtualOverscan,
      containerHeight: virtualContainerHeight,
      threshold: virtualThreshold,
    }),
    [
      shouldUseVirtualization,
      virtualRowHeight,
      virtualOverscan,
      virtualContainerHeight,
      virtualThreshold,
    ]
  );

  // Grid component with current data - Performance optimized with useCallback
  const renderGridComponent = React.useCallback(() => {
    const commonGridProps = {
      data: currentData,
      columns,
      mode,
      mapper,
      selectedRows: currentSelections,
      onRowToggle: toggleRowSelection,
      isRowSelected,
      selectableRow,
      loading,
      error,
      emptyText: texts.emptyText,
      onRetry: dataSource ? loadServerData : undefined,
      className: classNames?.grid,
      style: styles?.grid,
      currentSort: dataSource
        ? {
            sortBy: sortState.sortBy || '',
            sortDir: sortState.sortDir || 'asc',
          }
        : undefined,
      onSort: dataSource ? handleSortChange : undefined,
    };

    if (shouldUseVirtualization) {
      return (
        <VirtualGrid
          {...commonGridProps}
          virtualization={virtualizationConfig}
        />
      );
    }

    return <Grid {...commonGridProps} />;
  }, [
    currentData,
    columns,
    mode,
    mapper,
    currentSelections,
    toggleRowSelection,
    isRowSelected,
    selectableRow,
    loading,
    error,
    texts.emptyText,
    classNames?.grid,
    styles?.grid,
    dataSource,
    getCurrentQuery,
    handleSortChange,
    shouldUseVirtualization,
    virtualizationConfig,
  ]);

  // Custom render prop helpers
  const renderModalContent = () => {
    // Default modal content
    const defaultContent = (
      <>
        {/* Search Input */}
        {renderSearch ? (
          renderSearch({
            value: searchValue,
            onChange: handleSearchChange,
            placeholder: texts.searchPlaceholder,
            loading,
            onClear: () => handleSearchChange(''),
          })
        ) : (
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={texts.searchPlaceholder}
          />
        )}

        <div className="lookup-select__modal-content">
          {renderGrid
            ? renderGrid({
                data: currentData,
                columns,
                selectedIds: currentSelections.map(mapper.getId),
                onRowSelect: toggleRowSelection,
                onSelectAll:
                  mode === 'multiple'
                    ? () => {
                        // Toggle all selectable rows
                        const selectableData = selectableRow
                          ? currentData.filter(selectableRow)
                          : currentData;
                        const allSelected = selectableData.every((row) =>
                          isRowSelected(row)
                        );
                        if (allSelected) {
                          clearSelections();
                        } else {
                          selectableData.forEach((row) => {
                            if (!isRowSelected(row)) {
                              toggleRowSelection(row);
                            }
                          });
                        }
                      }
                    : undefined,
                onClearAll: clearSelections,
                loading,
                error,
                mode,
                mapper,
                virtualization: shouldUseVirtualization
                  ? virtualizationConfig
                  : undefined,
                selectableRow,
                onSortChange: handleSortChange,
                sortBy: sortState.sortBy,
                sortDir: sortState.sortDir,
              })
            : renderGridComponent()}

          {/* Pagination - only for server-side data */}
          {dataSource && !renderPagination && (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={optimizedPageSize}
              onPageChange={handlePageChange}
              i18n={{
                previousPage: i18n?.previousPage,
                nextPage: i18n?.nextPage,
                pageLabel: i18n?.paginationInfo
                  ? (pageNum) => i18n.paginationInfo!(pageNum, Math.ceil(totalCount / optimizedPageSize))
                  : undefined,
              }}
            />
          )}

          {dataSource &&
            renderPagination &&
            renderPagination({
              currentPage,
              totalPages: Math.ceil(totalCount / optimizedPageSize),
              onPageChange: handlePageChange,
              pageSize: optimizedPageSize,
              onPageSizeChange: (_newSize) => {
                // Page size change logic can be added here
              },
              totalCount,
              loading,
            })}
        </div>

        {/* Footer */}
        {renderFooter ? (
          renderFooter({
            selectedCount: currentSelections.length,
            totalCount,
            onConfirm: confirmSelection,
            onCancel: cancelSelection,
            currentPage,
            totalPages: Math.ceil(totalCount / optimizedPageSize),
            onPageChange: handlePageChange,
            pageSize: optimizedPageSize,
            loading,
            mode,
          })
        ) : (
          <ModalFooter
            onConfirm={confirmSelection}
            onCancel={cancelSelection}
            confirmText={texts.confirmText}
            cancelText={texts.cancelText}
            selectedCount={currentSelections.length}
          />
        )}
      </>
    );

    return defaultContent;
  };

  // Generate theme class names
  const getThemeClasses = () => {
    const classes = ['lookup-select'];

    if (variant && variant !== 'default') {
      classes.push(`lookup-select--theme-${variant}`);
    }

    if (size && size !== 'medium') {
      classes.push(`lookup-select--size-${size}`);
    }

    if (classNames?.root) {
      classes.push(classNames.root);
    }

    return classes.join(' ');
  };

  // Generate inline theme styles
  const getThemeStyles = () => {
    const themeStyles: Record<string, string> = {};

    if (theme) {
      if (theme.colorPrimary)
        themeStyles['--lookup-select-color-primary'] = theme.colorPrimary;
      if (theme.colorBg)
        themeStyles['--lookup-select-color-bg'] = theme.colorBg;
      if (theme.colorText)
        themeStyles['--lookup-select-color-text'] = theme.colorText;
      if (theme.borderRadius)
        themeStyles['--lookup-select-border-radius'] =
          typeof theme.borderRadius === 'number'
            ? `${theme.borderRadius}px`
            : theme.borderRadius;
      if (theme.spacing)
        themeStyles['--lookup-select-spacing'] = `${theme.spacing}px`;
    }

    return { ...themeStyles, ...styles?.root } as React.CSSProperties;
  };

  return (
    <div className={getThemeClasses()} style={getThemeStyles()}>
      <Trigger
        isOpen={modalOpen}
        onToggle={openModal}
        selectedItems={currentSelections}
        placeholder={texts.triggerPlaceholder}
        icon={icon}
        mapper={mapper}
        mode={mode}
        className={classNames?.trigger}
        style={styles?.trigger}
        renderTrigger={renderTrigger}
        onClear={clearSelections}
        onRemoveTag={(item) => toggleRowSelection(item)}
      />

      {renderModal ? (
        renderModal({
          isOpen: modalOpen,
          onClose: cancelSelection,
          children: renderModalContent(),
          title: modalTitle || texts.modalTitle,
          loading,
          error,
          query: getCurrentQuery(),
          selectedCount: currentSelections.length,
          totalCount,
        })
      ) : (
        <Modal
          isOpen={modalOpen}
          onClose={cancelSelection}
          title={modalTitle || texts.modalTitle}
          className={classNames?.modal}
          style={styles?.modal}
        >
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
}
