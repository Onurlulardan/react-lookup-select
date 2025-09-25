import { ReactNode } from 'react';

/**
 * Selection mode: single or multiple
 */
export type SelectMode = 'single' | 'multiple';

/**
 * Theme types
 */
export type Theme = 'default' | 'dark' | 'minimal' | 'compact';

/**
 * Size variants
 */
export type Size = 'small' | 'medium' | 'large';

/**
 * Grid column definition
 * @template T - Data type
 */
export type ColumnDef<T> = {
  /** Data field (string is also supported) */
  key: keyof T | string;
  /** Column title */
  title: string;
  /** Optional width */
  width?: number | string;
  /** Can trigger server/client sort */
  sortable?: boolean;
  /** Custom cell render function */
  render?: (row: T, index: number) => ReactNode;
};

/**
 * Query state - pagination, search and sorting information
 */
export type QueryState = {
  /** Page number */
  page: number;
  /** Page size */
  pageSize: number;
  /** Search text */
  search?: string;
  /** Sort column */
  sortBy?: string;
  /** Sort direction */
  sortDir?: 'asc' | 'desc';
};

/**
 * DataSource function return result
 * @template T - Data type
 */
export type DataSourceResult<T> = {
  /** Row data */
  rows: T[];
  /** Total record count */
  total: number;
};

/**
 * Server-side data source function
 * @template T - Data type
 */
export type DataSourceFn<T> = (q: QueryState) => Promise<DataSourceResult<T>>;

/**
 * Value mapping functions
 * @template T - Data type
 */
export type ValueMapper<T> = {
  /** ID getter function */
  getId: (row: T) => string | number;
  /** Text getter function - e.g: (r) => `${r.name} ${r.surname}` */
  getText: (row: T) => string;
  /** Optional: disable check */
  getDisabled?: (row: T) => boolean;
};

/**
 * Virtualization configuration
 */
export type VirtualizationConfig = {
  /** Is virtualization active? */
  enabled: boolean;
  /** Fixed row height (px) */
  rowHeight: number;
  /** Number of extra rows to render outside visible area */
  overscan: number;
  /** Container height (px) */
  containerHeight: number;
  /** Virtualization threshold - activates with more items than this number */
  threshold: number;
};

/**
 * Return value shape
 */
export type ReturnShape = 'id-text' | 'row' | 'custom';

/**
 * Custom return value mapping
 * @template T - Data type
 */
export type ReturnMap<T> = {
  /** Custom mapping function - e.g: (r) => ({ id: r.userId, label: `${r.name} ${r.surname}` }) */
  map: (row: T) => any;
};

/**
 * i18n text translations - Comprehensive multilingual support
 */
export type i18nStrings = {
  /** Trigger placeholder - "Please select" */
  triggerPlaceholder?: string;
  /** Search placeholder - "Search" */
  searchPlaceholder?: string;
  /** Confirm button - "Apply" */
  confirmText?: string;
  /** Cancel button - "Cancel" */
  cancelText?: string;
  /** Modal title - "Select Record" */
  modalTitle?: string;
  /** Empty state text - "No records found" */
  emptyText?: string;
  /** Loading text - "Loading..." */
  loadingText?: string;
  /** Error state prefix - "Error:" */
  errorPrefix?: string;
  /** Selected count - "{n} selected" */
  selectedCount?: (n: number) => string;
  /** Clear button - "Clear" */
  clearText?: string;
  /** Select all checkbox aria-label */
  selectAllLabel?: string;
  /** Row selection checkbox aria-label */
  selectRowLabel?: (rowText: string) => string;
  /** Sort button aria-label */
  sortColumnLabel?: (columnTitle: string) => string;
  /** Modal close button aria-label */
  closeModalLabel?: string;
  /** Pagination info - "Page {current} / {total}" */
  paginationInfo?: (current: number, total: number) => string;
  /** Total record count - "{total} records" */
  totalRecords?: (total: number) => string;
  /** Page size selector - "Show {size} records" */
  pageSize?: (size: number) => string;
  /** First page - "First" */
  firstPage?: string;
  /** Last page - "Last" */
  lastPage?: string;
  /** Previous page - "Previous" */
  previousPage?: string;
  /** Next page - "Next" */
  nextPage?: string;
  /** Search result info - "{count} results found" */
  searchResults?: (count: number) => string;
  /** Clear filters - "Clear filters" */
  clearFilters?: string;
};

