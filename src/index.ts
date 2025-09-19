// Main export file for @onurlulardan/react-lookup-select
export { LookupSelect } from './components/LookupSelect';

// Public API Types - project.md Bölüm 2'ye göre
export type {
  // Ana Props Interface
  LookupSelectProps,

  // Temel Tipler
  SelectMode,
  ColumnDef,
  QueryState,
  DataSourceResult,
  DataSourceFn,
  ValueMapper,
  ReturnShape,
  ReturnMap,

  // Temalandırma ve Özelleştirme
  i18nStrings,
  ComponentsOverrides,
  ClassNames,
  Styles,
  ThemeTokens,
} from './internal/types';
