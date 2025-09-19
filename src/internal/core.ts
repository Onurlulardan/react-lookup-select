import { LookupSelectProps, QueryState } from './types';

/**
 * Headless çekirdek mantık - seçim durumu, query state, mapping ve dönüş değeri üretimi
 */

export function createSelectionState<T>() {
  // Selection state management will be implemented here
  // Set<rowId> + Map<rowId, row> hızlı erişim için
  return {
    selectedIds: new Set<string | number>(),
    selectedRows: new Map<string | number, T>(),
  };
}

export function createQueryState(): QueryState {
  return {
    page: 1,
    pageSize: 20,
    search: undefined,
    sortBy: undefined,
    sortDir: undefined,
  };
}

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
      mappedValues = selectedRows.map((row) => ({
        id: mapper.getId(row),
        text: mapper.getText(row),
      }));
      break;
    case 'row':
      mappedValues = selectedRows;
      break;
    case 'custom':
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
