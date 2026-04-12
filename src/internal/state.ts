import { useState, useCallback, useRef, useEffect } from 'react';
import { LookupSelectProps, QueryState } from './types';
import { SelectionManager, QueryManager, mapReturnValue } from './core';

/**
 * State machine: idle → modalOpen → selecting → confirming/cancelled
 */

export type ModalState = 'closed' | 'open';

/**
 * Main state hook - controlled/uncontrolled behavior
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
    data,
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

  // Selection manager (useRef guarantees referential stability unlike useMemo)
  const selectionManagerRef = useRef<SelectionManager<T> | null>(null);
  if (!selectionManagerRef.current) {
    selectionManagerRef.current = new SelectionManager(mode, mapper);
  }
  const selectionManager = selectionManagerRef.current;

  // Query manager (useRef guarantees referential stability unlike useMemo)
  const queryManagerRef = useRef<QueryManager | null>(null);
  if (!queryManagerRef.current) {
    queryManagerRef.current = new QueryManager({ pageSize });
  }
  const queryManager = queryManagerRef.current;

  // Current selections state
  const [currentSelections, setCurrentSelections] = useState<T[]>([]);

  // Backup selections when modal opens
  const [backupSelections, setBackupSelections] = useState<T[]>([]);

  // Helper function to resolve value objects to actual data rows
  const resolveValueToRows = useCallback(
    (valueToResolve: any): T[] => {
      if (!valueToResolve || !data) return [];

      const values = Array.isArray(valueToResolve)
        ? valueToResolve
        : [valueToResolve];
      const resolvedRows: T[] = [];

      for (const val of values) {
        // If it's already a full row object, use it directly
        if (
          typeof val === 'object' &&
          val !== null &&
          mapper.getId(val as T) !== undefined
        ) {
          resolvedRows.push(val as T);
        }
        // If it's an id-text object or just an ID, find the matching row in data
        else {
          const searchId =
            typeof val === 'object' && val !== null && 'id' in val
              ? val.id
              : val;
          const matchingRow = data.find(
            (row) => mapper.getId(row) === searchId
          );
          if (matchingRow) {
            resolvedRows.push(matchingRow);
          } else if (typeof console !== 'undefined') {
            console.warn(
              `[react-lookup-select] Could not resolve value with id "${searchId}" from data. ` +
              `Ensure the value matches an item in the data array.`
            );
          }
        }
      }

      return resolvedRows;
    },
    [data, mapper]
  );

  // Initialize default/controlled values when data is available
  useEffect(() => {
    const initialValue = value !== undefined ? value : defaultValue;
    if (!initialValue || !data) return;

    const resolvedSelections = resolveValueToRows(initialValue);

    if (resolvedSelections.length > 0) {
      // Clear previous selections
      selectionManager.clearSelection();

      // Add new selections
      for (const row of resolvedSelections) {
        selectionManager.toggleRow(row);
      }

      setCurrentSelections(resolvedSelections);
    }
  }, [value, defaultValue, data, resolveValueToRows, selectionManager]);

  // Toggle row selection
  const toggleRowSelection = useCallback(
    (row: T) => {
      const newState = selectionManager.toggleRow(row);
      const selectedRows = selectionManager.getSelectedRows();
      setCurrentSelections(selectedRows);

      // Don't trigger onChange while modal is open - only update temporary selection state
      // onChange will be triggered in confirmSelection
      if (!modalOpen) {
        onSelectionChange?.(selectedRows);
      }
    },
    [selectionManager, onSelectionChange, modalOpen]
  );

  // Clear all selections
  const clearSelections = useCallback(() => {
    selectionManager.clearSelection();
    setCurrentSelections([]);

    if (!modalOpen) {
      onSelectionChange?.([]);
    }
  }, [selectionManager, onSelectionChange, modalOpen]);

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
    selectionManager.clearSelection();

    for (const row of backupSelections) {
      selectionManager.toggleRow(row);
    }

    setCurrentSelections([...backupSelections]);
    onCancel?.();
    handleModalOpenChange(false);
  }, [selectionManager, backupSelections, onCancel, handleModalOpenChange]);

  // Get current query state
  const getCurrentQuery = useCallback(() => {
    return queryManager.getState();
  }, [queryManager]);

  // Modal open with backup
  const openModal = useCallback(() => {
    // Backup current selections when modal opens
    setBackupSelections([...currentSelections]);
    handleModalOpenChange(true);
  }, [currentSelections, handleModalOpenChange]);

  return {
    // Modal state
    modalOpen,
    openModal,
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
