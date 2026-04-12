# P1-7: Test Kapsamini Arttir

## Oncelik: P1 (Onemli)
## Durum: [ ] Bekliyor

## Mevcut Durum

| Dosya | Satirlar | Kapsam |
|-------|----------|--------|
| `src/components/__tests__/LookupSelect.test.tsx` | 114 | Temel smoke testler |
| `src/internal/__tests__/core.test.ts` | 275 | SelectionManager, QueryManager, mapReturnValue |
| **Toplam** | **389** | ~2971 satir kaynak koda karsi (~13%) |

### Eksik Test Alanlari

- Modal.tsx (257 satir) - **0 test**
- Grid.tsx (334 satir) - **0 test**
- VirtualGrid.tsx (354 satir) - **0 test**
- Pagination.tsx (135 satir) - **0 test**
- Trigger.tsx (156 satir) - **0 test**
- useAccessibility.ts (140 satir) - **0 test**
- state.ts (250 satir) - **0 test**

## Olusturulmasi Gereken Test Dosyalari

### 1. `src/components/__tests__/Modal.test.tsx`
- [ ] Portal'a renderlanmasi
- [ ] Escape ile kapanma
- [ ] Focus trap (Tab/Shift+Tab)
- [ ] Body scroll lock
- [ ] Overlay click ile kapanma
- [ ] ARIA attributes dogru mu
- [ ] Onceki elemana focus donusu

### 2. `src/components/__tests__/Grid.test.tsx`
- [ ] Satir secimi (tekli/coklu)
- [ ] Checkbox indeterminate state
- [ ] Sort butonlari
- [ ] Disabled satirlar (selectableRow)
- [ ] Loading/Error/Empty state'leri
- [ ] Klavye ile secim (Enter/Space)
- [ ] Select-all checkbox

### 3. `src/components/__tests__/VirtualGrid.test.tsx`
- [ ] Gorunur satir hesaplanmasi
- [ ] Scroll olayinda satir guncelleme
- [ ] Overscan mantigi
- [ ] Memoized VirtualRow re-render kontrolu
- [ ] selectableRow ile indeterminate (P0-2 fix dogrulamasi)

### 4. `src/components/__tests__/Pagination.test.tsx`
- [ ] Sayfa hesaplanmasi
- [ ] Gorunur sayfalar (delta=2)
- [ ] Ellipsis ("...") gosterimi
- [ ] Previous/Next buton disabled state
- [ ] 1 sayfa ise render etmeme
- [ ] Kayit araligi gosterimi

### 5. `src/components/__tests__/Trigger.test.tsx`
- [ ] Placeholder gosterimi
- [ ] Tekli secim: secili text
- [ ] Coklu secim: tag'lar + "+N more"
- [ ] Clear butonu
- [ ] Klavye erisimi (Enter/Space)

### 6. `src/internal/__tests__/state.test.ts`
- [ ] Controlled value cozumleme
- [ ] Uncontrolled defaultValue
- [ ] Backup/restore on cancel
- [ ] Query state senkronizasyonu
- [ ] Modal open/close state

### 7. `src/hooks/__tests__/useAccessibility.test.ts`
- [ ] Focus trap calistigi dogrulama
- [ ] Keyboard shortcut'lar
- [ ] Screen reader duyurulari

## Coverage Config

`vitest.config.ts`'a ekle:

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

## Hedef

- Minimum %80 line coverage
- Minimum %75 branch coverage
- Her component icin en az 1 test dosyasi
