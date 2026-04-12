# P1-1: useMemo'da Mutable Class Instance Riski

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Sorun

`state.ts:49-56` - `SelectionManager` ve `QueryManager` mutable class instance'lari `useMemo` ile tutuluyor.

```typescript
// state.ts:49-51
const selectionManager = useMemo(() => {
  return new SelectionManager(mode, mapper);
}, [mode, mapper]);

// state.ts:54-56
const queryManager = useMemo(() => {
  return new QueryManager({ pageSize });
}, [pageSize]);
```

### Neden Sorun?

React dokumantasyonu acikca belirtir: **`useMemo` referential stability garanti etmez**. React gelecekte memo'yu discard edebilir (orn. offscreen components, Concurrent Mode optimizasyonlari). Bu durumda:

1. Yeni `SelectionManager` **bos state** ile olusturulur
2. Tum secimler **sessizce kaybolur**
3. Kullanici hicbir hata mesaji gormez

Bu su an calisiyordur ama gelecek React versiyonlarinda patlamaya aday bir bomba.

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/internal/state.ts` | 49-56 | `useMemo` -> `useRef` veya `useReducer` |

## Cozum Secenekleri

### Secenek A: useRef (Minimal degisiklik)

```typescript
const selectionManagerRef = useRef<SelectionManager<T> | null>(null);
if (!selectionManagerRef.current) {
  selectionManagerRef.current = new SelectionManager(mode, mapper);
}
const selectionManager = selectionManagerRef.current;

const queryManagerRef = useRef<QueryManager | null>(null);
if (!queryManagerRef.current) {
  queryManagerRef.current = new QueryManager({ pageSize });
}
const queryManager = queryManagerRef.current;
```

### Secenek B: useReducer (Daha saglikli, ama daha buyuk refactor)

Mutable class'lari pure reducer fonksiyonlarina donustur:
```typescript
const [selectionState, dispatchSelection] = useReducer(selectionReducer, initialState);
const [queryState, dispatchQuery] = useReducer(queryReducer, initialQueryState);
```

## Oneri

**Secenek A** (useRef) en az riskli ve en hizli cozum. Mevcut class API'si aynen kalir, sadece referential stability garanti altina alinir.

## Dogrulama

- [ ] Modal ac, satirlari sec, modal kapat/ac -> secimler korunuyor
- [ ] Uzun sureli kullanim senaryosunda secim kaybi yok
- [ ] Mode veya mapper degistiginde yeni instance olusturuluyor