/**
 * Render Props Interfaces - for custom rendering functions
 */
export type ModalRenderProps<T> = {
  /** Is modal open? */
  isOpen: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Modal title */
  title?: string;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Current query state */
  query?: QueryState;
  /** Selected items count */
  selectedCount: number;
  /** Total items count */
  totalCount: number;
};

export type GridRenderProps<T> = {
  /** Grid data */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Selected row IDs */
  selectedIds: (string | number)[];
  /** Row selection callback */
  onRowSelect: (row: T) => void;
  /** Select all callback */
  onSelectAll?: () => void;
  /** Clear all selections callback */
  onClearAll?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  /** Selection mode */
  mode: SelectMode;
  /** Value mapper */
  mapper: ValueMapper<T>;
  /** Virtualization config */
  virtualization?: VirtualizationConfig;
  /** Row selectability checker */
  selectableRow?: (row: T) => boolean;
  /** Sort change callback */
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  /** Current sort state */
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};

export type HeaderRenderProps<T> = {
  /** Current search value */
  searchValue: string;
  /** Search change callback */
  onSearchChange: (value: string) => void;
  /** Total items count */
  totalCount: number;
  /** Selected items count */
  selectedCount: number;
  /** Clear all selections callback */
  onClearAll: () => void;
  /** Modal title */
  title?: string;
  /** Close modal callback */
  onClose: () => void;
  /** Loading state */
  loading?: boolean;
};

export type FooterRenderProps<T> = {
  /** Selected items count */
  selectedCount: number;
  /** Total items count */
  totalCount: number;
  /** Confirm selection callback */
  onConfirm: () => void;
  /** Cancel selection callback */
  onCancel: () => void;
  /** Current page info */
  currentPage: number;
  /** Total pages */
  totalPages: number;
  /** Page change callback */
  onPageChange: (page: number) => void;
  /** Page size */
  pageSize: number;
  /** Page size change callback */
  onPageSizeChange?: (size: number) => void;
  /** Loading state */
  loading?: boolean;
  /** Selection mode */
  mode: SelectMode;
};

export type SearchRenderProps = {
  /** Current search value */
  value: string;
  /** Search change callback */
  onChange: (value: string) => void;
  /** Search placeholder */
  placeholder?: string;
  /** Loading state */
  loading?: boolean;
  /** Clear search callback */
  onClear?: () => void;
};

export type PaginationRenderProps = {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total pages */
  totalPages: number;
  /** Page change callback */
  onPageChange: (page: number) => void;
  /** Page size */
  pageSize: number;
  /** Page size change callback */
  onPageSizeChange?: (size: number) => void;
  /** Total items count */
  totalCount: number;
  /** Loading state */
  loading?: boolean;
};

/**
 * Component overrides - preserves headless core
 */
export type ComponentsOverrides = {
  /** Custom trigger component */
  Trigger?: React.ComponentType<any>;
  /** Custom modal component */
  Modal?: React.ComponentType<any>;
  /** Custom grid component */
  Grid?: React.ComponentType<any>;
  /** Custom checkbox component */
  Checkbox?: React.ComponentType<any>;
  /** Custom icon component */
  Icon?: React.ComponentType<any>;
};

/**
 * CSS class names - class override for each part
 */
export type ClassNames = {
  /** Root container class */
  root?: string;
  /** Trigger class */
  trigger?: string;
  /** Modal class */
  modal?: string;
  /** Header class */
  header?: string;
  /** Footer class */
  footer?: string;
  /** Grid class */
  grid?: string;
  /** Row class */
  row?: string;
  /** Cell class */
  cell?: string;
  /** Selected item chip/tag class */
  tag?: string;
};

/**
 * Inline style injection areas
 */
export type Styles = Partial<{
  /** Root container styles */
  root: React.CSSProperties;
  /** Trigger styles */
  trigger: React.CSSProperties;
  /** Modal styles */
  modal: React.CSSProperties;
  /** Header styles */
  header: React.CSSProperties;
  /** Footer styles */
  footer: React.CSSProperties;
  /** Grid styles */
  grid: React.CSSProperties;
  /** Row styles */
  row: React.CSSProperties;
  /** Cell styles */
  cell: React.CSSProperties;
  /** Tag styles */
  tag: React.CSSProperties;
}>;

