# P0-3: Pagination Hardcoded Turkce + Bozuk Yorum Blogu

## Oncelik: P0 (Kritik)
## Durum: [ ] Bekliyor

## Sorun 1: Hardcoded Turkce aria-label

`Pagination.tsx:114`:
```typescript
aria-label={`Sayfa ${pageNum}`}  // TURKCE!
```

Ayni dosyadaki diger label'lar Ingilizce:
- Satir 86: `aria-label="Previous page"` (Ingilizce)
- Satir 128: `aria-label="Next page"` (Ingilizce)

Bu tutarsizlik a11y sorununa yol aciyor. Turkce bilmeyen ekran okuyucu kullanicilari icin anlamsiz.

## Sorun 2: Bozuk JSDoc Yorum Blogu

`Pagination.tsx:3-9`:
```
/**
 * Pagination component - pagination for server-side data
 * Project.md Phas              }}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined} total, page synchronization
 */
```

Bu bir merge artifact - kod parcalari yorum bloguna karismis.

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/components/Pagination.tsx` | 3-9 | Bozuk yorum blogunu temizle |
| `src/components/Pagination.tsx` | 114 | `Sayfa` -> `Page` veya i18n prop ekle |
| `src/components/Pagination.tsx` | 11-17 | PaginationProps'a i18n desteği ekle |
| `src/components/LookupSelect.tsx` | 356-361 | Pagination'a i18n text'leri aktar |

## Cozum

### Adim 1: Bozuk yorumu temizle
```typescript
/**
 * Pagination component - pagination for server-side data
 */
```

### Adim 2: i18n prop ekle veya en azindan Ingilizce yap
**Secim A (Basit):** `Sayfa` -> `Page`
```typescript
aria-label={`Page ${pageNum}`}
```

**Secim B (Ideal):** PaginationProps'a i18n ekle
```typescript
interface PaginationProps {
  // ...mevcut props
  pageLabel?: (pageNum: number) => string;
  previousLabel?: string;
  nextLabel?: string;
  recordsLabel?: (start: number, end: number, total: number) => string;
}
```

## Dogrulama

- [ ] Bozuk yorum blogu temizlendi
- [ ] Tum aria-label'lar tutarli (hepsi Ingilizce veya hepsi i18n)
- [ ] Pagination component dogru renderliyor
- [ ] Screen reader ile test: tum label'lar anlamli
