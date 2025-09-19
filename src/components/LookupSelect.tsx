import React from 'react';
import { LookupSelectProps } from '../internal/types';
import { useLookupSelectState } from '../internal/state';
import { Trigger } from './Trigger';
import { Modal, SearchInput, ModalFooter } from './Modal';
import { Grid } from './Grid';

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

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearchValue(value);
      updateQuery({ search: value });
    },
    [updateQuery]
  );

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

  // TODO: Server-side data loading will be implemented in Faz 6
  React.useEffect(() => {
    if (dataSource && modalOpen) {
      setLoading(true);
      const query = getCurrentQuery();

      dataSource({ ...query, search: searchValue })
        .then(() => {
          // TODO: Handle server response in Faz 6
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [dataSource, modalOpen, searchValue, getCurrentQuery]);

  // Grid component with current data
  const renderGrid = () => (
    <Grid
      data={filteredData}
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
        <div className="lookup-select__modal-content">{renderGrid()}</div>

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