/**
 * Theme tokens - can be bridged with CSS variables
 */
export type ThemeTokens = Partial<{
  /** Primary color */
  colorPrimary: string;
  /** Background color */
  colorBg: string;
  /** Text color */
  colorText: string;
  /** Border radius */
  borderRadius: string | number;
  /** Spacing multiplier */
  spacing: number;
}>;

/**
 * Main LookupSelect component props interface
 * @template T - Data type
 */
export type LookupSelectProps<T> = {
  // === Core Features ===
  /** Selection mode - default: 'single' */
  mode?: SelectMode;
  /** Client-side data array */
  data?: T[];
  /** Server-side data source function */
  dataSource?: DataSourceFn<T>;
  /** Grid columns definition */
  columns: ColumnDef<T>[];
  /** ID/text/disabled generator */
  mapper: ValueMapper<T>;

  // === Value Control (controlled/uncontrolled) ===
  /** Controlled value */
  value?: T | T[] | null;
  /** Uncontrolled initial value */
  defaultValue?: T | T[] | null;
  /** Value change callback - according to return shape */
  onChange?: (val: any) => void;

  // === Return Shape ===
  /** Return value format - 'id-text' (default) | 'row' | 'custom' */
  returnShape?: ReturnShape;
  /** Custom return mapping - only for 'custom' */
  returnMap?: ReturnMap<T>;

  // === Modal & Trigger ===
  /** Controlled modal state */
  open?: boolean;
  /** Uncontrolled modal initial state */
  defaultOpen?: boolean;
  /** Modal state change callback */
  onOpenChange?: (open: boolean) => void;
  /** Modal title - i18n.modalTitle override */
  modalTitle?: string;
  /** Trigger icon override */
  icon?: ReactNode;
  /** Completely custom trigger render function */
  renderTrigger?: (selected: T | T[] | null) => ReactNode;

  // === Custom Rendering Functions ===
  /** Custom modal render function */
  renderModal?: (props: ModalRenderProps<T>) => ReactNode;
  /** Custom grid render function */
  renderGrid?: (props: GridRenderProps<T>) => ReactNode;
  /** Custom header render function */
  renderHeader?: (props: HeaderRenderProps<T>) => ReactNode;
  /** Custom footer render function */
  renderFooter?: (props: FooterRenderProps<T>) => ReactNode;
  /** Custom search input render function */
  renderSearch?: (props: SearchRenderProps) => ReactNode;
  /** Custom pagination render function */
  renderPagination?: (props: PaginationRenderProps) => ReactNode;

  // === Grid Behavior ===
  /** Row-based selection constraint function */
  selectableRow?: (row: T) => boolean;
  /** Is virtualization active for large data? */
  virtualization?: boolean;
  /** Fixed row height for virtual grid (px) - default: 40 */
  virtualRowHeight?: number;
  /** Number of extra rows to render outside visible area - default: 5 */
  virtualOverscan?: number;
  /** Virtual container height (px) - default: 400 */
  virtualContainerHeight?: number;
  /** Virtualization threshold - activates with more items than this number - default: 100 */
  virtualThreshold?: number;
  /** Page size - default 20 */
  pageSize?: number;

  // === Theming ===
  /** Predefined theme */
  variant?: Theme;
  /** Size variant */
  size?: Size;
  /** CSS class names */
  classNames?: ClassNames;
  /** Inline styles */
  styles?: Styles;
  /** Theme tokens */
  theme?: ThemeTokens;
  /** Low level component overrides */
  components?: ComponentsOverrides;

  // === i18n ===
  /** Text translations */
  i18n?: i18nStrings;

  // === Events ===
  /** Search/sort/page change callback */
  onQueryChange?: (q: QueryState) => void;
  /** "Apply" button callback */
  onConfirm?: (val: any) => void;
  /** Modal close callback */
  onCancel?: () => void;
  /** Modal internal selection change callback */
  onSelectionChange?: (rows: T[]) => void;
};
