import {
  LookupSelectProps,
  QueryState,
  SelectMode,
  ValueMapper,
} from './types';

/**
 * Headless çekirdek mantık - seçim durumu, query state, mapping ve dönüş değeri üretimi
 * Project.md Bölüm 3: İç Mimari implementasyonu
 */

/**
 * Seçim durumu - Set<rowId> + Map<rowId, row> hızlı erişim
 */
export interface SelectionState<T> {
  selectedIds: Set<string | number>;
  selectedRows: Map<string | number, T>;
}

/**
 * Seçim durumu oluşturucu
 */
export function createSelectionState<T>(): SelectionState<T> {
  return {
    selectedIds: new Set<string | number>(),
    selectedRows: new Map<string | number, T>(),
  };
}

/**
 * Seçim durumunu güncelleme fonksiyonları
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
   * Satır seçimi/seçim kaldırma
   */
  toggleRow(row: T): SelectionState<T> {
    const id = this.mapper.getId(row);
    const newState = {
      selectedIds: new Set(this.state.selectedIds),
      selectedRows: new Map(this.state.selectedRows),
    };

    if (this.state.selectedIds.has(id)) {
      // Seçimi kaldır
      newState.selectedIds.delete(id);
      newState.selectedRows.delete(id);
    } else {
      // Seç
      if (this.mode === 'single') {
        // Tekli modda diğerlerini temizle
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
   * Seçili satırları array olarak döndür
   */
  getSelectedRows(): T[] {
    return Array.from(this.state.selectedRows.values());
  }

  /**
   * Satır seçili mi kontrol et
   */
  isRowSelected(row: T): boolean {
    const id = this.mapper.getId(row);
    return this.state.selectedIds.has(id);
  }

  /**
   * Tüm seçimleri temizle
   */
  clearSelection(): SelectionState<T> {
    this.state = createSelectionState<T>();
    return this.state;
  }

  /**
   * Mevcut state'i al
   */
  getState(): SelectionState<T> {
    return this.state;
  }
}

/**
 * Query state oluşturucu - default değerlerle
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
 * Query state güncelleme fonksiyonları
 */
export class QueryManager {
  private state: QueryState;

  constructor(initialState?: Partial<QueryState>) {
    this.state = { ...createQueryState(), ...initialState };
  }

  /**
   * Arama terimi güncelle - sayfa 1'e döner
   */
  updateSearch(search: string): QueryState {
    this.state = { ...this.state, search, page: 1 };
    return this.state;
  }

  /**
   * Sayfalama güncelle
   */
  updatePage(page: number): QueryState {
    this.state = { ...this.state, page };
    return this.state;
  }

  /**
   * Sıralama güncelle - sayfa 1'e döner
   */
  updateSort(sortBy: string, sortDir: 'asc' | 'desc'): QueryState {
    this.state = { ...this.state, sortBy, sortDir, page: 1 };
    return this.state;
  }

  /**
   * Sayfa boyutu güncelle - sayfa 1'e döner
   */
  updatePageSize(pageSize: number): QueryState {
    this.state = { ...this.state, pageSize, page: 1 };
    return this.state;
  }

  /**
   * Mevcut state'i al
   */
  getState(): QueryState {
    return this.state;
  }
}

/**
 * Dönüş değeri üretimi - project.md Bölüm 4 mantığı
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
      // returnShape = 'id-text' → Tekil: { id, text } | Çoğul: { id, text }[]
      mappedValues = selectedRows.map((row) => ({
        id: mapper.getId(row),
        text: mapper.getText(row),
      }));
      break;
    case 'row':
      // returnShape = 'row' → Tekil: T | Çoğul: T[]
      mappedValues = selectedRows;
      break;
    case 'custom':
      // returnShape = 'custom' → returnMap.map(row) sonucu
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
