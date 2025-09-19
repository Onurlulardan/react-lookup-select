@onurlulardan/react-lookup-select – NPM Paketi: Adım Adım Proje Planı

Bu doküman, modal içinde grid ile tekli/çoklu seçim yapan headless ama tema-takılabilir bir React bileşenini npm paketi olarak geliştirmek için ayrıntılı bir yol haritasıdır.

⸻

1) Ürün Tanımı & Temel Özellikler
	•	Trigger (ComboBox görünümü): tıklanınca modal açılır.
	•	Modal içi Grid: tekli / çoklu satır seçimi (checkbox’lı veya satıra tıkla).
	•	Seçim Mode’ları: single | multiple.
	•	Dönüş Değeri: id ve text alanları kullanıcı tarafından map edilebilir (örn. text = name + ' ' + surname). İstenirse tüm satır nesnesi de döndürülebilir.
	•	Tam Özelleştirme: tema, ikon, grid kolonları, hücre render’ları, trigger görünümü, modal başlığı/footers, i18n metinleri.
	•	Veri Kaynağı: data (dizi) veya dataSource (async: sayfalama/sort/search desteği için callback’ler).
	•	Erişilebilirlik: klavye navigasyonu, ARIA rolleri, focus trap.
	•	Performans: büyük veri için virtualization opsiyonu.

⸻

2) API Tasarımı (Öneri)

Aşağıdaki tipler, paketin dış API’si içindir. Tümü TypeScript ile tiplenir.

export type SelectMode = 'single' | 'multiple';

export type ColumnDef<T> = {
  key: keyof T | string;              // veri alanı (string de desteklenir)
  title: string;                      // kolon başlığı
  width?: number | string;            // opsiyonel genişlik
  sortable?: boolean;                 // server/client sort tetikleyebilir
  render?: (row: T, index: number) => React.ReactNode; // özel hücre
};

export type QueryState = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;    // kolon key
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
  searchPlaceholder?: string;  // "Ara"
  confirmText?: string;        // "Uygula"
  cancelText?: string;         // "Vazgeç"
  modalTitle?: string;         // "Kayıt Seç"
  emptyText?: string;          // "Kayıt bulunamadı"
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
  tag?: string;   // seçili öğe chip/tag görünümü
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
  mode?: SelectMode;                    // default: 'single'
  data?: T[];                           // client-side veri
  dataSource?: DataSourceFn<T>;         // server-side veri
  columns: ColumnDef<T>[];              // grid kolonları
  mapper: ValueMapper<T>;               // id/text/disabled üreticisi

  // Değer kontrolü (controlled/uncontrolled)
  value?: T | T[] | null;               // controlled
  defaultValue?: T | T[] | null;        // uncontrolled
  onChange?: (val: any) => void;        // dönüş değeri şekline göre

  // Dönüş şekli
  returnShape?: ReturnShape;            // 'id-text' (default) | 'row' | 'custom'
  returnMap?: ReturnMap<T>;             // sadece 'custom' için

  // Modal & Trigger
  open?: boolean;                       // controlled modal state
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modalTitle?: string;                  // override i18n.modalTitle
  icon?: React.ReactNode;               // trigger ikonu override
  renderTrigger?: (selected: T | T[] | null) => React.ReactNode; // tamamen custom trigger

  // Grid davranışı
  selectableRow?: (row: T) => boolean;  // row bazlı seçim kısıtı
  virtualization?: boolean;             // büyük data için
  pageSize?: number;                    // default 20

  // Temalandırma
  classNames?: ClassNames;
  styles?: Styles;
  theme?: ThemeTokens;
  components?: ComponentsOverrides;     // düşük seviyede override

  // i18n
  i18n?: i18nStrings;

  // Eventler
  onQueryChange?: (q: QueryState) => void; // search/sort/page değişince
  onConfirm?: (val: any) => void;          // "Uygula" basılınca
  onCancel?: () => void;                    // modal kapatılırken
  onSelectionChange?: (rows: T[]) => void;  // modal içi seçim değiştikçe
};


⸻

3) İç Mimari
	•	Headless çekirdek: seçim durumu, query state, kısayol/klavye, mapping ve dönüş değeri üretimi.
	•	UI katmanı: Trigger, Modal, Grid bileşenleri. Tema/token, classNames/styles ile özelleştirilebilir.
	•	Controlled/Uncontrolled: hem value/onChange kontrollü kullanım, hem de defaultValue ile dahili state.
	•	State makinesi: idle → modalOpen → selecting → confirming/cancelled.
	•	Grid: basit tablo + opsiyonel virtual list (örn. react-virtual), server-side için dataSource(q) ile lazy yükleme.
	•	Seçim yapısı: Set<rowId> + Map<rowId, row> hızlı erişim.
	•	Erişilebilirlik: Trigger role="button" + aria-haspopup="dialog", Modal role="dialog", focus trap, ESC ile kapanma, Space/Enter ile seçim.

⸻

4) Dönüş Değeri Mantığı
	•	returnShape = 'id-text' → Tekil: { id, text } | Çoğul: { id, text }[]
	•	returnShape = 'row' → Tekil: T | Çoğul: T[]
	•	returnShape = 'custom' → returnMap.map(row) sonucu (tekil/çoğul simetrik)

