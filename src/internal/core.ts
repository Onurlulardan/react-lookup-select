import {
  LookupSelectProps,
  QueryState,
  SelectMode,
  ValueMapper,
} from './types';

/**
 * Headless core logic - selection state, query state, mapping and return value generation
 * Project.md Section 3: Internal Architecture implementation
 */

/**
 * Selection state - Set<rowId> + Map<rowId, row> for fast access
 */
export interface SelectionState<T> {
  selectedIds: Set<string | number>;
  selectedRows: Map<string | number, T>;
}

/**
 * Selection state creator
 */
export function createSelectionState<T>(): SelectionState<T> {
  return {
    selectedIds: new Set<string | number>(),
    selectedRows: new Map<string | number, T>(),
  };
}

/**
 * Selection state update functions
 */
export class SelectionManager<T> {
  private state: SelectionState<T>;
  private mode: SelectMode;
  private mapper: ValueMapper<T>;

  constructor(
    mode: SelectMode,
    mapper: ValueMapper<T>,
    initialState?: SelectionState<T>
  ) {
    this.mode = mode;
    this.mapper = mapper;
    this.state = initialState || createSelectionState<T>();
  }

  /**
   * Row selection/deselection
   */
  toggleRow(row: T): SelectionState<T> {
    const id = this.mapper.getId(row);
    const newState = {
      selectedIds: new Set(this.state.selectedIds),
      selectedRows: new Map(this.state.selectedRows),
    };

    if (this.state.selectedIds.has(id)) {
      // Remove selection
      newState.selectedIds.delete(id);
      newState.selectedRows.delete(id);
    } else {
      // Select
      if (this.mode === 'single') {
        // Clear others in single mode
        newState.selectedIds.clear();
        newState.selectedRows.clear();
      }
      newState.selectedIds.add(id);
      newState.selectedRows.set(id, row);
    }

    this.state = newState;
    return newState;
  }

  /**
   * Return selected rows as array
   */
  getSelectedRows(): T[] {
    return Array.from(this.state.selectedRows.values());
  }

  /**
   * Check if row is selected
   */
  isRowSelected(row: T): boolean {
    const id = this.mapper.getId(row);
    return this.state.selectedIds.has(id);
  }

  /**
   * Clear all selections
   */
  clearSelection(): SelectionState<T> {
    this.state = createSelectionState<T>();
    return this.state;
  }

  /**
   * Get current state
   */
  getState(): SelectionState<T> {
    return this.state;
  }
}

/**
 * Query state creator - with default values
 */
export function createQueryState(pageSize: number = 20): QueryState {
  return {
    page: 1,
    pageSize,
    search: undefined,
    sortBy: undefined,
    sortDir: undefined,
  };
}

/**
 * Query state update functions
 */
export class QueryManager {
  private state: QueryState;

  constructor(initialState?: Partial<QueryState>) {
    this.state = { ...createQueryState(), ...initialState };
  }

  /**
   * Update search term - returns to page 1
   */
  updateSearch(search: string): QueryState {
    this.state = { ...this.state, search, page: 1 };
    return this.state;
  }

  /**
   * Update pagination
   */
  updatePage(page: number): QueryState {
    this.state = { ...this.state, page };
    return this.state;
  }

  /**
   * Update sorting - returns to page 1
   */
  updateSort(sortBy: string, sortDir: 'asc' | 'desc'): QueryState {
    this.state = { ...this.state, sortBy, sortDir, page: 1 };
    return this.state;
  }

  /**
   * Update page size - returns to page 1
   */
  updatePageSize(pageSize: number): QueryState {
    this.state = { ...this.state, pageSize, page: 1 };
    return this.state;
  }

  /**
   * Get current state
   */
  getState(): QueryState {
    return this.state;
  }
}

/**
 * Return value generation - project.md Section 4 logic
 */
export function mapReturnValue<T>(
  selectedRows: T[],
  props: Pick<
    LookupSelectProps<T>,
    'returnShape' | 'returnMap' | 'mapper' | 'mode'
  >
) {
  const { returnShape = 'id-text', returnMap, mapper, mode = 'single' } = props;

  if (selectedRows.length === 0) {
    return mode === 'single' ? null : [];
  }

  let mappedValues;

  switch (returnShape) {
    case 'id-text':
      // returnShape = 'id-text' → Single: { id, text } | Multiple: { id, text }[]
      mappedValues = selectedRows.map((row) => ({
        id: mapper.getId(row),
        text: mapper.getText(row),
      }));
      break;
    case 'row':
      // returnShape = 'row' → Single: T | Multiple: T[]
      mappedValues = selectedRows;
      break;
    case 'custom':
      // returnShape = 'custom' → returnMap.map(row) result
      if (!returnMap) {
        throw new Error('returnMap is required when returnShape is "custom"');
      }
      mappedValues = selectedRows.map((row) => returnMap.map(row));
      break;
    default:
      throw new Error(`Unknown returnShape: ${returnShape}`);
  }

  return mode === 'single' ? mappedValues[0] : mappedValues;
}
