import { useState, useCallback, useMemo } from 'react';
import { LookupSelectProps, QueryState } from './types';
import { SelectionManager, QueryManager, mapReturnValue } from './core';

/**
 * State makinesi: idle → modalOpen → selecting → confirming/cancelled
 * Project.md Bölüm 3: Controlled/Uncontrolled davranış
 */

export type ModalState = 'closed' | 'open';

/**
 * Ana state hook - controlled/uncontrolled davranış
 */
export function useLookupSelectState<T>(props: LookupSelectProps<T>) {
  const {
    mode = 'single',
    mapper,
    returnShape = 'id-text',
    returnMap,
    value,
    defaultValue,
    onChange,
    open,
    defaultOpen = false,
    onOpenChange,
    pageSize = 20,
    onQueryChange,
    onSelectionChange,
    onConfirm,
    onCancel,
  } = props;

  // Modal state management (controlled/uncontrolled)
  const [internalModalOpen, setInternalModalOpen] = useState(defaultOpen);
  const modalOpen = open !== undefined ? open : internalModalOpen;

  const handleModalOpenChange = useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        setInternalModalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange]
  );

  // Selection manager
  const selectionManager = useMemo(() => {
    return new SelectionManager(mode, mapper);
  }, [mode, mapper]);

  // Query manager
  const queryManager = useMemo(() => {
    return new QueryManager({ pageSize });
  }, [pageSize]);

  // Current selections state
  const [currentSelections, setCurrentSelections] = useState<T[]>([]);

  // Toggle row selection
  const toggleRowSelection = useCallback(
    (row: T) => {
      const newState = selectionManager.toggleRow(row);
      const selectedRows = selectionManager.getSelectedRows();
      setCurrentSelections(selectedRows);
      onSelectionChange?.(selectedRows);
    },
    [selectionManager, onSelectionChange]
  );

  // Clear all selections
  const clearSelections = useCallback(() => {
    selectionManager.clearSelection();
    setCurrentSelections([]);
    onSelectionChange?.([]);
  }, [selectionManager, onSelectionChange]);

  // Check if row is selected
  const isRowSelected = useCallback(
    (row: T) => {
      return selectionManager.isRowSelected(row);
    },
    [selectionManager]
  );

  // Query state updates
  const updateQuery = useCallback(
    (updates: Partial<QueryState>) => {
      const currentState = queryManager.getState();
      const newState = { ...currentState, ...updates };

      if (updates.search !== undefined) {
        queryManager.updateSearch(updates.search);
      }
      if (updates.page !== undefined) {
        queryManager.updatePage(updates.page);
      }
      if (updates.sortBy !== undefined && updates.sortDir !== undefined) {
        queryManager.updateSort(updates.sortBy, updates.sortDir);
      }
      if (updates.pageSize !== undefined) {
        queryManager.updatePageSize(updates.pageSize);
      }

      onQueryChange?.(queryManager.getState());
    },
    [queryManager, onQueryChange]
  );

  // Confirm selection (Apply button)
  const confirmSelection = useCallback(() => {
    const selectedRows = selectionManager.getSelectedRows();
    const returnValue = mapReturnValue(selectedRows, {
      mode,
      mapper,
      returnShape,
      returnMap,
    });

    onChange?.(returnValue);
    onConfirm?.(returnValue);
    handleModalOpenChange(false);
  }, [
    selectionManager,
    mode,
    mapper,
    returnShape,
    returnMap,
    onChange,
    onConfirm,
    handleModalOpenChange,
  ]);

  // Cancel selection (Close modal without applying)
  const cancelSelection = useCallback(() => {
    // Reset selections to original value
    selectionManager.clearSelection();
    setCurrentSelections([]);
    onCancel?.();
    handleModalOpenChange(false);
  }, [selectionManager, onCancel, handleModalOpenChange]);

  // Get current query state
  const getCurrentQuery = useCallback(() => {
    return queryManager.getState();
  }, [queryManager]);

  return {
    // Modal state
    modalOpen,
    openModal: () => handleModalOpenChange(true),
    closeModal: () => handleModalOpenChange(false),

    // Selection state
    currentSelections,
    toggleRowSelection,
    clearSelections,
    isRowSelected,

    // Query state
    updateQuery,
    getCurrentQuery,

    // Actions
    confirmSelection,
    cancelSelection,
  };
}