Not: mapper.getId ve mapper.getText her zaman zorunlu; custom modda getText chip/etiket görünümü için yine kullanılır.

⸻

5) Örnek Kullanımlar

5.1 Tekli Seçim – text = name + ' ' + surname

<LookupSelect
  mode="single"
  data={users}
  columns=[
    { key: 'name', title: 'Ad' },
    { key: 'surname', title: 'Soyad' },
    { key: 'email', title: 'E-posta' }
  ]
  mapper={{
    getId: (u) => u.userId,
    getText: (u) => `${u.name} ${u.surname}`,
  }}
  returnShape="id-text"
  onChange={(val) => console.log(val)}
/>

5.2 Çoklu Seçim – Custom dönüş

<LookupSelect
  mode="multiple"
  data={products}
  columns=[
    { key: 'sku', title: 'SKU' },
    { key: 'title', title: 'Ürün' },
    { key: 'price', title: 'Fiyat' }
  ]
  mapper={{ getId: (p) => p.id, getText: (p) => p.title }}
  returnShape="custom"
  returnMap={{ map: (p) => ({ key: p.id, label: p.title, p }) }}
  onChange={(vals) => save(vals)}
/>

5.3 Server-side veri + arama/sayfalama

const dataSource = async (q: QueryState) => {
  const res = await fetch(`/api/users?page=${q.page}&size=${q.pageSize}&search=${q.search ?? ''}`);
  const json = await res.json();
  return { rows: json.items, total: json.total };
};

<LookupSelect
  mode="multiple"
  dataSource={dataSource}
  pageSize={50}
  columns=[
    { key: 'name', title: 'Ad', sortable: true },
    { key: 'surname', title: 'Soyad', sortable: true },
    { key: 'department', title: 'Birim' },
  ]
  mapper={{ getId: u => u.id, getText: u => `${u.name} ${u.surname}` }}
  onQueryChange={(q) => console.log('query changed', q)}
/>


⸻

6) Tasarım Özelleştirme (Tema/Slot)
	•	Theme Tokens: colorPrimary, colorBg, colorText, borderRadius, spacing.
	•	classNames/styles: her parçada sınıf ve inline stil override.
	•	components: Trigger/Modal/Grid tamamen değiştirilebilir (headless çekirdek korunur).
	•	Icon: icon prop veya components.Icon ile özel ikon.
	•	Unstyled mod: minimum CSS, tamamen tüketici tarafı stillerine izin.

⸻

7) Erişilebilirlik & UX
	•	Klavye: Enter (aç/kapat/confirm), Esc (kapat), ↑/↓ (satır), Space (seç/işaretle), Shift+Click aralıklı seçim (opsiyonel).
	•	Screen reader metinleri: i18n ile özelleştirilebilir.
	•	Odak yönetimi: modal açılınca ilk odak arama inputu.
	•	Çoklu seçimde seçili rozetler (tag) tetik üzerinden kaldırılabilir (× butonu).

⸻

8) Test Planı
	•	Unit: mapper, selection state, return shapes, query state.
	•	Component: trigger → modal akışı, tekli/çoklu seçim, controlled/uncontrolled.
	•	A11y: RTL ile klavye ve ARIA.
	•	E2E (opsiyonel): Playwright ile temel akışlar.

⸻

9) Paketleme & Yayınlama
	•	Monorepo değil tek paket (başlangıç için).
	•	Build: tsup veya rollup (treeshake + d.ts). Öneri: tsup basitlik için.
	•	Çıktı: ESM + CJS; exports alanı; types d.ts.
	•	Peer Deps: react >= 18, react-dom >= 18.
	•	Styling: küçük CSS dosyası (CSS variables); sideEffects: false.
	•	Storybook: interaktif örnekler ve görsel test zemini.
	•	README: hızlı başlama, API tablosu, örnekler, a11y, değişiklik günlüğü.

⸻

10) Sürümleme & CI
	•	Changesets ile semantik sürümleme.
	•	GitHub Actions: lint+typecheck+test+build; npm publish (manuel veya tag ile).
	•	Conventional Commits: feat:, fix:, docs:…

⸻

11) Görev Listesi (Adım Adım)

Faz 0 – Keşif & İsimlendirme (0.5g)
	•	Paket adı: @onurlulardan/react-lookup-select (scoped, public)
	•	Lisans: MIT
	•	Repo: github.com/onurlulardanlulardan/react-lookup-select
	•	İlk paket meta & iskelet

Komutlar

mkdir react-lookup-select && cd $_
git init && git branch -m main
npm init -y
npm pkg set name="@onurlulardan/react-lookup-select"
npm pkg set version="0.1.0" license="MIT" type="module"
npm pkg set publishConfig.access="public"
npm pkg set files='["dist"]'
npm pkg set sideEffects='["dist/styles.css"]'
npm pkg set keywords='["react","select","lookup","modal","grid","combobox","picker","headless","a11y"]'

Dizin yapısı (taslak)

src/
  index.ts
  components/LookupSelect.tsx
  styles.css
  internal/
    core.ts
    state.ts
    types.ts
