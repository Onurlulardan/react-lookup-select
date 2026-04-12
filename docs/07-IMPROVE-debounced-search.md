# P1-3: Server-Side Data Icin Debounced Search

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Sorun

`LookupSelect.tsx:129-134` - `handleSearchChange` her keystroke'ta hemen state guncelliyor ve server fetch tetikliyor.

```typescript
const handleSearchChange = React.useCallback(
  (value: string) => {
    setSearchValue(value);
    updateQuery({ search: value, page: 1 });
  },
  [updateQuery]
);
```

Kullanici "John" yazdiginda 4 ayri fetch gonderiliyor: "J", "Jo", "Joh", "John".

## Etki

- Gereksiz network istekleri
- Server yuku
- UI flickering (her harfte loading state)
- Race condition riski (eski istek yeni istekten sonra donebilir)

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/components/LookupSelect.tsx` | 129-134, 156-186 | Debounce mekanizmasi ekle |

## Cozum

### Input value'yu aninda guncelle, fetch'i debounce et

```typescript
// Debounce hook (basit, dependency-free)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Kullanim:
const [searchValue, setSearchValue] = useState('');
const debouncedSearch = useDebounce(searchValue, 300);

// Input aninda guncellenir (responsive UI)
const handleSearchChange = useCallback((value: string) => {
  setSearchValue(value);
}, []);

// Server fetch sadece debounced value degistiginde
useEffect(() => {
  if (dataSource && modalOpen) {
    loadServerData(debouncedSearch);
  }
}, [debouncedSearch, dataSource, modalOpen]);
```

### Onemli Not
- Client-side filtering icin debounce GEREKMEZ (zaten aninda filtrelenir)
- Debounce sadece `dataSource` varken uygulanmali
- Default delay: 300ms (konfigurasyona aciabilir: `searchDebounce` prop)

## Dogrulama

- [ ] Server-side: Hizli yazarken tek fetch gonderiliyor (300ms sonra)
- [ ] Client-side: Debounce YOK, aninda filtreleme devam ediyor
- [ ] Input value her keystroke'ta guncelleniyor (UI responsive)
- [ ] Race condition yok (stale response handle ediliyor)
