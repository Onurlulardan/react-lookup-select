import React from 'react';
import { LookupSelectProps } from '../internal/types';
import { useLookupSelectState } from '../internal/state';
import { Trigger } from './Trigger';
import { Modal, SearchInput, ModalFooter } from './Modal';
import { Grid } from './Grid';
import { VirtualGrid } from './VirtualGrid';
import { Pagination } from './Pagination';

/**
 * LookupSelect - Headless React lookup select component with modal and grid
 * Project.md Faz 4: UI katmanı implementasyonu
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
    closeModal,
    currentSelections,
    toggleRowSelection,
    clearSelections,
    isRowSelected,
    updateQuery,
    getCurrentQuery,
    confirmSelection,
    cancelSelection,
  } = useLookupSelectState(props);

  // i18n defaults
  const texts = {
    triggerPlaceholder: 'Seçiniz',
    searchPlaceholder: 'Ara...',
    confirmText: 'Uygula',
    cancelText: 'Vazgeç',
    modalTitle: 'Kayıt Seç',
    emptyText: 'Kayıt bulunamadı',
    selectedCount: (n: number) => `${n} seçildi`,
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

  // Search state
  const [searchValue, setSearchValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  // Server-side data state
  const [serverData, setServerData] = React.useState<T[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearchValue(value);
      updateQuery({ search: value, page: 1 }); // Reset to page 1 on search
    },
    [updateQuery]
  ); // Filtered data - client-side filtering if data provided
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

  // Server-side data loading - Faz 6 implementasyonu
  const loadServerData = React.useCallback(async () => {
    if (!dataSource) return;

    setLoading(true);
    setError(undefined);

    try {
      const query = getCurrentQuery();
      const result = await dataSource({
        ...query,
        search: searchValue,
        page: currentPage,
        pageSize: optimizedPageSize,
      });

      setServerData(result.rows);
      setTotalCount(result.total);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu'
      );
      setLoading(false);
    }
  }, [
    dataSource,
    getCurrentQuery,
    searchValue,
    currentPage,
    optimizedPageSize,
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
      updateQuery({ sortBy, sortDir, page: 1 }); // Reset to page 1 on sort
      setCurrentPage(1);
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
  const renderGrid = React.useCallback(() => {
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
      className: classNames?.grid,
      style: styles?.grid,
      currentSort: dataSource
        ? {
            sortBy: getCurrentQuery().sortBy || '',
            sortDir: getCurrentQuery().sortDir || 'asc',
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
      />

      <Modal
        isOpen={modalOpen}
        onClose={cancelSelection}
        title={modalTitle || texts.modalTitle}
        className={classNames?.modal}
        style={styles?.modal}
      >
        {/* Search Input */}
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={texts.searchPlaceholder}
        />

        {/* Grid Body - Faz 5 implementasyonu tamamlandı */}
        <div className="lookup-select__modal-content">
          {renderGrid()}

          {/* Pagination - only for server-side data */}
          {dataSource && (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={optimizedPageSize}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Footer */}
        <ModalFooter
          onConfirm={confirmSelection}
          onCancel={cancelSelection}
          confirmText={texts.confirmText}
          cancelText={texts.cancelText}
          selectedCount={currentSelections.length}
        />
      </Modal>
    </div>
  );
}
