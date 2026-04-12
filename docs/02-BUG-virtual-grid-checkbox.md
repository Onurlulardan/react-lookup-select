# P0-2: VirtualGrid Indeterminate Checkbox Hatasi

## Oncelik: P0 (Kritik)
## Durum: [ ] Bekliyor

## Sorun

`VirtualGrid.tsx` satirler 80-86'da header checkbox'un indeterminate state hesaplamasi `selectableRow` constraint'ini gormezden geliyor.

### Hatali Kod (VirtualGrid.tsx:80-86)

```typescript
React.useEffect(() => {
  if (headerCheckboxRef.current) {
    const hasSelected = selectedRows.length > 0;
    const hasUnselected = selectedRows.length < data.length;
    headerCheckboxRef.current.indeterminate = hasSelected && hasUnselected;
  }
}, [selectedRows.length, data.length]);
```

### Dogru Kod (Grid.tsx:163-175 - referans)

```typescript
// Grid.tsx bunu dogru yapiyor:
const selectableData = data.filter((row) => !isRowDisabled(row));
// ... selectableData.length ile karsilastirma
```

## Senaryo

- 10 satir mevcut
- 3 satir `selectableRow` ile disabled
- Kullanici 7 selectable satirin hepsini secer
- `selectedRows.length` (7) < `data.length` (10) = **true**
- Sonuc: Indeterminate gosteriyor (YANLIS - hepsi secili olmali)

## Ayrica `checked` Prop Hatasi

VirtualGrid.tsx ~satir 203:
```typescript
checked={selectedRows.length === data.length}
```
7 === 10 = false -> checkbox unchecked gosteriyor (YANLIS)

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/components/VirtualGrid.tsx` | 80-86 | selectableRow filtresi ekle |
| `src/components/VirtualGrid.tsx` | ~203 | checked prop'u duzelt |

## Cozum

```typescript
// Satir 80-86 yerine:
React.useEffect(() => {
  if (headerCheckboxRef.current) {
    const selectableData = selectableRow 
      ? data.filter(selectableRow) 
      : data;
    const hasSelected = selectedRows.length > 0;
    const hasUnselected = selectedRows.length < selectableData.length;
    headerCheckboxRef.current.indeterminate = hasSelected && hasUnselected;
  }
}, [selectedRows.length, data.length, selectableRow]);

// checked prop:
checked={selectedRows.length === (selectableRow ? data.filter(selectableRow).length : data.length)}
```

## Dogrulama

- [ ] selectableRow ile 10 satir, 3 disabled, 7 secili -> checkbox checked (indeterminate degil)
- [ ] selectableRow ile 10 satir, 3 disabled, 4 secili -> checkbox indeterminate
- [ ] selectableRow ile 10 satir, 3 disabled, 0 secili -> checkbox unchecked
- [ ] selectableRow olmadan normal davranis korunuyor
