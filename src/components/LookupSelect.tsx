import React from 'react';
import { LookupSelectProps } from '../internal/types';
import { useLookupSelectState } from '../internal/state';
import { Trigger } from './Trigger';
import { Modal, SearchInput, ModalFooter } from './Modal';

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

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearchValue(value);
      updateQuery({ search: value });
    },
    [updateQuery]
  );

  // TODO: Grid component will be implemented in Faz 5
  const renderGrid = () => (
    <div className="lookup-select__grid-placeholder">
      <p>Grid bileşeni Faz 5'te implementasyonu yapılacak</p>
      <p>Columns: {columns.length}</p>
      <p>Data: {data.length} kayıt</p>
      <p>Mode: {mode}</p>
    </div>
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

        {/* Grid Body - Faz 5'te implementasyonu */}
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