.storybook/   (opsiyonel)

package.json (taslak)

{
  "name": "@onurlulardan/react-lookup-select",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "sideEffects": ["dist/styles.css"],
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "scripts": {
    "build": "tsup src/index.ts --dts --format cjs,esm --sourcemap",
    "dev": "tsup src/index.ts --dts --format cjs,esm --sourcemap --watch",
    "lint": "eslint .",
    "test": "vitest",
    "prepare": "husky install"
  },
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/onurlulardanlulardan/react-lookup-select.git"
  },
  "keywords": [
    "react",
    "select",
    "lookup",
    "modal",
    "grid",
    "combobox",
    "picker",
    "headless",
    "a11y"
  ]
}

Bileşen adı: LookupSelect (default export veya adlandırılmış export)

Faz 1 – Proje İskeleti (0.5g) – Proje İskeleti (0.5g)
	•	tsconfig, eslint, prettier.
	•	tsup konfigürasyonu (ESM+CJS, d.ts).
	•	Peer deps & package.json exports.

Faz 2 – Tipler & API (1g)
	•	ColumnDef, QueryState, ValueMapper, LookupSelectProps.
	•	Public API kararı ve dokümantasyon yorumları (TSDoc).

Faz 3 – Headless Çekirdek (2g)
	•	Selection state (Set/Map), tekli/çoklu davranış.
	•	Return shape üretimi (id-text, row, custom).
	•	Query state yönetimi (search/sort/page).

Faz 4 – UI: Trigger & Modal (1.5g)
	•	Trigger bileşeni (placeholder, chips, icon).
	•	Modal bileşeni (header/search/body/footer).
	•	Focus trap + a11y.

Faz 5 – UI: Grid (2g)
	•	Basit tablo + kolon render.
	•	Satır seçimi (tıklama, checkbox).
	•	Boş durum, yükleniyor, hata durumları.

Faz 6 – DataSource Entegrasyonu (1g)
	•	dataSource(q) çağrısı; total, page senkronizasyonu.
	•	onQueryChange tetikleme.

Faz 7 – Özelleştirme Katmanları (1.5g)
	•	classNames, styles, theme token’ları.
	•	components override (Trigger/Modal/Grid/Icon).
	•	renderTrigger, render hücreler.

Faz 8 – Sanallaştırma (opsiyonel) (1g)
	•	virtualization bayrağı ile react-virtual entegrasyonu.

Faz 9 – Erişilebilirlik & Klavye (1g)
	•	ARIA rolleri, kısayollar, odak yönetimi testleri.

Faz 10 – Testler & Storybook (1.5g)
	•	Vitest + RTL birim/bileşen testleri.
	•	Storybook örnekleri: basic, multiple, server-side, custom render, virtualization.

Faz 11 – Dokümantasyon (1g)
	•	README API tablosu + kullanım senaryoları.
	•	A11y & performans notları.

Faz 12 – Yayın (0.5g)
	•	1.0.0 yayın öncesi smoke test.
	•	npm publish / GitHub Action.

Toplam (tahmini): ~14 gün iş (opsiyonsuz). Sanallaştırma ve E2E ile +2-3 gün.

⸻

12) Kalite Kontrol Checklist
	•	Typesafe public API (no any sızıntısı).
	•	Tree-shakeable ve küçük bundle (UI minimal, headless mantık ağır basar).
	•	A11y: keyboard + SR testleri geçti.
	•	Performans: 10k satırda virtualization akıcı.
	•	Dokümantasyon net ve örnekler çalışır.

⸻

13) Riskler & Açık Sorular
	•	Grid kapsamı: tabloyu hafif mi tutalım, yoksa sort/pagination/client-side’ı biz mi yapalım? (Öneri: temel özellikler + gelişmiş için dataSource ile server-side)
	•	Tema: CSS-in-JS mi, CSS variables mı? (Öneri: CSS variables + basit CSS; tüketici isterse kendi stil katmanını uygular)
	•	Klavye çoklu seçim: Shift aralığı opsiyonel, dokümanla belirginleştirelim.
	•	SSR uyumluluğu: Next.js ile uyum testleri; modal portallarında useLayoutEffect uyarıları.

⸻

14) Yol Haritası (V1 Sonrası)
	•	Gruplama (grouped rows), kategori başlıkları.
	•	Etiketleme/Filtre çubukları modal üstünde.
	•	Seçim sınırı (max N).
	•	Satır aksiyonları (context menü).
	•	Boş veri için Create New butonu (isteğe bağlı inline form).

⸻

15) Hızlı Başlangıç – Kurulum Notları (README’ye girecek taslak)

npm i @onurlulardan/react-lookup-select

import { LookupSelect } from '@onurlulardan/react-lookup-select';
import '@onurlulardan/react-lookup-select/styles.css';

// ...örnekler bölümündeki kullanım kodları


⸻

Bu plan üzerinden ilerlerken istersen faz/issue’ları GitHub’da oluşturup sırayla kapatabiliriz. Bir sonraki adım: Faz 0 için paket adı, lisans ve repo iskeletini netleştirelim.