// Main export file for react-lookup-select
export { LookupSelect } from './components/LookupSelect';

// Public API Types - according to project.md Section 2
export type {
  // Main Props Interface
  LookupSelectProps,

  // Core Types
  SelectMode,
  ColumnDef,
  QueryState,
  DataSourceResult,
  DataSourceFn,
  ValueMapper,
  ReturnShape,
  ReturnMap,

  // Theming and Customization
  i18nStrings,
  ComponentsOverrides,
  ClassNames,
  Styles,
  ThemeTokens,

  // Render Props Interfaces
  ModalRenderProps,
  GridRenderProps,
  HeaderRenderProps,
  FooterRenderProps,
  SearchRenderProps,
  PaginationRenderProps,
} from './internal/types';
