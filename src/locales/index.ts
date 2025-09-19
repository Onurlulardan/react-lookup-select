import { i18nStrings } from '../internal/types';

/**
 * Default Turkish locale
 */
export const tr: i18nStrings = {
  triggerPlaceholder: 'Seçiniz',
  searchPlaceholder: 'Ara...',
  confirmText: 'Uygula',
  cancelText: 'Vazgeç',
  modalTitle: 'Kayıt Seç',
  emptyText: 'Kayıt bulunamadı',
  loadingText: 'Yükleniyor...',
  errorPrefix: 'Hata:',
  selectedCount: (n: number) => `${n} seçildi`,
  clearText: 'Temizle',
  selectAllLabel: 'Tümünü seç',
  selectRowLabel: (rowText: string) => `${rowText} seçeneğini seç`,
  sortColumnLabel: (columnTitle: string) =>
    `${columnTitle} kolonuna göre sırala`,
  closeModalLabel: 'Modalı kapat',
  paginationInfo: (current: number, total: number) =>
    `Sayfa ${current} / ${total}`,
  totalRecords: (total: number) => `${total} kayıt`,
  pageSize: (size: number) => `${size} kayıt göster`,
  firstPage: 'İlk',
  lastPage: 'Son',
  previousPage: 'Önceki',
  nextPage: 'Sonraki',
  searchResults: (count: number) => `${count} sonuç bulundu`,
  clearFilters: 'Filtreleri temizle',
};

/**
 * English locale
 */
export const en: i18nStrings = {
  triggerPlaceholder: 'Select...',
  searchPlaceholder: 'Search...',
  confirmText: 'Apply',
  cancelText: 'Cancel',
  modalTitle: 'Select Record',
  emptyText: 'No records found',
  loadingText: 'Loading...',
  errorPrefix: 'Error:',
  selectedCount: (n: number) => `${n} selected`,
  clearText: 'Clear',
  selectAllLabel: 'Select all',
  selectRowLabel: (rowText: string) => `Select ${rowText}`,
  sortColumnLabel: (columnTitle: string) => `Sort by ${columnTitle}`,
  closeModalLabel: 'Close modal',
  paginationInfo: (current: number, total: number) =>
    `Page ${current} of ${total}`,
  totalRecords: (total: number) => `${total} records`,
  pageSize: (size: number) => `Show ${size} records`,
  firstPage: 'First',
  lastPage: 'Last',
  previousPage: 'Previous',
  nextPage: 'Next',
  searchResults: (count: number) => `${count} results found`,
  clearFilters: 'Clear filters',
};

/**
 * German locale
 */
export const de: i18nStrings = {
  triggerPlaceholder: 'Auswählen...',
  searchPlaceholder: 'Suchen...',
  confirmText: 'Anwenden',
  cancelText: 'Abbrechen',
  modalTitle: 'Datensatz auswählen',
  emptyText: 'Keine Datensätze gefunden',
  loadingText: 'Lädt...',
  errorPrefix: 'Fehler:',
  selectedCount: (n: number) => `${n} ausgewählt`,
  clearText: 'Löschen',
  selectAllLabel: 'Alle auswählen',
  selectRowLabel: (rowText: string) => `${rowText} auswählen`,
  sortColumnLabel: (columnTitle: string) => `Nach ${columnTitle} sortieren`,
  closeModalLabel: 'Modal schließen',
  paginationInfo: (current: number, total: number) =>
    `Seite ${current} von ${total}`,
  totalRecords: (total: number) => `${total} Datensätze`,
  pageSize: (size: number) => `${size} Datensätze anzeigen`,
  firstPage: 'Erste',
  lastPage: 'Letzte',
  previousPage: 'Vorherige',
  nextPage: 'Nächste',
  searchResults: (count: number) => `${count} Ergebnisse gefunden`,
  clearFilters: 'Filter löschen',
};

/**
 * French locale
 */
export const fr: i18nStrings = {
  triggerPlaceholder: 'Sélectionner...',
  searchPlaceholder: 'Rechercher...',
  confirmText: 'Appliquer',
  cancelText: 'Annuler',
  modalTitle: 'Sélectionner un enregistrement',
  emptyText: 'Aucun enregistrement trouvé',
  loadingText: 'Chargement...',
  errorPrefix: 'Erreur:',
  selectedCount: (n: number) => `${n} sélectionné(s)`,
  clearText: 'Effacer',
  selectAllLabel: 'Tout sélectionner',
  selectRowLabel: (rowText: string) => `Sélectionner ${rowText}`,
  sortColumnLabel: (columnTitle: string) => `Trier par ${columnTitle}`,
  closeModalLabel: 'Fermer le modal',
  paginationInfo: (current: number, total: number) =>
    `Page ${current} de ${total}`,
  totalRecords: (total: number) => `${total} enregistrements`,
  pageSize: (size: number) => `Afficher ${size} enregistrements`,
  firstPage: 'Premier',
  lastPage: 'Dernier',
  previousPage: 'Précédent',
  nextPage: 'Suivant',
  searchResults: (count: number) => `${count} résultats trouvés`,
  clearFilters: 'Effacer les filtres',
};

/**
 * Spanish locale
 */
export const es: i18nStrings = {
  triggerPlaceholder: 'Seleccionar...',
  searchPlaceholder: 'Buscar...',
  confirmText: 'Aplicar',
  cancelText: 'Cancelar',
  modalTitle: 'Seleccionar registro',
  emptyText: 'No se encontraron registros',
  loadingText: 'Cargando...',
  errorPrefix: 'Error:',
  selectedCount: (n: number) => `${n} seleccionado(s)`,
  clearText: 'Limpiar',
  selectAllLabel: 'Seleccionar todo',
  selectRowLabel: (rowText: string) => `Seleccionar ${rowText}`,
  sortColumnLabel: (columnTitle: string) => `Ordenar por ${columnTitle}`,
  closeModalLabel: 'Cerrar modal',
  paginationInfo: (current: number, total: number) =>
    `Página ${current} de ${total}`,
  totalRecords: (total: number) => `${total} registros`,
  pageSize: (size: number) => `Mostrar ${size} registros`,
  firstPage: 'Primero',
  lastPage: 'Último',
  previousPage: 'Anterior',
  nextPage: 'Siguiente',
  searchResults: (count: number) => `${count} resultados encontrados`,
  clearFilters: 'Limpiar filtros',
};

/**
 * Default locales export
 */
export const locales = {
  tr,
  en,
  de,
  fr,
  es,
} as const;

export type SupportedLocale = keyof typeof locales;
