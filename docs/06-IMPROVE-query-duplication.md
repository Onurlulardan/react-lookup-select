# P1-2: Query State Duplikasyonu

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Sorun

`LookupSelect.tsx`'de query bilgisi 3 farkli yerde tutuluyor:

1. **React state** - `currentPage` (satir 127), `searchValue` (satir 120)
2. **QueryManager** - `queryManager.getState()` (state.ts uzerinden)
3. **loadServerData** merge - satirler 163-168'de bunlari ad-hoc birlestiriyor

```typescript
// LookupSelect.tsx:163-168
const result = await dataSource({
  ...query,              // QueryManager'dan
  search: searchValue,   // React state'den
  page: currentPage,     // React state'den
  pageSize: optimizedPageSize,
});
```

### Neden Sorun?

- `currentPage` ve `queryManager.page` drift edebilir
- `searchValue` ve `queryManager.search` drift edebilir
- Hangi deger gercek? React state mi, QueryManager mi?
- Bakimi zor, hata ayiklamasi karmasik

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/components/LookupSelect.tsx` | 120, 127, 156-186, 196-211 | Tek kaynak kullan |

## Cozum

### Secim: QueryManager'i kaldir, sadece React state kullan

QueryManager zaten basit bir state container. React state yeterli:

```typescript
const [query, setQuery] = useState<QueryState>({
  page: 1,
  pageSize: optimizedPageSize,
  search: '',
  sortBy: undefined,
  sortDir: undefined,
});

const handleSearchChange = useCallback((value: string) => {
  setQuery(prev => ({ ...prev, search: value, page: 1 }));
}, []);

const handlePageChange = useCallback((page: number) => {
  setQuery(prev => ({ ...prev, page }));
}, []);

const handleSortChange = useCallback((sortBy: string, sortDir: 'asc' | 'desc') => {
  setQuery(prev => ({ ...prev, sortBy, sortDir, page: 1 }));
}, []);

// loadServerData artik tek kaynaktan okur:
const loadServerData = useCallback(async () => {
  if (!dataSource) return;
  const result = await dataSource(query);
  // ...
}, [dataSource, query]);
```

## Dogrulama

- [ ] Search yapinca page 1'e donuyor
- [ ] Sort degistirince page 1'e donuyor
- [ ] Page degistirince search ve sort korunuyor
- [ ] onQueryChange callback dogru query donduruyur
- [ ] Server fetch her query degisikliginde tetikleniyor
