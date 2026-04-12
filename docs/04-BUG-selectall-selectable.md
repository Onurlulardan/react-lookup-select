# P0-4: renderGrid onSelectAll selectableRow Hatasi

## Oncelik: P0 (Kritik)
## Durum: [ ] Bekliyor

## Sorun

`LookupSelect.tsx:323-336` - `renderGrid` render prop'una verilen `onSelectAll` callback'i `selectableRow` constraint'ini kontrol etmiyor. Disabled satirlar dahil tum satirlari toggle ediyor.

### Hatali Kod (LookupSelect.tsx:323-336)

```typescript
onSelectAll: mode === 'multiple'
  ? () => {
      const allIds = currentData.map(mapper.getId);
      const selectedIds = currentSelections.map(mapper.getId);
      if (allIds.length === selectedIds.length) {
        clearSelections();
      } else {
        currentData.forEach((row) => {
          if (!isRowSelected(row)) {
            toggleRowSelection(row);  // selectableRow kontrolu YOK!
          }
        });
      }
    }
  : undefined,
```

### Karsilastirma: Grid.tsx Dogru Yapiyor

Grid.tsx kendi icerisinde select-all'da `selectableRow` filtreliyor (satir 178).

## Senaryo

Kullanici `renderGrid` ile custom grid render ediyor:
- 10 satir, 3'u `selectableRow={() => false}` ile disabled
- "Select All" tiklaninca 10 satirin hepsi seciliyor (3 disabled dahil)
- Bu tutarsiz ve beklenmeyen davranis

## Etkilenen Dosyalar

| Dosya | Satirler | Degisiklik |
|-------|----------|------------|
| `src/components/LookupSelect.tsx` | 326-336 | selectableRow filtresi ekle |

## Cozum

```typescript
onSelectAll: mode === 'multiple'
  ? () => {
      const selectableData = selectableRow 
        ? currentData.filter(selectableRow) 
        : currentData;
      const allSelectableIds = selectableData.map(mapper.getId);
      const selectedIds = currentSelections.map(mapper.getId);
      
      const allSelected = allSelectableIds.every(id => 
        selectedIds.includes(id)
      );
      
      if (allSelected) {
        clearSelections();
      } else {
        selectableData.forEach((row) => {
          if (!isRowSelected(row)) {
            toggleRowSelection(row);
          }
        });
      }
    }
  : undefined,
```

## Dogrulama

- [ ] renderGrid ile selectableRow kullanildiginda select-all disabled satirlari atlıyor
- [ ] renderGrid kullanilmadan (default Grid) davranis ayni kaliyor
- [ ] Tum selectable satirlar secilince select-all toggle dogru calisiyor
- [ ] selectableRow olmadan tum satirlar seciliyor (mevcut davranis korunuyor)
