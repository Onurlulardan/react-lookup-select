import { ReactNode } from 'react';

/**
 * Seçim modu: tekli veya çoklu
 */
export type SelectMode = 'single' | 'multiple';

/**
 * Theme türleri
 */
export type Theme = 'default' | 'dark' | 'minimal' | 'compact';

/**
 * Size variants
 */
export type Size = 'small' | 'medium' | 'large';

/**
 * Grid kolonu tanımı
 * @template T - Veri türü
 */
export type ColumnDef<T> = {
  /** Veri alanı (string de desteklenir) */
  key: keyof T | string;
  /** Kolon başlığı */
  title: string;
  /** Opsiyonel genişlik */
  width?: number | string;
  /** Server/client sort tetikleyebilir */
  sortable?: boolean;
  /** Özel hücre render fonksiyonu */
  render?: (row: T, index: number) => ReactNode;
};

/**
 * Sorgu durumu - sayfalama, arama ve sıralama bilgileri
 */
export type QueryState = {
  /** Sayfa numarası */
  page: number;
  /** Sayfa boyutu */
  pageSize: number;
  /** Arama metni */
  search?: string;
  /** Sıralama kolonu */
  sortBy?: string;
  /** Sıralama yönü */
  sortDir?: 'asc' | 'desc';
};

/**
 * DataSource fonksiyonunun döndürdüğü sonuç
 * @template T - Veri türü
 */
export type DataSourceResult<T> = {
  /** Satır verileri */
  rows: T[];
  /** Toplam kayıt sayısı */
  total: number;
};

/**
 * Server-side veri kaynağı fonksiyonu
 * @template T - Veri türü
 */
export type DataSourceFn<T> = (q: QueryState) => Promise<DataSourceResult<T>>;

/**
 * Değer mapping fonksiyonları
 * @template T - Veri türü
 */
export type ValueMapper<T> = {
  /** ID alma fonksiyonu */
  getId: (row: T) => string | number;
  /** Metin alma fonksiyonu - örn: (r) => `${r.name} ${r.surname}` */
  getText: (row: T) => string;
  /** İsteğe bağlı: disable kontrolü */
  getDisabled?: (row: T) => boolean;
};

/**
 * Virtualization konfigürasyonu
 */
export type VirtualizationConfig = {
  /** Virtualization aktif mi? */
  enabled: boolean;
  /** Sabit satır yüksekliği (px) */
  rowHeight: number;
  /** Görünür alan dışında render edilecek ek satır sayısı */
  overscan: number;
  /** Container yüksekliği (px) */
  containerHeight: number;
  /** Virtualization threshold - bu sayıdan fazla item'da aktif olur */
  threshold: number;
};

/**
 * Dönüş değeri şekli
 */
export type ReturnShape = 'id-text' | 'row' | 'custom';

/**
 * Custom dönüş değeri mapping'i
 * @template T - Veri türü
 */
export type ReturnMap<T> = {
  /** Custom mapping fonksiyonu - örn: (r) => ({ id: r.userId, label: `${r.name} ${r.surname}` }) */
  map: (row: T) => any;
};

/**
 * i18n metin çevirileri
 */
export type i18nStrings = {
  /** Trigger placeholder - "Seçiniz" */
  triggerPlaceholder?: string;
  /** Arama placeholder - "Ara" */
  searchPlaceholder?: string;
  /** Onay butonu - "Uygula" */
  confirmText?: string;
  /** İptal butonu - "Vazgeç" */
  cancelText?: string;
  /** Modal başlığı - "Kayıt Seç" */
  modalTitle?: string;
  /** Boş durum metni - "Kayıt bulunamadı" */
  emptyText?: string;
  /** Seçilen sayısı - "{n} seçildi" */
  selectedCount?: (n: number) => string;
};

/**
 * Bileşen override'ları - headless çekirdek korunur
 */
export type ComponentsOverrides = {
  /** Custom trigger bileşeni */
  Trigger?: React.ComponentType<any>;
  /** Custom modal bileşeni */
  Modal?: React.ComponentType<any>;
  /** Custom grid bileşeni */
  Grid?: React.ComponentType<any>;
  /** Custom checkbox bileşeni */
  Checkbox?: React.ComponentType<any>;
  /** Custom icon bileşeni */
  Icon?: React.ComponentType<any>;
};

/**
 * CSS sınıf adları - her parçada sınıf override
 */
export type ClassNames = {
  /** Root container sınıfı */
  root?: string;
  /** Trigger sınıfı */
  trigger?: string;
  /** Modal sınıfı */
  modal?: string;
  /** Header sınıfı */
  header?: string;
  /** Footer sınıfı */
  footer?: string;
  /** Grid sınıfı */
  grid?: string;
  /** Row sınıfı */
  row?: string;
  /** Cell sınıfı */
  cell?: string;
  /** Seçili öğe chip/tag sınıfı */
  tag?: string;
};

