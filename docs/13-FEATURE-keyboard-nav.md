# P2-1: Grid Icerisinde Ok Tusu Navigasyonu

## Oncelik: P2 (Guzel Olur)
## Durum: [ ] Bekliyor

## Sorun

`useAccessibility.ts:42-44` ArrowDown/ArrowUp icin placeholder yorum var ama implement edilmemis:

```typescript
case 'ArrowDown':
case 'ArrowUp':
  // Grid navigation handled by Grid component
  break;
```

Grid component'inda da ok tusu navigasyonu yok. Kullanici Tab ile satirlar arasinda gezmek zorunda.

## Beklenen Davranis

- ArrowDown: Bir sonraki satira focus
- ArrowUp: Bir onceki satira focus
- Enter/Space: Focus'taki satiri sec/sec kaldir
- Home: Ilk satira focus
- End: Son satira focus

## Etkilenen Dosyalar

| Dosya | Degisiklik |
|-------|------------|
| `src/hooks/useAccessibility.ts` | ArrowDown/ArrowUp implement et |
| `src/components/Grid.tsx` | focusedRowIndex state + ref yonetimi |
| `src/components/VirtualGrid.tsx` | Ayni navigasyon mantigi |

## Cozum Tasarimi

```typescript
// useKeyboardNavigation'a ekle:
const [focusedRowIndex, setFocusedRowIndex] = useState(-1);

case 'ArrowDown':
  event.preventDefault();
  setFocusedRowIndex(prev => Math.min(prev + 1, currentData.length - 1));
  break;

case 'ArrowUp':
  event.preventDefault();
  setFocusedRowIndex(prev => Math.max(prev - 1, 0));
  break;

case 'Home':
  event.preventDefault();
  setFocusedRowIndex(0);
  break;

case 'End':
  event.preventDefault();
  setFocusedRowIndex(currentData.length - 1);
  break;
```

Grid.tsx'de:
```typescript
// focusedRowIndex degistiginde ilgili <tr>'ye focus ver
useEffect(() => {
  if (focusedRowIndex >= 0) {
    const row = tableRef.current?.querySelector(
      `tbody tr:nth-child(${focusedRowIndex + 1})`
    );
    (row as HTMLElement)?.focus();
  }
}, [focusedRowIndex]);
```

## Dogrulama

- [ ] ArrowDown ile satirlar arasinda gezme
- [ ] ArrowUp ile geri donme
- [ ] Enter/Space ile secim
- [ ] Home/End ile ilk/son satir
- [ ] VirtualGrid'de de calisiyor
- [ ] Screen reader ile uyumlu
