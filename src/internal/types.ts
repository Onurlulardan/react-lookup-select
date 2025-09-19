import { ReactNode } from 'react';

export type SelectMode = 'single' | 'multiple';

export type ColumnDef<T> = {
  key: keyof T | string; // veri alanı (string de desteklenir)
  title: string; // kolon başlığı
  width?: number | string; // opsiyonel genişlik
  sortable?: boolean; // server/client sort tetikleyebilir
  render?: (row: T, index: number) => ReactNode; // özel hücre
};

export type QueryState = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string; // kolon key
  sortDir?: 'asc' | 'desc';
};

export type DataSourceResult<T> = {
  rows: T[];
  total: number;
};

export type DataSourceFn<T> = (q: QueryState) => Promise<DataSourceResult<T>>;

export type ValueMapper<T> = {
  getId: (row: T) => string | number;
  getText: (row: T) => string; // örn: (r) => `${r.name} ${r.surname}`
  // İsteğe bağlı: disable, tooltip, badge rengi vb.
  getDisabled?: (row: T) => boolean;
};

export type ReturnShape = 'id-text' | 'row' | 'custom';

export type ReturnMap<T> = {
  // Sadece ReturnShape 'custom' ise aktif; kullanıcı alan adlarını belirleyebilir
  map: (row: T) => any; // örn: (r) => ({ id: r.userId, label: `${r.name} ${r.surname}` })
};

export type i18nStrings = {
  triggerPlaceholder?: string; // "Seçiniz"
  searchPlaceholder?: string; // "Ara"
  confirmText?: string; // "Uygula"
  cancelText?: string; // "Vazgeç"
  modalTitle?: string; // "Kayıt Seç"
  emptyText?: string; // "Kayıt bulunamadı"
  selectedCount?: (n: number) => string; // "{n} seçildi"
};

export type ComponentsOverrides = {
  Trigger?: React.ComponentType<any>;
  Modal?: React.ComponentType<any>;
  Grid?: React.ComponentType<any>;
  Checkbox?: React.ComponentType<any>;
  Icon?: React.ComponentType<any>;
};

export type ClassNames = {
  root?: string;
  trigger?: string;
  modal?: string;
  header?: string;
  footer?: string;
  grid?: string;
  row?: string;
  cell?: string;
  tag?: string; // seçili öğe chip/tag görünümü
};

export type Styles = Partial<{
  // inline style inject alanları
  root: React.CSSProperties;
  trigger: React.CSSProperties;
  modal: React.CSSProperties;
  header: React.CSSProperties;
  footer: React.CSSProperties;
  grid: React.CSSProperties;
  row: React.CSSProperties;
  cell: React.CSSProperties;
  tag: React.CSSProperties;
}>;

export type ThemeTokens = Partial<{
  // CSS değişkenleri ile köprüleyebiliriz
  colorPrimary: string;
  colorBg: string;
  colorText: string;
  borderRadius: string | number;
  spacing: number; // birim çarpanı
}>;

export type LookupSelectProps<T> = {
  mode?: SelectMode; // default: 'single'
  data?: T[]; // client-side veri
  dataSource?: DataSourceFn<T>; // server-side veri
  columns: ColumnDef<T>[]; // grid kolonları
  mapper: ValueMapper<T>; // id/text/disabled üreticisi

  // Değer kontrolü (controlled/uncontrolled)
  value?: T | T[] | null; // controlled
  defaultValue?: T | T[] | null; // uncontrolled
  onChange?: (val: any) => void; // dönüş değeri şekline göre

  // Dönüş şekli
  returnShape?: ReturnShape; // 'id-text' (default) | 'row' | 'custom'
  returnMap?: ReturnMap<T>; // sadece 'custom' için

  // Modal & Trigger
  open?: boolean; // controlled modal state
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modalTitle?: string; // override i18n.modalTitle
  icon?: ReactNode; // trigger ikonu override
  renderTrigger?: (selected: T | T[] | null) => ReactNode; // tamamen custom trigger

  // Grid davranışı
  selectableRow?: (row: T) => boolean; // row bazlı seçim kısıtı
  virtualization?: boolean; // büyük data için
  pageSize?: number; // default 20

  // Temalandırma
  classNames?: ClassNames;
  styles?: Styles;
  theme?: ThemeTokens;
  components?: ComponentsOverrides; // düşük seviyede override

  // i18n
  i18n?: i18nStrings;

  // Eventler
  onQueryChange?: (q: QueryState) => void; // search/sort/page değişince
  onConfirm?: (val: any) => void; // "Uygula" basılınca
  onCancel?: () => void; // modal kapatılırken
  onSelectionChange?: (rows: T[]) => void; // modal içi seçim değiştikçe
};
