# P2-2/3/4: UX Iyilestirmeleri (Skeleton, Retry, Highlight)

## Oncelik: P2 (Guzel Olur)
## Durum: [ ] Bekliyor

---

## 1. Loading Skeleton State

### Mevcut Durum
Grid.tsx satirler 70-78: Duz "Loading..." text'i gosteriyor.

### Beklenen
Grid yapisiyla uyumlu skeleton/shimmer placeholder satirlari.

### Etkilenen Dosyalar
- `src/components/Grid.tsx` - Skeleton satirlar ekle
- `src/components/VirtualGrid.tsx` - Ayni skeleton
- `src/styles.css` - Skeleton animasyon CSS'i

### Tasarim
```tsx
// Loading state:
<tbody>
  {Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="lookup-select__grid-row--skeleton">
      {columns.map((col, j) => (
        <td key={j}>
          <div className="lookup-select__skeleton-line" />
        </td>
      ))}
    </tr>
  ))}
</tbody>
```

```css
.lookup-select__skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 2. Error Retry Mekanizmasi

### Mevcut Durum
Server fetch hatalarinda error mesaji gosteriyor ama retry secenegi yok.

### Beklenen
Error state'inde "Retry" butonu.

### Etkilenen Dosyalar
- `src/components/Grid.tsx` - Error state'e retry butonu ekle
- `src/components/LookupSelect.tsx` - Retry handler'i Grid'e aktar

### Tasarim
```tsx
// Grid.tsx error state:
{error && (
  <div className="lookup-select__grid-error">
    <span>{errorPrefix} {error}</span>
    {onRetry && (
      <button 
        type="button"
        className="lookup-select__button lookup-select__button--secondary"
        onClick={onRetry}
      >
        Retry
      </button>
    )}
  </div>
)}
```

---

## 3. Arama Sonuclarinda Text Highlighting

### Mevcut Durum
Arama yapildiginda eslesen satirlar filtreleniyor ama eslesen metin vurgulanmiyor.

### Beklenen
Aranan kelime hucrelerde `<mark>` ile vurgulaniyor.

### Etkilenen Dosyalar
- `src/components/Grid.tsx` - Cell render'da highlight
- `src/styles.css` - `<mark>` styling

### Tasarim
```typescript
function highlightText(text: string, search: string): React.ReactNode {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(search)})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase()
      ? <mark key={i} className="lookup-select__highlight">{part}</mark>
      : part
  );
}
```

## Dogrulama

- [ ] Loading state'inde skeleton satirlar gorunuyor
- [ ] Error state'inde retry butonu var ve calisiyor
- [ ] Arama yapildiginda eslesen metin vurgulaniyor
- [ ] Dark tema'da skeleton ve highlight dogru gorunuyor
