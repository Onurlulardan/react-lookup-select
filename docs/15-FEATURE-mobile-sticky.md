# P2-5/7: Mobil Responsive Modal + Sticky Grid Header

## Oncelik: P2 (Guzel Olur)
## Durum: [ ] Bekliyor

---

## 1. Mobil Responsive Modal

### Mevcut Durum
Modal sabit genislik (`--lookup-select-modal-width: 600px`) ve sabit max-height kullaniyor. Kucuk ekranlarda icerik tasiyor veya kullanilmasi zor.

### Beklenen
- Mobil (<768px): Full-width, full-height (bottom sheet pattern)
- Tablet (768-1024px): %90 genislik
- Desktop (>1024px): Mevcut 600px

### Etkilenen Dosyalar
- `src/styles.css` - Responsive breakpoint'lar ekle

### Tasarim
```css
/* Mobil: Bottom sheet */
@media (max-width: 767px) {
  .lookup-select__modal-overlay {
    align-items: flex-end;
  }
  
  .lookup-select__modal {
    width: 100%;
    max-width: 100%;
    max-height: 90vh;
    border-radius: var(--lookup-select-border-radius) 
                   var(--lookup-select-border-radius) 0 0;
    margin: 0;
  }
  
  .lookup-select__modal-content {
    max-height: 60vh;
  }
  
  /* Daha buyuk touch hedefleri */
  .lookup-select__grid-row {
    min-height: 48px;
  }
  
  .lookup-select__pagination-button {
    min-width: 44px;
    min-height: 44px;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  .lookup-select__modal {
    width: 90%;
    max-width: 90%;
  }
}
```

---

## 2. Sticky Grid Header

### Mevcut Durum
Grid header scroll ile birlikte yukarı kayboluyor. Uzun listelerde kullanici hangi sutuna baktigini kaybediyor.

**Not:** VirtualGrid zaten ayri header div kullaniyor (effectively sticky). Bu sadece normal Grid'i etkiliyor.

### Beklenen
`<thead>` scroll'da sabit kaliyor.

### Etkilenen Dosyalar
- `src/styles.css` - Sticky thead
- `src/components/Grid.tsx` - Gerekirse wrapper div

### Tasarim
```css
.lookup-select__grid {
  position: relative;
}

.lookup-select__grid thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--lookup-select-color-bg-secondary);
}

.lookup-select__grid thead th {
  /* Sticky border fix */
  border-bottom: 2px solid var(--lookup-select-color-border);
}
```

## Dogrulama

- [ ] Mobil (<768px): Modal bottom sheet olarak aciliyor
- [ ] Tablet: %90 genislik
- [ ] Desktop: 600px (mevcut davranis korunuyor)
- [ ] Touch hedefleri minimum 44px
- [ ] Grid header scroll'da sabit kaliyor
- [ ] Dark tema'da sticky header dogru gorunuyor
