# P1-4: Controlled Value Icin Development Uyarilari

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Sorun

`state.ts:65-101` - `resolveValueToRows` value ID'si data'da bulunamadiginda sessizce bos array donduruyor. Kullanici neden controlled value'nun calismadigini anlayamiyor.

```typescript
const resolveValueToRows = useCallback((valueToResolve: any): T[] => {
  if (!valueToResolve || !data) return [];  // Sessiz fail
  // ...
  const matchingRow = data.find((row) => mapper.getId(row) === searchId);
  if (matchingRow) {
    resolvedRows.push(matchingRow);
  }
  // matchingRow bulunamazsa -> sessizce skip
  return resolvedRows;
}, [data, mapper]);
```

## Senaryo

```tsx
// Kullanici bunu yaziyor:
<LookupSelect
  value={{ id: 5, name: "John" }}
  data={users}  // users'da id:5 yok!
  // ...
/>
// Sonuc: Bos trigger gosteriyor, hicbir uyari yok
// Kullanici saatlerce debug ediyor
```

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/internal/state.ts` | 65-101 | Development-mode console.warn ekle |

## Cozum

```typescript
const resolveValueToRows = useCallback((valueToResolve: any): T[] => {
  if (!valueToResolve || !data) return [];

  const values = Array.isArray(valueToResolve) ? valueToResolve : [valueToResolve];
  const resolvedRows: T[] = [];

  for (const val of values) {
    if (typeof val === 'object' && val !== null && mapper.getId(val as T) !== undefined) {
      resolvedRows.push(val as T);
    } else {
      const searchId = typeof val === 'object' && val !== null && 'id' in val
        ? val.id
        : val;
      const matchingRow = data.find((row) => mapper.getId(row) === searchId);
      if (matchingRow) {
        resolvedRows.push(matchingRow);
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[react-lookup-select] Could not find row with id "${searchId}" in data. ` +
          `Make sure the value prop matches an item in the data array. ` +
          `Available ids: [${data.slice(0, 5).map(r => mapper.getId(r)).join(', ')}${data.length > 5 ? '...' : ''}]`
        );
      }
    }
  }

  return resolvedRows;
}, [data, mapper]);
```

## Dogrulama

- [ ] Gecersiz value ile development modda console.warn gorunuyor
- [ ] Production build'de warn gorunmuyor (tree-shaked)
- [ ] Gecerli value ile uyari gorunmuyor
- [ ] Uyari mesaji yardimci bilgi iceriyor (mevcut id'ler)
