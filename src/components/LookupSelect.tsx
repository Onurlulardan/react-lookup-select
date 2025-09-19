import React from 'react';
import { LookupSelectProps } from '../internal/types';
import { useLookupSelectState } from '../internal/state';
import { Trigger } from './Trigger';
import { Modal, SearchInput, ModalFooter } from './Modal';
import { Grid } from './Grid';
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
    icon,
    renderTrigger,
    modalTitle,
    classNames,
    styles,
    i18n,
    pageSize = 20,
    selectableRow,
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
        pageSize: pageSize || 20,
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
  }, [dataSource, getCurrentQuery, searchValue, currentPage, pageSize]);

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

  // Grid component with current data
  const renderGrid = () => (
    <Grid
      data={currentData}
      columns={columns}
      mode={mode}
      mapper={mapper}
      selectedRows={currentSelections}
      onRowToggle={toggleRowSelection}
      isRowSelected={isRowSelected}
      selectableRow={selectableRow}
      loading={loading}
      error={error}
      emptyText={texts.emptyText}
      className={classNames?.grid}
      style={styles?.grid}
      currentSort={
        dataSource
          ? {
              sortBy: getCurrentQuery().sortBy || '',
              sortDir: getCurrentQuery().sortDir || 'asc',
            }
          : undefined
      }
      onSort={dataSource ? handleSortChange : undefined}
    />
  );

  return (
    <div
      className={`lookup-select ${classNames?.root || ''}`}
      style={styles?.root}
    >
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
              pageSize={pageSize || 20}
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