/**
 * Inline stil inject alanları
 */
export type Styles = Partial<{
  /** Root container stilleri */
  root: React.CSSProperties;
  /** Trigger stilleri */
  trigger: React.CSSProperties;
  /** Modal stilleri */
  modal: React.CSSProperties;
  /** Header stilleri */
  header: React.CSSProperties;
  /** Footer stilleri */
  footer: React.CSSProperties;
  /** Grid stilleri */
  grid: React.CSSProperties;
  /** Row stilleri */
  row: React.CSSProperties;
  /** Cell stilleri */
  cell: React.CSSProperties;
  /** Tag stilleri */
  tag: React.CSSProperties;
}>;

/**
 * Tema token'ları - CSS değişkenleri ile köprülenebilir
 */
export type ThemeTokens = Partial<{
  /** Ana renk */
  colorPrimary: string;
  /** Arka plan rengi */
  colorBg: string;
  /** Metin rengi */
  colorText: string;
  /** Köşe yuvarlaklığı */
  borderRadius: string | number;
  /** Boşluk çarpanı */
  spacing: number;
}>;

/**
 * LookupSelect bileşeninin ana props arayüzü
 * @template T - Veri türü
 */
export type LookupSelectProps<T> = {
  // === Temel Özellikler ===
  /** Seçim modu - default: 'single' */
  mode?: SelectMode;
  /** Client-side veri dizisi */
  data?: T[];
  /** Server-side veri kaynağı fonksiyonu */
  dataSource?: DataSourceFn<T>;
  /** Grid kolonları tanımı */
  columns: ColumnDef<T>[];
  /** ID/text/disabled üreticisi */
  mapper: ValueMapper<T>;

  // === Değer Kontrolü (controlled/uncontrolled) ===
  /** Controlled değer */
  value?: T | T[] | null;
  /** Uncontrolled başlangıç değeri */
  defaultValue?: T | T[] | null;
  /** Değer değişiklik callback'i - dönüş değeri şekline göre */
  onChange?: (val: any) => void;

  // === Dönüş Şekli ===
  /** Dönüş değeri formatı - 'id-text' (default) | 'row' | 'custom' */
  returnShape?: ReturnShape;
  /** Custom dönüş mapping'i - sadece 'custom' için */
  returnMap?: ReturnMap<T>;

  // === Modal & Trigger ===
  /** Controlled modal durumu */
  open?: boolean;
  /** Uncontrolled modal başlangıç durumu */
  defaultOpen?: boolean;
  /** Modal durum değişiklik callback'i */
  onOpenChange?: (open: boolean) => void;
  /** Modal başlığı - i18n.modalTitle override */
  modalTitle?: string;
  /** Trigger ikonu override */
  icon?: ReactNode;
  /** Tamamen custom trigger render fonksiyonu */
  renderTrigger?: (selected: T | T[] | null) => ReactNode;

  // === Grid Davranışı ===
  /** Row bazlı seçim kısıtı fonksiyonu */
  selectableRow?: (row: T) => boolean;
  /** Büyük data için virtualization aktif mi? */
  virtualization?: boolean;
  /** Virtual grid için sabit satır yüksekliği (px) - default: 40 */
  virtualRowHeight?: number;
  /** Görünür alan dışında render edilecek ek satır sayısı - default: 5 */
  virtualOverscan?: number;
  /** Virtual container yüksekliği (px) - default: 400 */
  virtualContainerHeight?: number;
  /** Virtualization threshold - bu sayıdan fazla item'da aktif olur - default: 100 */
  virtualThreshold?: number;
  /** Sayfa boyutu - default 20 */
  pageSize?: number;

  // === Temalandırma ===
  /** Önceden tanımlanmış tema */
  variant?: Theme;
  /** Boyut variant'ı */
  size?: Size;
  /** CSS sınıf adları */
  classNames?: ClassNames;
  /** Inline stiller */
  styles?: Styles;
  /** Tema token'ları */
  theme?: ThemeTokens;
  /** Düşük seviyede bileşen override'ları */
  components?: ComponentsOverrides;

  // === i18n ===
  /** Metin çevirileri */
  i18n?: i18nStrings;

  // === Event'ler ===
  /** Search/sort/page değişiklik callback'i */
  onQueryChange?: (q: QueryState) => void;
  /** "Uygula" butonu callback'i */
  onConfirm?: (val: any) => void;
  /** Modal kapatma callback'i */
  onCancel?: () => void;
  /** Modal içi seçim değişiklik callback'i */
  onSelectionChange?: (rows: T[]) => void;
};
